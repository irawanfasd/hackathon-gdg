import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { fail } from '@/lib/http';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get('field');

  let query = supabaseAdmin
    .from('competitions')
    .select('*')
    .eq('status', 'APPROVED')
    .order('deadline', { ascending: true });

  // UI memakai label "Semua", API lama memakai "ALL" — dua-duanya berarti tanpa filter.
  if (field && field !== 'ALL' && field !== 'Semua') {
    query = query.eq('field', field);
  }

  const { data, error } = await query;
  if (error) return fail(error.message, 500);

  const competitions = (data ?? []).map((c) => ({
    ...c,
    eligibility: c.eligibility_note ?? undefined,
  }));

  return NextResponse.json({ competitions });
}
