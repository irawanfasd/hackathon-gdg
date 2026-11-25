export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const FRIENDLY: Record<number, string> = {
  401: 'Sesi kamu berakhir. Masuk lagi untuk melanjutkan.',
  403: 'Kamu tidak punya akses untuk aksi ini.',
  409: 'Kamu sudah tergabung di tim lain pada lomba ini.',
};

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, { credentials: 'same-origin', ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      res.status === 409
        ? body?.message ?? FRIENDLY[409]
        : FRIENDLY[res.status] ?? body?.message ?? 'Terjadi kesalahan. Coba lagi.';
    throw new ApiError(res.status, message);
  }
  return res.json();
}

export const api = <T>(path: string, init: RequestInit = {}) =>
  request<T>(path, { ...init, headers: { 'Content-Type': 'application/json', ...init.headers } });

// Untuk unggah poster/sertifikat: kirim ke API route, jangan ke Storage langsung dari browser.
export const upload = <T>(path: string, form: FormData) =>
  request<T>(path, { method: 'POST', body: form });
