# Project Brief - GeraiCerdas AI

## Ringkasan

GeraiCerdas AI adalah web app untuk membantu UMKM Indonesia mempercepat digitalisasi bisnis dengan Generative AI. Produk ini mengubah data transaksi sederhana menjadi insight operasional, rekomendasi harga, alarm stok, konten promosi, dan balasan pelanggan yang siap digunakan di WhatsApp, Instagram, marketplace, atau toko offline.

## Masalah

Banyak UMKM masih mencatat transaksi manual, sulit membaca margin, tidak tahu channel mana yang paling efektif, sering terlambat restock, dan tidak punya waktu membuat konten promosi maupun membalas calon pelanggan dengan cepat.

## Solusi

GeraiCerdas AI menyediakan:

- Dashboard keuangan UMKM: revenue, biaya, laba, margin, channel, komposisi biaya.
- AI Copilot: diagnosis usaha, rekomendasi growth, eksperimen 7 hari, copy promosi, dan balasan pelanggan.
- Pricing & Restock: kalkulator harga berbasis modal, fee marketplace, kompetitor, stok, lead time, dan rata-rata penjualan.
- Live Market Signal: kurs USD/IDR publik sebagai sinyal eksternal untuk risiko bahan baku, kemasan, dan iklan platform global.
- Data & AI: import CSV, input transaksi cepat, profil UMKM, dan endpoint OpenAI-compatible opsional.

## Kesesuaian Tema

Tema challenge adalah digitalisasi dan akselerasi UMKM dengan Generative AI. GeraiCerdas AI berfokus langsung pada kebutuhan UMKM: pencatatan transaksi, pemasaran digital, respons pelanggan, pricing, dan stok. AI dipakai sebagai copilot praktis, bukan sekadar chatbot umum.

## Penggunaan AI

MVP memiliki dua lapisan AI:

1. Local insight engine untuk menghasilkan rekomendasi berbasis data transaksi dan stok tanpa biaya API.
2. Endpoint OpenAI-compatible opsional untuk menghasilkan rencana growth yang lebih fleksibel memakai model generatif eksternal.

## Dampak

- Pemilik UMKM bisa memahami kondisi bisnis tanpa spreadsheet kompleks.
- Konten promosi dan balasan pelanggan bisa dibuat dalam hitungan detik.
- Risiko stok habis dapat diketahui sebelum penjualan terganggu.
- Harga jual dapat dievaluasi berdasarkan modal, fee marketplace, margin, dan kompetitor.

## Target Pengguna

UMKM makanan ringan, fesyen, kerajinan, reseller, atau toko lokal yang berjualan melalui WhatsApp, Instagram, marketplace, dan toko offline.

## Keunggulan

- Fokus pada bahasa dan pola kerja UMKM Indonesia.
- Bisa langsung dipakai dari browser.
- Data demo Indonesia sudah tersedia untuk validasi cepat.
- Mendukung CSV agar bisa menerima data dari kasir, marketplace, atau pembukuan sederhana.
- Tidak bergantung pada satu provider AI.

## Pengembangan dan Atribusi

GeraiCerdas AI dikembangkan dari basis awal dashboard keuangan FinBoard oleh `khanirfan18`, lalu dimodifikasi besar untuk use case baru yang sesuai challenge. Modifikasi utama meliputi:

- Perubahan domain dari personal finance menjadi AI business copilot untuk UMKM.
- Data demo dan kategori transaksi diganti menjadi konteks UMKM Indonesia.
- Penambahan AI Copilot untuk diagnosis, eksperimen growth, copy promosi, balasan pelanggan, dan endpoint AI eksternal.
- Penambahan fitur pricing, stok, margin, harga kompetitor, dan restock.
- Penambahan input profil UMKM, upload CSV, input transaksi manual, dan live market signal USD/IDR.
- Penambahan dokumentasi pengguna dan submission.

## Teknologi

- React 19
- Vite
- Tailwind CSS
- Recharts
- PapaParse
- Lucide React

## Rencana Lanjutan

- Integrasi WhatsApp Business API untuk auto-reply.
- OCR struk pembelian bahan baku.
- Sinkronisasi marketplace.
- Multi-user untuk pemilik dan admin toko.
- Rekomendasi konten berbasis performa iklan real-time.
