import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabaseAdmin
    .from('competitions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: 'Competition not found' }, { status: 404 });
  }

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

  const body = await request.json();
  const { status } = body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
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
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ competition: data });
}