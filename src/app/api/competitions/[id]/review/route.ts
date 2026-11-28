import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, handleApiError } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

const ReviewCompetitionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  // Admin bisa mengoreksi field yang ditandai needs_review_fields sebelum approve
  title: z.string().min(2).optional(),
  organizer: z.string().min(2).optional(),
  field: z.string().min(2).optional(),
  min_team_size: z.number().int().min(1).optional(),
  max_team_size: z.number().int().min(1).optional(),
  eligibility_note: z.string().min(2).optional(),
  deadline: z.string().datetime({ offset: true }).optional(),
  registration_url: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Wajib role === 'admin'
    const admin = await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const parsed = ReviewCompetitionSchema.parse(body);

    const { action, ...updatedFields } = parsed;
    const nextStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';

    const { data, error } = await supabaseAdmin
      .from('competitions')
      .update({
        ...updatedFields,
        status: nextStatus,
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Menangkap error database CHECK constraint jika ada kolom wajib yang masih null saat APPROVED
      return NextResponse.json(
        { error: `Gagal memperbarui status lomba: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ competition: data });
  } catch (error) {
    return handleApiError(error);
  }
}