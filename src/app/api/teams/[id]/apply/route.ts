import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const profile = await getAuthenticatedUser();
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { selected_role, message } = body;

  const { data, error } = await supabaseAdmin
    .from('team_applications')
    .insert({
      team_request_id: params.id,
      applicant_id: profile.id,
      selected_role,
      message: message ?? '',
      status: 'PENDING',
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Kamu sudah melamar ke tim ini sebelumnya.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ application: data }, { status: 201 });
}