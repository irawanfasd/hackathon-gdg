import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSessionClient, supabaseAdmin } from '@/lib/supabase/server';
import { handleApiError, AuthError } from '@/lib/auth';

const RegisterProfileSchema = z.object({
  nim: z.string().min(5),
  full_name: z.string().min(2),
  faculty: z.string().min(2),
  major: z.string().min(2),
  semester: z.number().int().min(1).max(14),
  skills: z.array(z.string()).default([]),
  bio: z.string().optional(),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  contact_info: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const supabase = await createSessionClient(req);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new AuthError('Sesi autentikasi tidak ditemukan.', 401);
    }

    const body = await req.json();
    const parsed = RegisterProfileSchema.parse(body);

    
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: user.id,
          email: user.email,
          ...parsed,
          role: 'student', // Tetap di-hardcode 'student'[cite: 1]
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'NIM atau email sudah terdaftar.' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}