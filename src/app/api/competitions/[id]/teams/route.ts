import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const currentUser = await getAuthenticatedUser();

  const { data: comp } = await supabaseAdmin
    .from('competitions')
    .select('max_team_size')
    .eq('id', params.id)
    .single();

  if (!comp) {
    return NextResponse.json({ message: 'Competition not found' }, { status: 404 });
  }

  const { data: teams, error } = await supabaseAdmin
    .from('team_requests')
    .select(`
      *,
      members:team_members(
        *,
        user:users(id, full_name, major, skills, portfolio_url, contact_info)
      )
    `)
    .eq('competition_id', params.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

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
  const profile = await getAuthenticatedUser();
  if (!profile) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const title = body.title ?? body.name;
  const leader_role = body.leader_role ?? body.leader?.role;
  const required_roles = body.required_roles ?? body.roles ?? [];
  const required_skills = body.required_skills ?? body.skills ?? [];

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
      return NextResponse.json(
        { message: 'Kamu sudah tergabung di tim lain pada lomba ini.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ team: data }, { status: 201 });
}