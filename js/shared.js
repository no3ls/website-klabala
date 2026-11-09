/* =============================================================
   shared.js - helper yang dipakai bersama oleh index.html (warga)
   dan admin.html (admin). Muat file ini SEBELUM app.js / admin.js.

   Semua data disimpan di localStorage browser (tanpa server),
   sehingga website dapat dihosting statis di GitHub Pages.
   ============================================================= */

/* Nama kunci localStorage. Nilai sengaja tidak diubah supaya data lama tetap terbaca.
   Bentuk data:
   - news / announcements : [{ id, t: judul, d: tanggal YYYY-MM-DD, x: isi, img, l: lampiran[] }]
   - submissions (layanan): [{ c: kode, n: nama layanan, p: pemohon, k: NIK, hp: WhatsApp,
                               e: email akun, f: berkas[], d: tanggal, u: tgl update, s: status }]
   - reports (pengaduan)  : [{ c: kode, n: pelapor, p: no. HP, x: isi, f: berkas[], d, s }]
   - users (warga)        : [{ name, username, email, phone, at }]
   - chat per pengumuman  : kunci 'cha' + id  -> [{ n, m, e, a, at }]   (a = 1 jika dari admin)
   - komentar per berita  : kunci 'cmb' + id  -> [{ n, m }]            */
const STORAGE_KEYS = {
  news: 'adm_news',
  announcements: 'adm_ann',
  submissions: 'subs',
  reports: 'rpts',
  users: 'users',
  currentUser: 'me',
  theme: 'th',
  language: 'lang',
  fontSize: 'fz',
  adminSession: 'adm_in',
  adminReadCounts: 'adm_rd',
  chatPrefix: 'cha',
  commentPrefix: 'cmb',
  residentReadPrefix: 'rd_'
};

/* Status pengajuan layanan & pengaduan (dipakai di halaman warga dan admin). */
const STATUS = {
  WAITING_VERIFICATION: 'Menunggu verifikasi',
  WAITING_VALIDATION: 'Menunggu validasi',
  PROCESSING: 'Diproses',
  NEEDS_FIX: 'Perbaiki laporan',
  DONE: 'Selesai'
};

const qs = (selector) => document.querySelector(selector);

/* Baca data dari localStorage; kembalikan fallback bila kosong atau rusak. */
function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

/* Simpan data ke localStorage; false bila penyimpanan penuh / diblokir. */
function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

/* Escape karakter HTML agar teks dari pengguna aman ditampilkan. */
function escapeHtml(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, (char) => entities[char]);
}

/* Hanya biarkan angka pada kolom input (dipanggil dari atribut oninput). */
function digitsOnly(input) {
  input.value = input.value.replace(/\D/g, '');
}

/* Angka dan tanda + (untuk nomor WhatsApp). */
function phoneCharsOnly(input) {
  input.value = input.value.replace(/[^0-9+]/g, '');
}
