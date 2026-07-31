# Untuk Kamu 💌 — Template Surat Cinta Digital

Website personal bergaya *soft girl* (pink pastel, lilac, baby blue, cream) buat kasih kejutan ke pacar di hari spesial. Dibuka kayak amplop surat sungguhan, terus isinya macam-macam: hitungan "sudah berapa lama bersama", timeline cerita kalian, galeri foto, alasan sayang, surat cinta, mini-game, countdown ke hari spesial berikutnya, sampai buku balasan yang bisa dia isi sendiri.

## Isi folder

```
index.html          -> halaman utama, jangan perlu diubah
css/style.css        -> semua tampilan & warna
js/config.js          -> ISI SEMUA TEKS & DATA KAMU DI SINI
js/script.js           -> logic interaksi, biasanya nggak perlu diubah
assets/images/         -> taruh foto kalian di sini
assets/audio/           -> taruh lagu latar di sini (opsional)
```

## Cara personalisasi (cuma edit 1 file: `js/config.js`)

Buka `js/config.js` pakai text editor apa aja (Notepad, VS Code, dll), lalu ganti:

1. **`recipientName`** — nama pacar kamu, muncul di amplop pembuka.
2. **`coupleNames`**, **`heroTitle`**, **`heroSub`** — nama & sapaan di halaman depan.
3. **`togetherSince`** — tanggal jadian kalian, format `"2023-08-01T00:00:00"`.
4. **`timeline`** — list momen penting (bisa nambah/kurang item sesuka kamu).
5. **`gallery`** — path foto. Taruh foto asli di `assets/images/` (misalnya `foto1.jpg`), lalu tulis `"assets/images/foto1.jpg"` di sini. Boleh nambah lebih dari 4 foto.
6. **`reasons`** — daftar alasan sayang, tampil di kartu yang bisa di-tap.
7. **`letterGreeting`**, **`letterParagraphs`**, **`letterClosing`**, **`letterSignature`** — isi surat cintanya.
8. **`gameNoReplies`**, **`gameYesReply`** — teks buat mini-game "kamu masih sayang aku?".
9. **`nextEventDate`**, **`nextEventLabel`** — countdown ke tanggal spesial berikutnya.
10. **`hugMessage`**, **`footerText`** — pesan penutup & tanda tangan.
11. **`musicSrc`** — nama file lagu di `assets/audio/`. Kosongkan `""` kalau nggak mau pakai musik.

Semua teks default sudah dalam Bahasa Indonesia dan aman dipakai langsung, tapi paling berkesan kalau kamu ganti dengan cerita kalian sendiri.

## Cara lihat hasilnya

Tinggal **klik dua kali `index.html`**, langsung kebuka di browser (Chrome/Edge/Firefox).

## Cara kirim ke pacar (biar dia bisa buka dari HP-nya)

Website ini murni file statis (HTML/CSS/JS), jadi kamu perlu meng-*host*-nya biar dapat link yang bisa dibuka dari mana aja. Beberapa cara gratis & gampang:

- **Netlify Drop** (paling gampang, tanpa akun): buka `app.netlify.com/drop`, drag-drop folder ini, langsung dapat link.
- **GitHub Pages**: upload folder ini ke repo GitHub, aktifkan Pages di Settings.
- **Vercel**: import folder/project, deploy sekali klik.

Setelah dapat link-nya, tinggal kirim ke pacar kamu lewat chat 🎀

## Catatan teknis

- Buku balasan (guestbook) disimpan pakai `localStorage`, artinya **tersimpan cuma di browser/perangkat yang dipakai buat baca**, bukan terkirim ke mana-mana. Aman & privat, tapi juga berarti nggak otomatis sinkron ke perangkat kamu.
- Font (`Fraunces`, `Caveat`, `Quicksand`) dimuat dari Google Fonts, jadi butuh koneksi internet saat dibuka.
- Semua warna diatur lewat CSS custom properties di bagian atas `css/style.css` (`:root`), gampang diubah kalau kamu mau ganti nuansa warnanya.
