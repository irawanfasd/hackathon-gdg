import { NextResponse } from 'next/server';
import { createSessionClient, supabaseAdmin } from '@/lib/supabase/server';

export type UserRole = 'student' | 'admin';

export interface AuthenticatedProfile {
  id: string;
  nim: string;
  full_name: string;
  email: string;
  faculty: string;
  major: string;
  semester: number;
  role: UserRole;
}

export class AuthError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 401
  ) {
    super(message);
  }
}

/**
 * 1. Verifikasi sesi server via supabase.auth.getUser() & cek role dari public.users
 */
export async function getAuthenticatedUser(req?: Request): Promise<AuthenticatedProfile> {
  const supabase = await createSessionClient(req);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthError('Sesi tidak valid atau pengguna belum login.', 401);
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('id, nim, full_name, email, faculty, major, semester, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new AuthError('Profil pengguna tidak ditemukan di sistem.', 403);
  }

  return profile as AuthenticatedProfile;
}

/**
 * 2. Guard Role Khusus Mahasiswa atau Admin
 */
export async function requireRole(
  allowedRoles: UserRole[],
  req?: Request
): Promise<AuthenticatedProfile> {
  const profile = await getAuthenticatedUser(req);

  if (!allowedRoles.includes(profile.role)) {
    throw new AuthError(
      `Akses ditolak. Endpoint ini hanya untuk role: ${allowedRoles.join(', ')}.`,
      403
    );
  }

  return profile;
}

export const requireStudent = (req?: Request) => requireRole(['student'], req);
export const requireAdmin = (req?: Request) => requireRole(['admin'], req);

/**
 * 3. Proteksi contact_info: hanya dibuka ke sesama anggota resmi jika status tim READY
 */
export function sanitizeMemberContact<T extends { user_id?: string; contact_info?: string | null }>(
  member: T,
  options: {
    teamStatus: 'FORMING' | 'READY' | 'CLOSED';
    isOfficialMember: boolean;
    requesterId: string;
  }
): T {
  const isSelf = member.user_id === options.requesterId;
  const canViewContact =
    isSelf || (options.teamStatus === 'READY' && options.isOfficialMember);

  if (!canViewContact) {
    return {
      ...member,
      contact_info: null, // Sembunyikan nomor WA/ID Line selama lamaran/FORMING
    };
  }

  return member;
}

/**
 * 4. Generate Short-Lived Signed URL (misal 15 menit = 900 detik) untuk bucket 'certificates'
 */
export async function generateCertificateSignedUrl(
  certificatePath: string,
  expiresInSeconds: number = 900
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from('certificates')
    .createSignedUrl(certificatePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Gagal membuat Signed URL sertifikat: ${error?.message}`);
  }

  return data.signedUrl;
}

/**
 * Helper standar untuk menangani error AuthZ di API Route
 */
export function handleApiError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  console.error('[API Error Detail]:', error);

  const message =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message: unknown }).message)
      : 'Internal Server Error';

  return NextResponse.json({ error: message }, { status: 500 });
}