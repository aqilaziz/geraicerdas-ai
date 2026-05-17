# User Guide - GeraiCerdas AI

Panduan ini menjelaskan cara memakai GeraiCerdas AI sebagai pemilik atau admin UMKM.

## 1. Jalankan aplikasi

```bash
cd d:\App\PR\finBoard
npm install
npm run dev
```

Buka aplikasi di browser:

```text
http://127.0.0.1:5173/
```

## 2. Mulai dari menu Data & AI

Menu pertama yang sebaiknya dibuka adalah **Data & AI**.

Di menu ini, lakukan tiga hal:

1. Isi profil UMKM.
2. Masukkan data transaksi.
3. Isi endpoint AI jika ingin memakai provider AI eksternal.

## 3. Isi profil UMKM

Di bagian **Profil UMKM**, isi:

- Nama usaha
- Nama pemilik
- Kota
- Kategori usaha
- Value proposition

Data ini dipakai AI untuk membuat rekomendasi yang lebih sesuai dengan konteks usaha.

Klik **Simpan profil UMKM** setelah mengisi atau mengubah data profil. Jika belum disimpan, dashboard dan AI Copilot masih memakai profil lama.

## 4. Masukkan data transaksi

Masih di menu **Data & AI**, ada tiga pilihan:

- **Upload CSV** untuk memasukkan banyak transaksi sekaligus.
- **Tambah transaksi cepat** untuk input manual.
- **Muat demo** untuk memakai data contoh bawaan aplikasi.

Format CSV yang didukung:

```csv
Date,Description,Amount,Channel,Type,Product,Quantity,Customer
```

Contoh:

```csv
2026-05-10,Penjualan WhatsApp - Basreng Daun Jeruk 250g,660000,WhatsApp,Revenue,Basreng Daun Jeruk 250g,30,Reseller Sari
2026-05-10,Pembelian bahan baku,-310000,Offline,Bahan Baku,,, 
```

Nominal pendapatan ditulis positif. Biaya ditulis negatif.

## 5. Isi API AI

API AI diisi dari menu **Data & AI**, bagian **Endpoint AI**.

Field yang perlu diisi:

- **Provider**: nama provider, misalnya `OpenAI`, `OpenRouter`, `Groq`.
- **Endpoint chat completions**: URL endpoint API.
- **Model**: nama model yang ingin dipakai.
- **API key**: key dari provider AI.

Contoh OpenAI-compatible:

```text
Provider: OpenAI
Endpoint chat completions: https://api.openai.com/v1/chat/completions
Model: gpt-4o-mini
API key: sk-...
```

Setelah field ini diisi, buka menu **AI Copilot**, lalu gunakan bagian **Mode AI endpoint** dan klik **Generate**.

Klik **Simpan konfigurasi AI** setelah mengisi atau mengubah provider, endpoint, model, dan API key. Jika belum disimpan, menu **AI Copilot** masih memakai konfigurasi lama.

Catatan: untuk demo lokal ini bisa langsung dicoba. Untuk produksi, API key sebaiknya lewat backend/proxy agar tidak terlihat di browser.

## 6. Buka Dashboard

Menu **Dashboard** dipakai untuk melihat kondisi usaha:

- Pendapatan
- Laba bersih
- Belanja marketing
- Skor kesiapan scale
- Cashflow harian
- Rekomendasi AI
- Revenue per channel
- Komposisi biaya
- Alarm stok
- Live market signal USD/IDR

Jika data transaksi sudah dimasukkan, dashboard akan otomatis berubah mengikuti data tersebut.

## 7. Pakai AI Copilot

Menu **AI Copilot** dipakai untuk membuat bantuan praktis berbasis AI.

Fitur yang bisa dipakai tanpa API eksternal:

- Diagnosis AI
- Rekomendasi growth
- Eksperimen bisnis
- Copy promosi
- Balasan pelanggan

Semua fitur di atas tetap punya hasil lokal tanpa API. Jika endpoint AI sudah diisi dan disimpan, tombol **Generate AI** akan aktif untuk membuat versi AI eksternal.

Cara generate Diagnosis AI dengan endpoint:

1. Pastikan API AI sudah diisi dan disimpan di menu **Data & AI**.
2. Buka **AI Copilot**.
3. Klik **Generate AI** di panel **Diagnosis AI**.
4. Hasil AI eksternal akan muncul di bawah diagnosis lokal.

Cara generate Eksperimen growth dengan endpoint:

1. Pastikan API AI sudah diisi dan disimpan di menu **Data & AI**.
2. Buka **AI Copilot**.
3. Klik **Generate AI** di panel **Eksperimen growth**.
4. Hasil AI eksternal akan muncul di bawah kartu eksperimen lokal.

Cara membuat copy promosi:

1. Pilih produk.
2. Pilih channel, misalnya WhatsApp atau Instagram.
3. Isi goal promosi.
4. Isi tone komunikasi.
5. Copy promosi akan muncul otomatis sebagai **Template lokal**.
6. Jika endpoint AI sudah diisi dan disimpan, klik **Generate AI** pada panel Copy promosi untuk membuat versi yang lebih natural memakai AI eksternal.

Cara membuat balasan pelanggan:

1. Isi pertanyaan pelanggan.
2. Balasan akan muncul otomatis sebagai **Template lokal**.
3. Jika endpoint AI sudah diisi dan disimpan, klik **Generate AI** pada panel Balasan pelanggan.

Tombol **Generate AI** hanya aktif jika konfigurasi **Endpoint AI** di menu **Data & AI** sudah lengkap dan sudah disimpan.

Cara memakai AI endpoint:

1. Pastikan API AI sudah diisi di menu **Data & AI**.
2. Buka **AI Copilot**.
3. Scroll ke bagian **Mode AI endpoint**.
4. Tulis prompt, misalnya:

```text
Buat strategi promosi 7 hari untuk menaikkan repeat order WhatsApp.
```

5. Klik **Generate**.

## 8. Gunakan Pricing & Stok

Menu **Pricing & Stok** dipakai untuk mengecek harga dan risiko stok.

Langkahnya:

1. Pilih produk.
2. Isi modal per unit.
3. Isi harga jual.
4. Isi fee marketplace.
5. Isi harga kompetitor.

Aplikasi akan menghitung:

- Laba per unit
- Margin
- Harga target
- Saran harga AI
- Status restock

## 9. Cek Transaksi

Menu **Transaksi** dipakai untuk melihat dan memfilter data transaksi.

Yang bisa dilakukan:

- Cari transaksi.
- Filter berdasarkan channel.
- Filter berdasarkan kategori.
- Export transaksi ke CSV.

## Alur penggunaan yang disarankan

```text
Data & AI -> Dashboard -> Pricing & Stok -> AI Copilot -> Transaksi
```

Mulai dari **Data & AI** karena kualitas rekomendasi aplikasi bergantung pada profil usaha, transaksi, dan konfigurasi AI.
