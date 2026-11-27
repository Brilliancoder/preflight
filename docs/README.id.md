<div align="center">

# ✈️ Preflight

**Apakah aplikasi vibe-coded kamu siap diluncurkan? Cari tahu dalam satu perintah.**

Preflight memindai proyekmu untuk mencari kunci yang bocor, database yang terbuka, pembayaran yang tidak terverifikasi, dan dasar-dasar peluncuran yang hilang, lalu memberikan report card beserta perbaikan untuk setiap temuan.

[![License: MIT](https://img.shields.io/badge/license-MIT-34d399.svg)](../LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A520-38bdf8.svg)](../package.json)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-fbbf24.svg)](../CONTRIBUTING.md)
[![npm version](https://img.shields.io/npm/v/vibe-preflight)](https://www.npmjs.com/package/vibe-preflight)
[![npm downloads](https://img.shields.io/npm/dm/vibe-preflight)](https://www.npmjs.com/package/vibe-preflight)
[![CI](https://github.com/erdellll/preflight/actions/workflows/ci.yml/badge.svg)](https://github.com/erdellll/preflight/actions/workflows/ci.yml)

![Preflight report card](assets/report-card.png)

</div>

```bash
npx vibe-preflight
```

Tanpa instalasi, tanpa akun, tanpa panggilan jaringan. Kodemu tidak pernah meninggalkan mesinmu.

## Mengapa

Perkakas AI memudahkanmu membangun aplikasi dalam satu akhir pekan, dan sama mudahnya membuatmu tanpa sadar mengirimkan Stripe secret key di dalam bundle browser atau tabel Supabase yang bisa dibaca siapa saja. Preflight memeriksa kesalahan yang paling menyakitkan setelah peluncuran, sebelum kamu meluncurkan.

## Coba dulu di aplikasi yang rusak

```bash
npx vibe-preflight --demo
```

Memindai aplikasi demo yang sengaja dibuat rusak (semua secret-nya palsu) supaya kamu bisa melihat seperti apa laporan yang gagal.

## Apa yang diperiksa

17 pemeriksaan saat ini, mencakup keamanan, keandalan, dan dasar-dasar peluncuran. Lihat [semua pemeriksaan](rules.md).

| | |
|---|---|
| 🔑 Secret live di dalam kode client | 🗄️ Tabel Supabase tanpa row-level security |
| 📄 File `.env` yang bisa ter-commit | 💳 Webhook Stripe tanpa pemeriksaan signature |
| 🌍 CORS terbuka untuk semua website | 🚨 Tidak ada error monitoring |
| 🔒 Tidak ada privacy policy | 🔗 Judul, deskripsi, atau share image yang hilang |

## Opsi

```bash
npx vibe-preflight [path]          # scan a folder (default: current folder)
npx vibe-preflight --html          # also write a shareable preflight-report.html
npx vibe-preflight --json          # machine-readable output ([JSON format](json.md))
npx vibe-preflight --ignore a,b    # skip checks by id
npx vibe-preflight --fail-on warning   # exit code policy: critical (default) | warning | never
```
Setel NO_COLOR=1 untuk mematikan output berwarna.

Bungkam temuan yang menunjuk ke sebuah baris dengan `// preflight-ignore <check-id>` pada baris itu atau baris di atasnya. Temuan tentang satu file utuh (file `.env` yang ter-commit, webhook yang tidak terverifikasi) memakai komentar yang sama dalam lima baris pertama file itu. Apa pun yang ingin kamu hilangkan di seluruh proyek, termasuk temuan tanpa file sama sekali, memakai `--ignore <check-id>`.

## Pakai di CI

```yaml
- run: npx vibe-preflight --fail-on critical
```

Perintah ini keluar dengan kode 1 saat ada temuan yang mencapai level `--fail-on`, jadi kunci yang bocor akan memblokir merge.

## Pakai di dalam Claude Code

Preflight hadir sebagai plugin Claude Code dengan perintah `/preflight` yang menjalankan pemindaian, menjelaskan hasilnya, dan menawarkan untuk memperbaiki masalah kritis satu per satu, selalu bertanya sebelum setiap perubahan.

Di Claude Code, jalankan:

```text
/plugin marketplace add erdellll/preflight
/plugin install preflight@preflight
```

Lalu ketik `/preflight` di proyek mana pun.

## Tambah pemeriksaan dalam 10 menit

Setiap pemeriksaan hanya satu file kecil ditambah dua folder contoh, satu yang harus ditandai dan satu yang harus dibiarkan. Tanpa build step, tanpa dependensi. Baca [CONTRIBUTING.md](../CONTRIBUTING.md), atau pilih issue berlabel [`good first issue`](https://github.com/erdellll/preflight/issues?q=is%3Aopen+label%3A%22good+first+issue%22).

## Bukan audit keamanan

Preflight menangkap kesalahan umum yang berdampak besar dengan pemeriksaan pola yang cepat. Laporan yang bersih berarti tidak ada pemeriksaannya yang menemukan masalah, bukan berarti aplikasimu aman. Gunakan sebagai sabuk pengaman, bukan pengganti review.

## FAQ

**Apakah Preflight mengirim kodemu ke mana pun?**

Tidak. Preflight berjalan sepenuhnya di mesin lokalmu, tidak melakukan panggilan jaringan, dan tidak mengumpulkan telemetri. Kodemu tidak pernah meninggalkan komputermu.

**Apakah skor 100/100 berarti aplikasiku aman?**

Tidak. Itu hanya berarti tidak ada pemeriksaan Preflight yang menemukan masalah. Lihat bagian [Bukan audit keamanan](#bukan-audit-keamanan) untuk detail lebih lanjut.

**Bagaimana cara membungkam false positive?**

Gunakan `// preflight-ignore <check-id>` pada baris yang terdampak atau `--ignore <check-id>` saat menjalankan Preflight. Mohon buka juga issue GitHub berlabel atau berjudul "False positive" supaya pemeriksaannya bisa diperbaiki.

**Stack apa saja yang dipahami?**

Preflight bisa memindai file proyek apa pun, tetapi pemeriksaannya bekerja paling baik dengan Next.js, Vite, Supabase, Stripe, Express, dan HTML biasa.

**Mengapa file symlink tidak diperiksa?**

Symbolic link sengaja dilewati, baik file maupun folder. Mengikutinya bisa berputar tanpa akhir — folder yang tertaut ke dirinya sendiri tidak pernah selesai — dan bisa membaca file di luar proyek yang kamu minta Preflight pindai. File `.env` yang merupakan symlink ke file di tempat lain karenanya tidak dilaporkan; salin ke dalam proyek, atau arahkan pemeriksaan ke folder yang benar-benar menyimpannya. Komentar pada `walk` di `src/project.js` mengatakan hal yang sama di samping kodenya.

## Lisensi

[MIT](../LICENSE). Gratis untuk penggunaan apa pun.

## Kontributor

Terima kasih untuk semua orang yang telah membuat Preflight lebih baik! 💛

<a href="https://github.com/erdellll/preflight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=erdellll/preflight" alt="Preflight contributors" />
</a>
