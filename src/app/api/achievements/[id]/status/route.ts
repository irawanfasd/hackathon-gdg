import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedUser, handleApiError, AuthError } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AchievementLevelEnum } from '@/lib/schemas/certificate-extraction';

const StudentConfirmSchema = z.object({
  action: z.literal('confirm'),
  competition_name: z.string().min(2),
  organizer: z.string().min(2),
  achievement_rank: z.string().min(1),
  level: AchievementLevelEnum,
  issue_date: z.string().min(4),
});

const AdminVerifySchema = z.object({
  action: z.enum(['verify', 'reject']),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    const { id } = await params;
    const body = await req.json();

    // Ambil data prestasi saat ini
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('achievements')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Data prestasi tidak ditemukan.' }, { status: 404 });
    }

    // ALUR 1: Mahasiswa mengonfirmasi pre-filled form (DRAFT_AI -> STUDENT_CONFIRMED)
    if (user.role === 'student') {
      if (existing.user_id !== user.id) {
        throw new AuthError('Anda hanya dapat mengonfirmasi sertifikat milik sendiri.', 403);
      }

      const parsed = StudentConfirmSchema.parse(body);

      const { data: confirmed, error: updateError } = await supabaseAdmin
        .from('achievements')
        .update({
          competition_name: parsed.competition_name,
          organizer: parsed.organizer,
          achievement_rank: parsed.achievement_rank,
          level: parsed.level,
          issue_date: parsed.issue_date,
          status: 'STUDENT_CONFIRMED',
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return NextResponse.json({ achievement: confirmed });
    }

    // ALUR 2: Admin Kemahasiswaan memverifikasi prestasi (STUDENT_CONFIRMED -> VERIFIED / REJECTED)
    if (user.role === 'admin') {
      const parsed = AdminVerifySchema.parse(body);
      const nextStatus = parsed.action === 'verify' ? 'VERIFIED' : 'REJECTED';

      const { data: verified, error: updateError } = await supabaseAdmin
        .from('achievements')
        .update({
          status: nextStatus,
          verified_by: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return NextResponse.json({ achievement: verified });
    }

    throw new AuthError('Role pengguna tidak dikenali.', 403);
  } catch (error) {
    return handleApiError(error);
  }
}