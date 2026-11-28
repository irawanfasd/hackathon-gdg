import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-server';
import { fail, readJson, isUuid } from '@/lib/http';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isUuid(params.id)) return fail('Competition not found', 404);

  const { data, error } = await supabaseAdmin
    .from('competitions')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (error) return fail(error.message, 500);

  // Lomba PENDING/REJECTED tidak boleh terlihat publik; admin tetap boleh (untuk moderasi).
  if (data && data.status !== 'APPROVED') {
    const viewer = await getAuthenticatedUser();
    if (viewer?.role !== 'admin') return fail('Competition not found', 404);
  }
  if (!data) return fail('Competition not found', 404);

  return NextResponse.json({
    competition: {
      ...data,
      eligibility: data.eligibility_note ?? undefined,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const profile = await getAuthenticatedUser();
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
  }

  const body = await readJson(request);
  const status = body?.status;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return fail('Invalid status', 400);
  }

  const { data, error } = await supabaseAdmin
    .from('competitions')
    .update({
      status,
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .maybeSingle();

  if (error) return fail(error.message, 500);
  if (!data) return fail('Competition not found', 404);

  return NextResponse.json({ competition: data });
}