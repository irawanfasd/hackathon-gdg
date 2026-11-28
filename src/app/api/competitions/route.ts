import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get('field');

  let query = supabaseAdmin
    .from('competitions')
    .select('*')
    .eq('status', 'APPROVED')
    .order('deadline', { ascending: true });

  if (field && field !== 'ALL') {
    query = query.eq('field', field);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const competitions = (data ?? []).map((c) => ({
    ...c,
    eligibility: c.eligibility_note ?? undefined,
  }));

  return NextResponse.json({ competitions });
}