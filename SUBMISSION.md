# Dicoding Challenge Submission - GeraiCerdas AI

Gunakan file ini sebagai bahan final sebelum submit ke Dicoding Challenge 973.

## Data Form Submission

App ID: kosongkan

Nama Aplikasi:

```text
GeraiCerdas AI
```

Link Aplikasi:

```text
https://github.com/aqilaziz/geraicerdas-ai
```

Catatan: pastikan repository sudah public dan perubahan terbaru sudah di-push. Jika nanti punya link live app dari Vercel/Netlify, link live app bisa dipakai sebagai nilai tambah karena juri bisa langsung mencoba aplikasi tanpa setup.

Komentar:

```text
GeraiCerdas AI adalah AI business copilot untuk UMKM Indonesia. Aplikasi ini membantu pemilik usaha membaca transaksi, margin, channel penjualan, stok, harga jual, dan konten promosi dari satu dashboard.

Fitur utama:
- Dashboard UMKM untuk revenue, biaya, laba, channel terbaik, komposisi biaya, alarm stok, dan live market signal USD/IDR.
- Data & AI untuk input profil usaha, upload CSV transaksi, input transaksi manual, dan konfigurasi endpoint AI OpenAI-compatible.
- AI Copilot untuk diagnosis bisnis, eksperimen growth, copy promosi, dan balasan pelanggan. Semua fitur punya hasil lokal, serta tombol Generate AI jika endpoint AI eksternal diisi.
- Pricing & Stok untuk menghitung modal, harga jual, fee marketplace, margin, harga kompetitor, harga target, dan risiko restock.
- Transaksi untuk pencarian, filter, dan export CSV.

Produk ini relevan dengan tema Digitalization & Acceleration of MSMEs with Generative AI karena membantu UMKM yang belum punya tim digital/marketing memahami kondisi bisnis dan menjalankan aksi praktis dengan bantuan AI.

Project brief:
https://drive.google.com/drive/folders/1_9POnCiVPHtdZ_BIR0XS9Mip-i6arXuM?usp=sharing
```

## Checklist Sebelum Submit

- [ ] Repository GitHub sudah public.
- [ ] Perubahan terbaru sudah di-push ke GitHub.
- [ ] README berisi cara menjalankan aplikasi.
- [ ] Jika memakai live deploy, semua route bisa dibuka setelah refresh, misalnya `/`, `/copilot`, `/budgets`, `/transaction`, dan `/settings`.
- [ ] Project brief sudah dibuat di Google Docs/Drive.
- [ ] Akses project brief sudah diatur ke **Share to Anyone**.
- [ ] API key pribadi tidak ditulis di repository, project brief, atau komentar submission.
- [ ] Screenshot/demo pendek sudah disiapkan bila ingin ditambahkan di project brief.

## Link GitHub vs Deploy

Form Dicoding pada contoh memakai link GitHub di field **Link Aplikasi**. Itu bisa dipakai selama repository public dan instruksi menjalankan aplikasi jelas.

Deploy Vercel/Netlify tetap disarankan sebagai nilai tambah karena challenge memberi nilai tambahan untuk produk digital yang bisa diakses publik secara langsung.

## Deploy Opsional

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

Konfigurasi SPA sudah disiapkan melalui `vercel.json` dan `netlify.toml`.
