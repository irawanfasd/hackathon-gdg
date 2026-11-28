import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-server';
import { fail, readJson, isUuid } from '@/lib/http';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isUuid(params.id)) return fail('Competition not found', 404);
  const currentUser = await getAuthenticatedUser();

  const { data: comp } = await supabaseAdmin
    .from('competitions')
    .select('max_team_size')
    .eq('id', params.id)
    .single();

  if (!comp) {
    return fail('Competition not found', 404);
  }

  const { data: teams, error } = await supabaseAdmin
    .from('team_requests')
    .select(`
      *,
      members:team_members(
        *,
        user:users(id, full_name, contact_info)
      )
    `)
    .eq('competition_id', params.id)
    .order('created_at', { ascending: false });

  if (error) return fail(error.message, 500);

  const formattedTeams = (teams ?? []).map((team) => {
    const isMember = currentUser
      ? team.members.some((m: any) => m.user?.id === currentUser.id)
      : false;
    const canSeeContact = isMember && team.status === 'READY';

    const leaderMember = team.members.find((m: any) => m.is_leader);
    const leaderName = leaderMember?.user?.full_name ?? 'Ketua Tim';

    // Mapping members sesuai tipe TeamMember Irawan: { name, whatsapp? }
    const members = team.members.map((m: any) => ({
      name: m.user?.full_name ?? 'Anggota',
      whatsapp: canSeeContact ? m.user?.contact_info ?? undefined : undefined,
      role: m.role_assigned,
      is_leader: m.is_leader,
    }));

    // FORMING: peran yang dicari (string[]). READY: peran yang terisi (string[]).
    const soughtRoles = Array.isArray(team.required_roles)
      ? team.required_roles.map((r: any) => (typeof r === 'string' ? r : r.role))
      : [];
    const filledRoles = team.members.map((m: any) => m.role_assigned).filter(Boolean);

    return {
      id: team.id,
      competition_id: team.competition_id,
      name: team.title,
      status: team.status,
      leader: {
        name: leaderName,
        role: team.leader_role,
      },
      roles: team.status === 'READY' ? filledRoles : soughtRoles,
      skills: team.required_skills ?? [],
      members,
      capacity: comp.max_team_size,
      slots_remaining: Math.max(0, comp.max_team_size - members.length),
    };
  });

  return NextResponse.json({ teams: formattedTeams });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isUuid(params.id)) return fail('Competition not found', 404);
  const profile = await getAuthenticatedUser();
  if (!profile) return fail('Unauthorized', 401);

  const body = await readJson(request);
  if (!body) return fail('Body JSON tidak valid.', 400);

  const title = String(body.title ?? body.name ?? '').trim();
  const leader_role = String(body.leader_role ?? body.leader?.role ?? '').trim();
  const toStrings = (v: unknown) =>
    Array.isArray(v)
      ? v.map((x) => String(typeof x === 'string' ? x : (x as any)?.role ?? '').trim()).filter(Boolean)
      : [];
  const required_roles = toStrings(body.required_roles ?? body.roles);
  const required_skills = toStrings(body.required_skills ?? body.skills);

  if (!title) return fail('Nama tim wajib diisi.', 400);
  if (!leader_role) return fail('Peran ketua wajib diisi.', 400);
  if (required_roles.length === 0) return fail('Minimal satu peran yang dicari.', 400);

  const { data: comp } = await supabaseAdmin
    .from('competitions')
    .select('status, max_team_size, deadline')
    .eq('id', params.id)
    .maybeSingle();

  if (!comp || comp.status !== 'APPROVED') return fail('Competition not found', 404);
  if (new Date(comp.deadline).getTime() < Date.now()) {
    return fail('Pendaftaran lomba ini sudah ditutup.', 400);
  }
  if (required_roles.length + 1 > comp.max_team_size) {
    return fail(`Ukuran tim maksimal ${comp.max_team_size} orang (termasuk kamu).`, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('team_requests')
    .insert({
      competition_id: params.id,
      leader_id: profile.id,
      title,
      leader_role,
      required_roles,
      required_skills,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return fail('Kamu sudah tergabung di tim lain pada lomba ini.', 409);
    }
    return fail(error.message, 500);
  }

  // Pastikan ketua tercatat sebagai anggota (aman bila DB sudah punya trigger untuk ini).
  const { data: existingLeader } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('request_id', data.id)
    .eq('user_id', profile.id)
    .maybeSingle();

  if (!existingLeader) {
    const { error: leaderErr } = await supabaseAdmin.from('team_members').insert({
      request_id: data.id,
      competition_id: params.id,
      user_id: profile.id,
      role_assigned: leader_role,
      is_leader: true,
    });
    if (leaderErr) {
      await supabaseAdmin.from('team_requests').delete().eq('id', data.id); // rollback manual
      if (leaderErr.code === '23505') {
        return fail('Kamu sudah tergabung di tim lain pada lomba ini.', 409);
      }
      return fail(leaderErr.message, 500);
    }
  }

  return NextResponse.json({ team: data }, { status: 201 });
}
