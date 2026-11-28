import { NextResponse } from 'next/server';
import { requireStudent, handleApiError } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { extractCertificateData } from '@/lib/gemini/vision-extractor';

export async function POST(req: Request) {
  try {
    // 1. Verifikasi sesi & pastikan role === 'student'
    const student = await requireStudent(req);

    const formData = await req.formData();
    const file = formData.get('certificate') as File | null;
    const competitionId = formData.get('competition_id') as string | null;
    const teamRequestId = formData.get('team_request_id') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'File sertifikat wajib diunggah.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Simpan ke private bucket 'certificates' di folder milik user_id
    const fileExt = file.name.split('.').pop() || 'pdf';
    const storagePath = `${student.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('certificates')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 3. Ekstraksi data dengan Gemini Structured Outputs + Zod
    const { parsed, raw_extraction } = await extractCertificateData(buffer, file.type);

    // 4. Simpan ke tabel achievements dengan status DRAFT_AI
    const { data: achievement, error: insertError } = await supabaseAdmin
      .from('achievements')
      .insert({
        user_id: student.id,
        competition_id: competitionId || null,
        team_request_id: teamRequestId || null,
        competition_name: parsed.competition_name,
        organizer: parsed.organizer,
        achievement_rank: parsed.achievement_rank,
        level: parsed.level,
        issue_date: parsed.issue_date,
        certificate_url: storagePath, // Simpan path objek di private bucket, bukan public URL
        raw_extraction,
        status: 'DRAFT_AI',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      achievement,
      needs_review_fields: parsed.needs_review_fields, // Untuk highlight di UI pre-filled form
    });
  } catch (error) {
    return handleApiError(error);
  }
}