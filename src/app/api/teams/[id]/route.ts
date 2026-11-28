import { NextResponse } from 'next/server';
import {
  getAuthenticatedUser,
  sanitizeMemberContact,
  handleApiError,
} from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verifikasi sesi pengguna
    const requester = await getAuthenticatedUser(req);
    const { id: requestId } = await params;

    // 2. Ambil data Team Request
    const { data: team, error: teamError } = await supabaseAdmin
      .from('team_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Tim tidak ditemukan.' }, { status: 404 });
    }

    // 3. Ambil daftar anggota resmi beserta profil user
    const { data: members, error: membersError } = await supabaseAdmin
      .from('team_members')
      .select(`
        id,
        user_id,
        role_assigned,
        is_leader,
        joined_at,
        users (
          full_name,
          nim,
          major,
          semester,
          skills,
          portfolio_url,
          contact_info
        )
      `)
      .eq('request_id', requestId);

    if (membersError) throw membersError;

    // 4. Cek apakah requester adalah anggota resmi tim ini
    const isOfficialMember = (members || []).some(
      (m) => m.user_id === requester.id
    );

    // 5. Sanitasi contact_info berdasarkan status tim (READY) & keanggotaan resmi
    const sanitizedMembers = (members || []).map((member) => {
      const userObj = Array.isArray(member.users) ? member.users[0] : member.users;
      const sanitizedUser = sanitizeMemberContact(
        {
          user_id: member.user_id,
          ...userObj,
        },
        {
          teamStatus: team.status,
          isOfficialMember,
          requesterId: requester.id,
        }
      );

      return {
        ...member,
        users: sanitizedUser,
      };
    });

    return NextResponse.json({
      team,
      members: sanitizedMembers,
      is_official_member: isOfficialMember,
    });
  } catch (error) {
    return handleApiError(error);
  }
}