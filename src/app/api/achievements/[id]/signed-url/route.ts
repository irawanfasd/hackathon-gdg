import { NextResponse } from 'next/server';
import {
  getAuthenticatedUser,
  generateCertificateSignedUrl,
  handleApiError,
  AuthError,
} from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    const { id } = await params;

    const { data: achievement, error } = await supabaseAdmin
      .from('achievements')
      .select('id, user_id, certificate_url')
      .eq('id', id)
      .single();

    if (error || !achievement) {
      return NextResponse.json({ error: 'Data prestasi tidak ditemukan.' }, { status: 404 });
    }

    // Hanya Admin atau pemilik sertifikat yang boleh meminta Signed URL
    if (user.role !== 'admin' && achievement.user_id !== user.id) {
      throw new AuthError('Anda tidak berhak mengakses dokumen sertifikat ini.', 403);
    }

    // Generate Signed URL berumur singkat (15 menit)
    const signedUrl = await generateCertificateSignedUrl(achievement.certificate_url, 900);

    return NextResponse.json({ signed_url: signedUrl, expires_in: 900 });
  } catch (error) {
    return handleApiError(error);
  }
}