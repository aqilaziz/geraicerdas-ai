# GeraiCerdas AI

MVP untuk Dicoding Challenge 973: **IDCamp Developer Challenge #2 - Digitalization & Acceleration of MSMEs with Generative AI**.

GeraiCerdas AI membantu pemilik UMKM membaca transaksi, stok, harga, dan konten promosi dari satu dashboard. Aplikasi ini berjalan sebagai web app React/Vite dan langsung memuat data contoh UMKM Indonesia agar bisa dinilai tanpa setup tambahan.

## Fitur utama

- Dashboard cashflow, margin, channel penjualan, biaya, dan alarm stok.
- AI Copilot lokal untuk rekomendasi growth, rencana eksperimen, copy promosi, dan balasan pelanggan.
- Mode endpoint OpenAI-compatible opsional untuk generative AI sungguhan melalui proxy/API yang mendukung CORS.
- Kalkulator harga yang menghitung modal, fee marketplace, margin, harga kompetitor, dan saran harga.
- Live market signal USD/IDR untuk membaca risiko bahan baku, kemasan, dan iklan platform global.
- Import/export CSV transaksi serta input transaksi manual.
- Data profil UMKM dan produk tersimpan di browser.

## Modifikasi Utama

GeraiCerdas AI dikembangkan dari basis awal dashboard keuangan FinBoard, lalu dimodifikasi besar untuk kebutuhan Dicoding Challenge 973. Perubahan yang sudah dibuat:

- Rebrand produk dari dashboard finansial personal menjadi **GeraiCerdas AI**, AI business copilot untuk UMKM Indonesia.
- Mengganti data demo menjadi skenario UMKM lokal: produk makanan ringan, WhatsApp, Instagram, Shopee, reseller, biaya bahan baku, logistik, iklan, dan operasional.
- Menambahkan **Dashboard UMKM** untuk membaca revenue, laba, margin, channel terbaik, komposisi biaya, alarm stok, dan live market signal USD/IDR.
- Menambahkan **Data & AI** untuk profil UMKM, upload CSV, input transaksi manual, konfigurasi endpoint AI, tombol simpan profil, dan tombol simpan konfigurasi AI.
- Menambahkan **AI Copilot** untuk diagnosis usaha, eksperimen growth, copy promosi, balasan pelanggan, dan mode Generate AI memakai endpoint OpenAI-compatible.
- Menambahkan **Pricing & Stok** untuk kalkulator modal, harga jual, fee marketplace, harga kompetitor, margin, harga target, dan risiko restock.
- Menambahkan dokumentasi submission: `PROJECT_BRIEF.md`, `USER_GUIDE.md`, dan `SUBMISSION.md`.

## Attribution

Basis awal proyek ini berasal dari FinBoard oleh `khanirfan18`. GeraiCerdas AI adalah hasil modifikasi besar untuk use case baru: digitalisasi dan akselerasi UMKM dengan Generative AI. Jika repo sumber memiliki ketentuan lisensi tambahan, ketentuan tersebut tetap perlu dihormati.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Format CSV

Kolom yang didukung:

```csv
Date,Description,Amount,Channel,Type,Product,Quantity,Customer
```

Nominal pendapatan ditulis positif, biaya ditulis negatif.

## Panduan pengguna

Lihat [USER_GUIDE.md](./USER_GUIDE.md) untuk alur lengkap penggunaan aplikasi, mulai dari menu pertama yang dibuka, input transaksi, konfigurasi API AI, AI Copilot, pricing, stok, sampai export transaksi.

## Link Aplikasi

Untuk submission Dicoding, field **Link Aplikasi** bisa memakai repository GitHub selama repository public dan instruksi menjalankan aplikasi tersedia. Repository:

```text
https://github.com/aqilaziz/geraicerdas-ai
```

Live deploy tetap disarankan sebagai nilai tambah karena juri bisa mencoba aplikasi langsung tanpa setup.

## Deployment Opsional

Project ini sudah disiapkan untuk deploy sebagai Vite SPA jika ingin menyediakan live app.

Vercel:

```bash
npm run build
npx vercel --prod
```

Netlify:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

Konfigurasi route refresh tersedia di `vercel.json` dan `netlify.toml`.

## Submission notes

Nama aplikasi: **GeraiCerdas AI**  
Platform: Web app  
Target pengguna: UMKM Indonesia yang butuh digitalisasi operasional dan pemasaran tanpa tim khusus  
File ringkasan submission: [PROJECT_BRIEF.md](./PROJECT_BRIEF.md)  
Checklist dan komentar submission: [SUBMISSION.md](./SUBMISSION.md)
