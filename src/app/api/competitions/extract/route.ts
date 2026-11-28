import { NextResponse } from 'next/server';
import { getAuthenticatedUser, handleApiError } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { extractPosterData } from '@/lib/gemini/vision-extractor';

export async function POST(req: Request) {
  let competitionId: string | null = null;

  try {
    // 1. Verifikasi sesi pengguna (harus login)
    const user = await getAuthenticatedUser(req);

    const formData = await req.formData();
    const file = formData.get('poster') as File | null;
    const source = (formData.get('source') as string) || 'manual';

    if (!file) {
      return NextResponse.json({ error: 'File poster wajib diunggah.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Upload gambar poster ke Public Bucket 'posters'
    const fileExt = file.name.split('.').pop() || 'jpg';
    const storagePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('posters')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('posters').getPublicUrl(storagePath);

    // 3. Insert baris awal ke tabel `competitions` dengan status PROCESSING
    const { data: initialRow, error: insertError } = await supabaseAdmin
      .from('competitions')
      .insert({
        poster_url: publicUrl,
        source,
        status: 'PROCESSING',
      })
      .select('id')
      .single();

    if (insertError || !initialRow) throw insertError;
    competitionId = initialRow.id;

    // 4. Ekstraksi data menggunakan Gemini Structured Outputs + validasi Zod
    const { parsed, raw_extraction } = await extractPosterData(buffer, file.type);

    // 5. Update status menjadi PENDING_REVIEW beserta hasil ekstraksi & audit fields
    const { data: updatedCompetition, error: updateError } = await supabaseAdmin
      .from('competitions')
      .update({
        title: parsed.title,
        organizer: parsed.organizer,
        field: parsed.field,
        min_team_size: parsed.min_team_size,
        max_team_size: parsed.max_team_size,
        eligibility_note: parsed.eligibility_note,
        deadline: parsed.deadline,
        raw_deadline_text: parsed.raw_deadline_text,
        registration_url: parsed.registration_url,
        raw_extraction,
        needs_review_fields: parsed.needs_review_fields,
        status: 'PENDING_REVIEW',
      })
      .eq('id', competitionId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(
      {
        competition: updatedCompetition,
        needs_review_fields: parsed.needs_review_fields,
      },
      { status: 201 }
    );
  } catch (error) {
    // Toleransi Error AI: Tandai baris sebagai FAILED jika ekstraksi gagal setelah insert awal
    if (competitionId) {
      await supabaseAdmin
        .from('competitions')
        .update({ status: 'FAILED' })
        .eq('id', competitionId);
    }
    return handleApiError(error);
  }
}