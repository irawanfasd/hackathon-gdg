# Panduan Menjalankan Project: From Poster to Portfolio

Project ini dibangun dengan **Next.js 14 (App Router)**, **TypeScript**, dan **Tailwind CSS**.

---

## 1. Prasyarat (Wajib Terinstall)

Pastikan komputer Anda sudah memiliki **Node.js** versi **18.17 atau lebih baru** (disarankan Node.js 20 LTS).

Cek lewat Terminal / Command Prompt / PowerShell:

```bash
node -v
npm -v
```

Jika belum ada, unduh dan install dari [https://nodejs.org](https://nodejs.org) (pilih versi **LTS**).

---

## 2. Ekstrak File ZIP

1. Ekstrak `from-poster-to-portfolio-v2.zip` ke folder pilihan Anda, misalnya `from-poster-to-portfolio`.
2. Buka folder tersebut di **VS Code** (atau buka Terminal/PowerShell dan masuk ke folder tersebut):

```bash
cd from-poster-to-portfolio
```

---

## 3. Install Dependencies & Jalankan Server

### Cara Manual (Disarankan)

```bash
# 1. Install semua package (cukup sekali di awal)
npm install

# 2. Jalankan mode development
npm run dev
```

### Cara Cepat (1 Klik / 1 Perintah)
- **Windows:** Klik dua kali file `run.bat`
- **macOS / Linux:** Jalankan `bash run.sh`

---

## 4. Buka di Browser

Setelah terminal menampilkan `Ready in ...`, buka browser dan kunjungi:

- **Halaman Utama (Katalog Lomba):** `http://localhost:3000`
- **Detail Lomba:** Klik salah satu kartu lomba, misal `http://localhost:3000/competitions/gemastik-2026`
- **Demo Review & Form Sertifikat:** `http://localhost:3000/review-demo`

Untuk menghentikan server, tekan **Ctrl + C** di terminal.

---

## 5. Build untuk Produksi (Opsional)

Jika ingin menguji versi produksi sebelum deploy (misal ke Vercel):

```bash
npm run build
npm run start
```

---

## 6. Mengganti Data Dummy / File Asli

Jika Anda memiliki versi asli dari file berikut, cukup timpa file yang ada di dalam project:
- `src/lib/api.ts` — Helper koneksi API backend Anda.
- `src/lib/mock.ts` — Daftar lomba.
- `tailwind.config.ts` — Kustomisasi warna & font Tailwind.

---

## 7. Troubleshooting (Jika Ada Error)

| Masalah | Penyebab | Solusi |
|---|---|---|
| `'npm' is not recognized` | Node.js belum terinstall / terminal belum direstart | Install Node.js LTS lalu tutup & buka ulang terminal |
| `Port 3000 is in use` | Port 3000 sedang dipakai aplikasi lain | Jalankan di port lain: `npx next dev -p 3001` |
| Error `EACCES` atau permission di Mac/Linux | Hak akses folder | Jangan pakai `sudo`; pastikan kepemilikan folder benar |
| Halaman tidak berubah saat edit kode | Cache `.next` bermasalah | Hapus folder `.next` lalu jalankan `npm run dev` lagi |
| Gagal saat `npm install` | Koneksi internet / registry | Coba jalankan ulang `npm install --legacy-peer-deps` |
