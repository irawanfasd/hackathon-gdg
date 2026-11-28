import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const profile = await getAuthenticatedUser();
  if (!profile) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { action } = await request.json(); // 'ACCEPTED' atau 'REJECTED'
  if (!['ACCEPTED', 'REJECTED'].includes(action)) {
    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  }

  // Ambil data lamaran + team_request + max_team_size lomba
  const { data: appData, error: appErr } = await supabaseAdmin
    .from('team_applications')
    .select(`
      *,
      team_request:team_requests(
        id, competition_id, leader_id, status,
        competition:competitions(max_team_size)
      )
    `)
    .eq('id', params.id)
    .single();

  if (appErr || !appData) {
    return NextResponse.json({ message: 'Application not found' }, { status: 404 });
  }

  if (appData.team_request.leader_id !== profile.id) {
    return NextResponse.json({ message: 'Forbidden: Only team leader can review' }, { status: 403 });
  }

  if (action === 'REJECTED') {
    const { data: updated } = await supabaseAdmin
      .from('team_applications')
      .update({ status: 'REJECTED' })
      .eq('id', params.id)
      .select()
      .single();
    return NextResponse.json({ application: updated });
  }

  // Cek kuota anggota saat ini menggunakan request_id
  const maxSize = appData.team_request.competition.max_team_size;
  const { count } = await supabaseAdmin
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('request_id', appData.team_request_id);

  if ((count ?? 0) >= maxSize) {
    return NextResponse.json({ message: 'Slot tim sudah penuh.' }, { status: 400 });
  }

  // Masukkan pelamar ke team_members (sesuai kolom DB: request_id & role_assigned)
  const { error: memberErr } = await supabaseAdmin
    .from('team_members')
    .insert({
      request_id: appData.team_request_id,
      competition_id: appData.team_request.competition_id,
      user_id: appData.applicant_id,
      role_assigned: appData.selected_role,
      is_leader: false,
    });

  if (memberErr) {
    if (memberErr.code === '23505') {
      return NextResponse.json(
        { message: 'Pelamar ini sudah tergabung di tim lain pada lomba yang sama.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: memberErr.message }, { status: 500 });
  }

  // Update status lamaran menjadi ACCEPTED
  const { data: updatedApp } = await supabaseAdmin
    .from('team_applications')
    .update({ status: 'ACCEPTED' })
    .eq('id', params.id)
    .select()
    .single();

  // Jika kuota penuh setelah menerima anggota ini, ubah status tim menjadi READY
  if ((count ?? 0) + 1 >= maxSize) {
    await supabaseAdmin
      .from('team_requests')
      .update({ status: 'READY' })
      .eq('id', appData.team_request_id);
  }

  return NextResponse.json({ application: updatedApp });
}