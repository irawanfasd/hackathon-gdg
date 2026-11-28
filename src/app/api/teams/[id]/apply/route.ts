import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-server';
import { fail, readJson, isUuid } from '@/lib/http';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isUuid(params.id)) return fail('Tim tidak ditemukan.', 404);
  const profile = await getAuthenticatedUser();
  if (!profile) return fail('Unauthorized', 401);

  const body = await readJson(request);
  if (!body) return fail('Body JSON tidak valid.', 400);

  const selected_role = String(body.selected_role ?? '').trim();
  const message = String(body.message ?? '').trim().slice(0, 500);
  if (!selected_role) return fail('Pilih peran yang kamu lamar.', 400);

  const { data: team } = await supabaseAdmin
    .from('team_requests')
    .select('id, status, leader_id, required_roles')
    .eq('id', params.id)
    .maybeSingle();

  if (!team) return fail('Tim tidak ditemukan.', 404);
  if (team.status !== 'FORMING') return fail('Tim ini sudah tidak membuka lamaran.', 400);
  if (team.leader_id === profile.id) return fail('Kamu ketua tim ini.', 400);

  const roles: string[] = Array.isArray(team.required_roles)
    ? team.required_roles.map((r: any) => (typeof r === 'string' ? r : r?.role))
    : [];
  if (!roles.includes(selected_role)) {
    return fail('Peran yang dipilih tidak dicari oleh tim ini.', 400);
  }

  const { data, error } = await supabaseAdmin
    .from('team_applications')
    .insert({
      team_request_id: params.id,
      applicant_id: profile.id,
      selected_role,
      message,
      status: 'PENDING',
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return fail('Kamu sudah melamar ke tim ini sebelumnya.', 409);
    return fail(error.message, 500);
  }

  return NextResponse.json({ application: data }, { status: 201 });
}
