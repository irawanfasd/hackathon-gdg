import { NextResponse } from 'next/server';

// Semua error API memakai key `message` supaya cocok dengan apiFetch di src/lib/api.ts
export function fail(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export async function readJson(request: Request): Promise<Record<string, any> | null> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? body : null;
  } catch {
    return null;
  }
}

export const isUuid = (v: unknown): v is string =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
