import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-server';
import { fail, readJson, isUuid } from '@/lib/http';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isUuid(params.id)) return fail('Application not found', 404);
  const profile = await getAuthenticatedUser();
  if (!profile) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await readJson(request);
  const action = body?.action; // 'ACCEPTED' atau 'REJECTED'
  if (!['ACCEPTED', 'REJECTED'].includes(action)) {
    return fail('Invalid action', 400);
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
    .maybeSingle();

  if (appErr || !appData || !appData.team_request) {
    return fail('Application not found', 404);
  }

  if (appData.team_request.leader_id !== profile.id) {
    return NextResponse.json({ message: 'Forbidden: Only team leader can review' }, { status: 403 });
  }

  // Lamaran yang sudah diproses tidak boleh diubah lagi (mencegah double-accept).
  if (appData.status !== 'PENDING') {
    return fail('Lamaran ini sudah diproses.', 409);
  }

  if (action === 'REJECTED') {
    const { data: updated, error: rejErr } = await supabaseAdmin
      .from('team_applications')
      .update({ status: 'REJECTED' })
      .eq('id', params.id)
      .eq('status', 'PENDING')
      .select()
      .single();
    if (rejErr) return fail(rejErr.message, 500);
    return NextResponse.json({ application: updated });
  }

  if (appData.team_request.status !== 'FORMING') {
    return fail('Tim sudah lengkap atau ditutup.', 400);
  }

  // Cek kuota anggota saat ini menggunakan request_id
  const maxSize = appData.team_request.competition.max_team_size;
  const { count, error: countErr } = await supabaseAdmin
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('request_id', appData.team_request_id);
  if (countErr) return fail(countErr.message, 500);

  if ((count ?? 0) >= maxSize) {
    return fail('Slot tim sudah penuh.', 400);
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
      return fail('Pelamar ini sudah tergabung di tim lain pada lomba yang sama.', 409);
    }
    return fail(memberErr.message, 500);
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

    // Tim sudah penuh: sisa lamaran PENDING otomatis ditolak.
    await supabaseAdmin
      .from('team_applications')
      .update({ status: 'REJECTED' })
      .eq('team_request_id', appData.team_request_id)
      .eq('status', 'PENDING');
  }

  return NextResponse.json({ application: updatedApp });
}