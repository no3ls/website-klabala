/* =============================================================
   app.js - Website Kelurahan Klabala (halaman warga / index.html)
   Bergantung pada: js/shared.js

   Cara mengubah isi:
   - Video opening        -> HERO_VIDEOS
   - Layanan & persyaratan -> SERVICES
   - Struktur organisasi  -> OFFICIALS
   - Statistik penduduk   -> TOTAL_POPULATION, GENDER_STATS, AGE_STATS, JOB_STATS
   - Data RT/RW           -> RT_LIST / RW_LIST (bagian "Data RT/RW")
   - Berita & pengumuman  -> dikelola dari admin.html
   ============================================================= */

/* ========== Ikon & logo sosial media ========== */
const ICON_PATHS = {
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.9 1.9 0 0 0 3.4 0',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z M8 11h8 M8 14h5',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h6',
  mega: 'M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z M15 9a4 4 0 0 1 0 6 M18 6a8 8 0 0 1 0 12',
  bank: 'M3 21h18 M5 21V10 M9 21V10 M15 21V10 M19 21V10 M2 10l10-7 10 7z',
  news: 'M4 5h13v14H6a2 2 0 0 1-2-2z M17 9h3v8a2 2 0 0 1-2 2 M8 9h5 M8 13h5',
  pin: 'M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14 M21 21l-5-5',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  acc: 'M12 6.5a1.5 1.5 0 1 0 0-.01 M5 9.5l7 1.5 7-1.5 M12 11v4 M9 21l3-6 3 6',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
  moon: 'M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z',
  play: 'M7 4l13 8-13 8z',
  l: 'M15 5l-7 7 7 7',
  r: 'M9 5l7 7-7 7',
  plus: 'M12 5v14 M5 12h14',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18 M12 7v5l3 2',
  users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M3 20a6 6 0 0 1 12 0 M16 5a3 3 0 0 1 0 6 M18 14a6 6 0 0 1 3 6',
  chart: 'M4 20V4 M4 20h16 M8 16v-5 M12 16V8 M16 16v-3',
  send: 'M21 3L10 14 M21 3l-7 18-4-7-7-4z',
  check: 'M5 12l5 5 9-10',
  home: 'M3 11l9-8 9 8 M5 10v10h14V10',
  heart: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
  id: 'M3 6h18v12H3z M7 11a1.6 1.6 0 1 0 0-.01 M12 10h6 M12 14h6',
  store: 'M4 9l1-5h14l1 5 M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 6 0 2.5 2.5 0 0 0 5 0 M5 11v9h14v-9',
  ext: 'M14 4h6v6 M20 4l-9 9 M18 14v5H5V6h5',
  out: 'M9 21H5V3h4 M16 17l5-5-5-5 M21 12H9',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M4 21a8 8 0 0 1 16 0',
  down: 'M6 9l6 6 6-6',
  upl: 'M12 16V4 M7 9l5-5 5 5 M5 20h14',
  up: 'M6 15l6-6 6 6',
  cloud: 'M7 18a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z M12 16v-5 M9.5 13l2.5-2.5 2.5 2.5'
};

function icon(name) {
  return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICON_PATHS[name]}"/></svg>`;
}

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M14 8V6.5c0-.7.3-1 1-1h2V2h-3a4 4 0 0 0-4 4v2H7v3.5h3V22h4v-10.5h3L17.5 8z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .7c-1-.4-1.8-1.2-2.2-2.2l.7-1-1-2z" fill="#fff" stroke="none"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M9.5 8v8l7-4z"/></svg>'
};

/* ========== Teks dua bahasa (id / en) ========== */
const TRANSLATIONS = {
  id: {
    home: 'Beranda',
    prof: 'Profil',
    lay: 'Layanan',
    adu: 'Pengaduan',
    inf: 'Informasi',
    sta: 'Statistik',
    a11: 'Aksesibilitas',
    size: 'Ukuran teks',
    lg: 'Bahasa',
    th: 'Tampilan',
    dark: 'Gelap',
    light: 'Terang',
    nomo: 'Kurangi animasi',
    mading: 'Mading Digital',
    news: 'Berita Terbaru',
    more: 'Lihat berita lainnya',
    ly: 'Layanan & Pengaduan',
    peta: 'Peta Kelurahan Klabala',
    read: 'Selengkapnya',
    new: 'Baru',
    done: 'Selesai',
    contact: 'Hubungi kami',
    soc: 'Media sosial',
    jam: 'Jam pelayanan',
    search: 'Cari berita atau pengumuman',
    send: 'Kirim',
    create: 'Buat pengajuan'
  },
  en: {
    home: 'Home',
    prof: 'Profile',
    lay: 'Services',
    adu: 'Complaints',
    inf: 'Information',
    sta: 'Statistics',
    a11: 'Accessibility',
    size: 'Text size',
    lg: 'Language',
    th: 'Appearance',
    dark: 'Dark',
    light: 'Light',
    nomo: 'Reduce motion',
    mading: 'Digital Bulletin Board',
    news: 'Latest News',
    more: 'See more news',
    ly: 'Services & Complaints',
    peta: 'Klabala Village Map',
    read: 'Read more',
    new: 'New',
    done: 'Closed',
    contact: 'Contact us',
    soc: 'Social media',
    jam: 'Service hours',
    search: 'Search news or announcements',
    send: 'Send',
    create: 'Apply'
  }
};

let currentLanguage = loadStorage(STORAGE_KEYS.language, 'id');
const translate = (key) => TRANSLATIONS[currentLanguage][key] || key;

/* ========== Data contoh (dipakai sekali untuk mengisi data awal) ========== */
const SAMPLE_NEWS = [
  {
    title: 'Kerja bakti bersama warga Klabala bersihkan saluran air',
    date: '2026-10-10',
    body: 'Warga dari seluruh RT bergotong royong membersihkan saluran air sebelum musim hujan. Kegiatan ini diikuti perangkat kelurahan dan karang taruna.'
  },
  {
    title: 'Posyandu balita bulan Oktober berjalan lancar',
    date: '2026-10-07',
    body: 'Puluhan balita mendapat penimbangan, imunisasi dasar, dan makanan tambahan di posyandu kelurahan.'
  },
  {
    title: 'Pelatihan UMKM untuk pelaku usaha lokal',
    date: '2026-10-03',
    body: 'Kelurahan mengadakan pelatihan pemasaran digital bagi pelaku UMKM agar produk warga menjangkau pasar lebih luas.'
  },
  {
    title: 'Pembaruan data kependudukan di tingkat RT',
    date: '2026-09-28',
    body: 'Petugas mendata ulang warga agar data KK dan KTP sesuai kondisi terbaru.'
  },
  {
    title: 'Lomba kebersihan antar-RT dimulai',
    date: '2026-09-22',
    body: 'Penilaian mencakup kebersihan lingkungan, pengelolaan sampah, dan penghijauan.'
  },
  {
    title: 'Penyuluhan keselamatan lalu lintas untuk pelajar',
    date: '2026-09-15',
    body: 'Pelajar diajak memahami aturan berkendara dan pentingnya helm.'
  },
  {
    title: 'Rapat koordinasi pembangunan kelurahan',
    date: '2026-09-09',
    body: 'Rapat membahas usulan prioritas pembangunan jalan lingkungan dan penerangan.'
  }
];

const SAMPLE_ANNOUNCEMENTS = [
  {
    title: 'Jadwal vaksinasi anak sekolah',
    date: '2026-11-12',
    body: 'Vaksinasi dilakukan di sekolah dasar sekitar kelurahan. Orang tua diminta mendampingi dan membawa buku KIA.'
  },
  {
    title: 'Pendaftaran Posyandu lansia',
    date: '2026-11-05',
    body: 'Warga lansia dapat mendaftar pemeriksaan kesehatan gratis melalui ketua RT masing-masing.'
  },
  {
    title: 'Jadwal pelayanan akhir pekan',
    date: '2026-10-31',
    body: 'Pelayanan administrasi mengikuti jam kerja. Pengajuan daring dapat dilakukan kapan saja melalui menu Layanan.'
  },
  {
    title: 'Pembagian bantuan sosial tahap IV',
    date: '2026-10-20',
    body: 'Penerima diminta membawa KTP asli dan kartu keluarga ke kantor kelurahan.'
  },
  {
    title: 'Pendaftaran kegiatan Hari Sumpah Pemuda',
    date: '2026-10-28',
    body: 'Karang taruna dan pemuda dapat mendaftar lomba melalui perangkat RT masing-masing.'
  },
  {
    title: 'Pembayaran PBB tahap awal',
    date: '2026-08-31',
    body: 'Batas pembayaran sudah berakhir.'
  }
];

/* ========== Konten beranda, layanan, profil, statistik ========== */
const HERO_SLIDES = [
  {
    title: 'Selamat datang di Kelurahan Klabala',
    subtitle: 'Pelayanan publik yang dekat, cepat, dan transparan.'
  },
  {
    title: 'Ajukan layanan dari rumah',
    subtitle: 'Isi formulir, pantau status, terima dokumen lewat WhatsApp.'
  },
  {
    title: 'Suara warga, kami dengar',
    subtitle: 'Sampaikan pengaduan dan pantau tindak lanjutnya.'
  }
];

/* Alamat video opening (mp4) untuk tiap slide. Kosongkan untuk memakai latar warna. */
const HERO_VIDEOS = ['', '', ''];

const SERVICES = [
  {
    name: 'Surat Keterangan Domisili',
    icon: 'home',
    requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Surat pengantar RT/RW']
  },
  {
    name: 'Surat Keterangan Tidak Mampu',
    icon: 'heart',
    requirements: ['Fotokopi KTP & KK', 'Surat pengantar RT/RW', 'Foto rumah tampak depan']
  },
  {
    name: 'Pengantar KTP / KK',
    icon: 'id',
    requirements: ['Fotokopi KK lama', 'Akta kelahiran / nikah', 'Surat pengantar RT/RW']
  },
  {
    name: 'Surat Keterangan Usaha',
    icon: 'store',
    requirements: ['Fotokopi KTP', 'Foto lokasi usaha', 'Surat pengantar RT/RW']
  }
];

const OFFICIALS = [
  {
    position: 'Kepala Kelurahan',
    name: 'Nama Lengkap Lurah'
  },
  {
    position: 'Sekretaris Kelurahan',
    name: 'Nama Lengkap Sekretaris'
  },
  {
    position: 'Kasi Pemerintahan',
    name: 'Nama Lengkap'
  },
  {
    position: 'Kasi Kesejahteraan Sosial',
    name: 'Nama Lengkap'
  },
  {
    position: 'Kasi Pemberdayaan Masyarakat',
    name: 'Nama Lengkap'
  },
  {
    position: 'Kasi Pelayanan Umum',
    name: 'Nama Lengkap'
  }
];

const TOTAL_POPULATION = 3250;
const GENDER_STATS = [
  {
    label: 'Laki-laki',
    percent: 52
  },
  {
    label: 'Perempuan',
    percent: 48
  }
];
const AGE_STATS = [
  {
    label: 'Balita (0-5 th)',
    percent: 8
  },
  {
    label: 'Anak (6-15 th)',
    percent: 16
  },
  {
    label: 'Pemuda (16-30 th)',
    percent: 29
  },
  {
    label: 'Dewasa (31-59 th)',
    percent: 37
  },
  {
    label: 'Lansia (60+ th)',
    percent: 10
  }
];
const JOB_STATS = [
  {
    label: 'Wiraswasta / UMKM',
    percent: 25
  },
  {
    label: 'Pegawai swasta',
    percent: 22
  },
  {
    label: 'Buruh',
    percent: 14
  },
  {
    label: 'Pelajar / mahasiswa',
    percent: 12
  },
  {
    label: 'PNS / TNI / Polri',
    percent: 9
  },
  {
    label: 'Nelayan / petani',
    percent: 8
  },
  {
    label: 'Lainnya',
    percent: 10
  }
];

const MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39198.42206698451!2d131.267071821693!3d-0.8496224003466256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d5eacadd2589c47%3A0x23836097eacc4050!2sKlabala%2C%20Sorong%20Barat%2C%20Sorong%20City%2C%20Southwest%20Papua!5e0!3m2!1sen!2sid!4v1791868904693!5m2!1sen!2sid';

/* ========== Data RT/RW (contoh) ==========
   39 RT dan 12 RW. RT 001-003 = RW 001, RT 004-006 = RW 002, dst. sampai RW 011.
   RW 012 memegang sisa RT 034-039.
   Ganti name, tel, a (alamat), lat/lng (koordinat rumah) dan img (alamat foto) dengan data asli. */
const padNumber = (number) => String(number).padStart(3, '0');
const rwOfRt = (rtNumber) => Math.min(Math.ceil(rtNumber / 3), 12);

const RT_LIST = Array.from({ length: 39 }, (_, index) => {
  const number = index + 1;
  const rw = rwOfRt(number);
  const row = index % 7;
  const column = Math.floor(index / 7);
  return {
    n: number,
    w: rw,
    k: 'RT ' + padNumber(number) + '/RW ' + padNumber(rw),
    name: 'Nama Ketua RT ' + padNumber(number),
    tel: '0812-0000-' + String(number).padStart(4, '0'),
    a: 'Jl. Contoh No. ' + number + ', RT ' + padNumber(number) + '/RW ' + padNumber(rw) + ', Kelurahan Klabala, Kota Sorong',
    lat: -0.8496 + (row - 3) * 0.0022,
    lng: 131.2671 + (column - 2.5) * 0.0028,
    img: ''
  };
});

const RW_LIST = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1;
  const rtOfThisRw = RT_LIST.filter((rt) => rt.w == number);
  const average = (field) => rtOfThisRw.reduce((sum, rt) => sum + rt[field], 0) / rtOfThisRw.length;
  return {
    w: number,
    k: 'RW ' + padNumber(number),
    name: 'Nama Ketua RW ' + padNumber(number),
    tel: '0813-0000-' + String(number).padStart(4, '0'),
    a: 'Jl. Contoh No. ' + (100 + number) + ', RW ' + padNumber(number) + ', Kelurahan Klabala, Kota Sorong',
    lat: average('lat') + 0.0006,
    lng: average('lng') + 0.0006,
    rt: rtOfThisRw,
    img: ''
  };
});

let selectedRt = 0;
let rtPage = 1;
const RT_PER_PAGE = 5; /* jumlah tombol RT per halaman */
const ITEMS_PER_PAGE = 4; /* berita / pengumuman per halaman */

/* ========== Berita & pengumuman (dikelola admin lewat localStorage) ========== */
let newsList = [];
let announcementList = [];

const todayISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

/* Ambil daftar dari localStorage; bila belum ada, isi dari data contoh. Pastikan tiap item punya id. */
function loadStoredList(key, samples) {
  let list = loadStorage(key, null);
  let needsSave = false;
  if (!Array.isArray(list)) {
    list = samples.map((sample) => ({ t: sample.title, d: sample.date, x: sample.body }));
    needsSave = true;
  }
  list.forEach((item) => {
    if (!item.id) {
      item.id = generateId();
      needsSave = true;
    }
  });
  if (needsSave) saveStorage(key, list);
  return list;
}

function loadContent() {
  const today = todayISO();

  newsList = loadStoredList(STORAGE_KEYS.news, SAMPLE_NEWS)
    .filter((item) => item.d <= today)
    .sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0))
    .map((item) => ({
      id: item.id,
      title: escapeHtml(item.t),
      date: item.d,
      body: escapeHtml(item.x),
      image: item.img || '',
      links: item.l || []
    }));

  announcementList = loadStoredList(STORAGE_KEYS.announcements, SAMPLE_ANNOUNCEMENTS).map((item) => ({
    id: item.id,
    title: escapeHtml(item.t),
    date: item.d,
    body: escapeHtml(item.x),
    isOpen: item.d >= today,
    image: item.img || '',
    links: item.l || []
  }));
}

/* ========== Format & potongan HTML kecil ========== */
const formatDate = (date) =>
  new Date(date).toLocaleDateString(currentLanguage == 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const formatDateTime = (timestamp) =>
  new Date(timestamp).toLocaleString(currentLanguage == 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const placeholderCover = (index, iconName = 'news') =>
  `<div class="ph" style="background:linear-gradient(135deg,hsl(${195 + index * 6} 80% 55%),hsl(${208 + index * 6} 85% 34%))">${icon(iconName)}</div>`;

const coverImage = (item, index, iconName = 'news') =>
  item.image
    ? `<div class="ph im"><img src="${escapeHtml(item.image)}" alt="" loading="lazy"></div>`
    : placeholderCover(index, iconName);

/* Daftar lampiran / tautan. storageKey = kunci localStorage tempat file disimpan. */
function attachmentsHtml(storageKey, item) {
  if (!item.links || !item.links.length) return '';
  const buttons = item.links
    .map((link, index) =>
      link.k == 'link'
        ? `<a class="btn o" target="_blank" rel="noopener" href="${escapeHtml(link.u)}">${icon('ext')} ${escapeHtml(link.n)}</a>`
        : `<a class="btn o" href="#" onclick="openAttachment(event,'${storageKey}','${item.id}',${index})">${icon('file')} ${escapeHtml(link.n)}</a>`
    )
    .join('');
  return `<div class="atts"><b style="flex-basis:100%">Lampiran &amp; tautan</b>${buttons}</div>`;
}

/* ========== Notifikasi balasan admin ========== */
const readKey = () => STORAGE_KEYS.residentReadPrefix + (getCurrentUser()?.email || '');

function unreadCount(announcementId) {
  if (!getCurrentUser()) return 0;
  const messages = loadStorage(STORAGE_KEYS.chatPrefix + announcementId, []);
  const readCount = loadStorage(readKey(), {})[announcementId] || 0;
  return messages.slice(readCount).filter((message) => message.a).length;
}

const totalUnread = () => announcementList.reduce((sum, item) => sum + unreadCount(item.id), 0);

function notificationPill() {
  const first = announcementList.find((item) => unreadCount(item.id));
  return first
    ? `<a class="notif" href="#/pengumuman/${first.id}">${icon('bell')} ${totalUnread()} balasan baru dari admin</a>`
    : '';
}

function markChatRead(announcementId, messageCount) {
  if (!getCurrentUser()) return;
  const key = readKey();
  const readCounts = loadStorage(key, {});
  if (readCounts[announcementId] !== messageCount) {
    readCounts[announcementId] = messageCount;
    saveStorage(key, readCounts);
  }
}

/* ========== Kartu & komponen ========== */
const newsCard = (item, index) =>
  `<article class="card hv rv" style="--i:${index}">${coverImage(item, index)}<div class="cb"><span class="date">${formatDate(item.date)}</span><h3>${item.title}</h3><a class="btn o" href="#/berita/${item.id}">${translate('read')}</a></div></article>`;

const announcementCard = (item, index) =>
  `<article class="card hv rv" style="--i:${index}">${item.image ? coverImage(item, index) : ''}<div class="cb"><div><span class="badge ${item.isOpen ? '' : 'g'}">${item.isOpen ? translate('new') : translate('done')}</span></div>${unreadCount(item.id) ? `<span class="notif sm">${icon('chat')} ${unreadCount(item.id)} balasan baru</span>` : ''}<h3>${item.title}</h3><span class="date">${formatDate(item.date)}</span><a class="btn o" href="#/pengumuman/${item.id}">${translate('read')}</a></div></article>`;

const AVATAR_SVG = '<svg width="90" height="110" viewBox="0 0 90 110"><circle cx="45" cy="38" r="20" fill="#29a8ea" opacity=".8"/><path d="M5 110c0-30 18-45 40-45s40 15 40 45z" fill="#29a8ea" opacity=".8"/></svg>';

const officialCard = (official, index) =>
  `<div class="card pf rv" style="--i:${index}"><div class="av">${AVATAR_SVG}</div><h3>${official.name}</h3><p>${official.position}</p><p>NIP. 19xxxxxxxxxxxxxxxx</p></div>`;

/* Tombol nomor halaman. onClickFor(nomor) mengembalikan kode JavaScript untuk atribut onclick. */
function paginationHtml(totalPages, currentPage, onClickFor, extraClass = '') {
  if (totalPages <= 1) return '';
  const buttons = Array.from({ length: totalPages }, (_, i) => {
    const pageNumber = i + 1;
    const isCurrent = pageNumber == currentPage;
    return `<button class="${isCurrent ? 'on' : ''}" ${isCurrent ? 'aria-current="page"' : ''} onclick="${onClickFor(pageNumber)}">${pageNumber}</button>`;
  }).join('');
  return `<div class="pg ${extraClass}" role="navigation" aria-label="Halaman">${buttons}</div>`;
}

/* Nomor halaman dari hash, mis. #/berita?p=2 */
function currentPageFromHash(totalPages) {
  const page = +new URLSearchParams(location.hash.split('?')[1] || '').get('p') || 1;
  return Math.min(Math.max(page, 1), totalPages);
}

function statBars(rows) {
  return rows
    .map((row) => {
      const count = Math.round((TOTAL_POPULATION * row.percent) / 100).toLocaleString('id-ID');
      return `<div class="br rv"><div class="t"><span>${row.label}</span><b>${row.percent}% <span style="color:var(--mute);font-weight:500">(${count})</span></b></div><div class="tr"><div class="fl" style="--w:${row.percent}%"></div></div></div>`;
    })
    .join('');
}

/* ========== Halaman ========== */
const PAGES = {
  home: () => `<div class="hero" id="hero"><div class="trk" id="heroTrack">${HERO_SLIDES.map((slide, i) => `<div class="sl s${i}">${HERO_VIDEOS[i] ? `<video src="${HERO_VIDEOS[i]}" autoplay muted loop playsinline></video>` : ''}<div class="tx"><h2>${slide.title}</h2><p>${slide.subtitle}</p></div></div>`).join('')}</div>
<div class="dots" id="heroDots"></div><button class="ib arr l" onclick="moveSlide(-1)" aria-label="Sebelumnya">${icon('l')}</button><button class="ib arr r" onclick="moveSlide(1)" aria-label="Berikutnya">${icon('r')}</button></div>
<section><div class="w"><div class="sh rv"><h2>${translate('mading')}</h2><a class="more" href="#/pengumuman">${translate('inf')} ${icon('r')}</a></div><div class="grid">${[...announcementList.filter((a) => a.isOpen), ...announcementList.filter((a) => !a.isOpen)].slice(0, 4).map(announcementCard).join('')}</div></div></section>
<section class="alt"><div class="w"><div class="sh rv"><h2>${translate('news')}</h2><a class="more" href="#/berita">${translate('more')} ${icon('r')}</a></div><div class="grid">${newsList.slice(0, 4).map(newsCard).join('')}</div></div></section>
<section><div class="w"><div class="tri">
<div class="col"><div class="sh rv"><h2>${translate('lay')}</h2></div><a class="card p hv rv" href="#/layanan"><span class="ico">${icon('file')}</span><p>Ajukan surat dan dokumen kependudukan secara daring, lengkap dengan pelacakan status.</p><span class="more" style="margin-top:auto">${translate('read')} ${icon('r')}</span></a></div>
<div class="col"><div class="sh rv"><h2>${translate('adu')}</h2></div><a class="card p hv rv" style="--i:1" href="#/pengaduan"><span class="ico">${icon('mega')}</span><p>Laporkan masalah di lingkungan Anda. Laporan diteruskan ke pimpinan.</p><span class="more" style="margin-top:auto">${translate('read')} ${icon('r')}</span></a></div>
<div class="col wide"><div class="sh rv"><h2>${translate('peta')}</h2></div><div class="mapbox rv" style="--i:2"><iframe title="${translate('peta')}" src="${MAP_EMBED_URL}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div></div>
</div></div></section>`,

  profil: () => `<section><div class="w"><h1 class="rv" style="text-align:center">${translate('prof')}</h1>
<div class="card vm rv"><div class="vmc"><span class="ico">${icon('chart')}</span><h3>Visi</h3><p>Terwujudnya Kelurahan Klabala yang mandiri, tertib, dan sejahtera melalui pelayanan prima.</p></div><div class="vmc"><span class="ico">${icon('check')}</span><h3>Misi</h3><ul class="rq"><li>Meningkatkan kualitas pelayanan publik</li><li>Mendorong partisipasi dan gotong royong warga</li><li>Memperkuat ekonomi dan kesejahteraan masyarakat</li></ul></div></div>
<h2 class="rv" style="text-align:center">Struktur Organisasi</h2><div class="org"><div class="lv"><div class="one">${officialCard(OFFICIALS[0], 0)}</div></div><div class="ln"></div><div class="lv"><div class="one">${officialCard(OFFICIALS[1], 1)}</div></div><div class="ln"></div><div class="rest">${OFFICIALS.slice(2).map((official, i) => officialCard(official, i)).join('')}</div></div></div></section>`,

  layanan: () => {
    const user = getCurrentUser();
    const mySubmissions = loadStorage(STORAGE_KEYS.submissions, []).filter((x) => !x.e || x.e == user?.email);
    const serviceCards = SERVICES.map((service, i) => `<div class="card p rv" style="--i:${i}"><span class="ico">${icon(service.icon)}</span><h3>${service.name}</h3><b style="font-size:.85rem">Persyaratan</b><ul class="rq">${service.requirements.map((req) => `<li>${req}</li>`).join('')}</ul><button class="btn" style="margin-top:auto;align-self:flex-start" onclick="openServiceForm(${i})">${icon('plus')} ${translate('create')}</button></div>`).join('');

    const statusRows = mySubmissions.map((m) => {
      const needsFix = m.s == STATUS.NEEDS_FIX;
      const code = needsFix
        ? `<a href="#/layanan" class="fixlk" title="Klik untuk memperbaiki pengajuan" onclick="event.preventDefault();editSubmission('${escapeHtml(m.c)}')">${m.c}</a>`
        : m.c;
      const statusClass = needsFix ? 'fix' : m.s == STATUS.DONE ? 'ok' : '';
      return `<div class="st"><div><b>${m.n}</b><br><small class="date">${code} · ${m.p} · ${formatDate(m.d)}${m.u ? ' · diperbarui ' + formatDate(m.u) : ''}</small>${needsFix ? '<br><small class="date" style="color:#b25400">Klik nomor layanan untuk memperbaiki data / berkas Anda.</small>' : ''}</div><span class="stt ${statusClass}">${m.s}</span></div>`;
    }).join('');

    return `<section><div class="w pgfade"><h1>${translate('lay')}</h1><div class="vid"><div>${icon('play')}<p>Video panduan pengajuan layanan<br><small>(pasang video di sini)</small></p></div></div>
<div class="grid">${serviceCards}</div>
<h2 class="rv" style="margin-top:44px">Status pengajuan saya</h2><div class="card p rv">${statusRows || '<p style="margin:0;color:var(--mute)">Belum ada pengajuan. Pilih layanan di atas untuk memulai.</p>'}<p class="date">Alur: Menunggu verifikasi, Diproses, Selesai (dokumen dikirim via WhatsApp). Jika berkas kurang atau tidak jelas, status menjadi "Perbaiki laporan".</p></div></div></section>`;
  },

  pengaduan: () => `<section><div class="w pgfade" id="reportWrapper"><div class="card p rv" style="max-width:560px;margin:0 auto"><h1 style="margin:0 0 4px">${translate('adu')}</h1>
<label for="reporterName">Nama (boleh dikosongkan)</label><input id="reporterName" autocomplete="name">
<label for="reporterPhone">Nomor HP / WhatsApp yang bisa dihubungi</label><input id="reporterPhone" type="tel" inputmode="numeric" maxlength="13" placeholder="08xxxxxxxxxx" value="${escapeHtml(getCurrentUser()?.phone || '')}" oninput="digitsOnly(this)">
<label for="reportDescription">Deskripsi aduan</label><textarea id="reportDescription" rows="5" placeholder="Ceritakan kejadian, lokasi, dan waktu"></textarea>
<label>Bukti pendukung (foto, dokumen)</label><div class="upz"><label class="btn s2" for="reportFiles">${icon('cloud')} Unggah bukti</label><small id="reportFileNames">Belum ada berkas</small><input type="file" id="reportFiles" hidden multiple accept="image/*,.pdf,.doc,.docx" onchange="showReportFileNames(this)"></div>
<p class="err" id="reportError"></p><p><button class="btn" onclick="submitReport()">${icon('mega')} Lapor sekarang</button></p></div></div></section>`,

  informasi: () => `<section><div class="w pgfade"><h1>${translate('inf')}</h1><div class="grid"><a class="card p hv rv" href="#/berita"><span class="ico">${icon('news')}</span><h2 style="margin:0">Berita</h2><p>Kabar terbaru kegiatan kelurahan.</p></a><a class="card p hv rv" style="--i:1" href="#/pengumuman"><span class="ico">${icon('mega')}</span><h2 style="margin:0">Pengumuman</h2><p>Informasi resmi dan tanya jawab warga.</p></a></div></div></section>`,

  berita: (id) => {
    if (id !== undefined && id !== '') {
      const news = newsList.find((x) => x.id == id);
      if (!news) return PAGES.berita();
      const comments = loadStorage(STORAGE_KEYS.commentPrefix + id, []);
      const pageUrl = encodeURIComponent(location.href);
      return `<section><div class="w pgfade art">${coverImage(news, newsList.indexOf(news))}<h1>${news.title}</h1><span class="date">${formatDate(news.date)}</span><p>${news.body}</p><p>Informasi lengkap dapat ditanyakan langsung ke kantor kelurahan pada jam pelayanan.</p>${attachmentsHtml(STORAGE_KEYS.news, news)}
<div class="share"><b>Bagikan berita ke</b><a class="so fb" target="_blank" rel="noopener" aria-label="Facebook" href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}">${SOCIAL_ICONS.facebook}</a><a class="so wa" target="_blank" rel="noopener" aria-label="WhatsApp" href="https://wa.me/?text=${encodeURIComponent(news.title + ' ' + location.href)}">${SOCIAL_ICONS.whatsapp}</a><button class="so ig" aria-label="Instagram" onclick="shareToInstagram()">${SOCIAL_ICONS.instagram}</button></div>
<h3>Berikan ulasan</h3><div>${comments.map((c) => `<div class="msg"><b>${c.n}</b><br>${c.m}</div>`).join('')}</div><label for="commentName">Nama</label><input id="commentName"><label for="commentText">Ulasan</label><textarea id="commentText" rows="3"></textarea><p><button class="btn" onclick="postComment('${id}')">${translate('send')}</button></p><a class="more" href="#/berita">${icon('l')} Kembali</a></div></section>`;
    }
    const totalPages = Math.ceil(newsList.length / ITEMS_PER_PAGE);
    const page = currentPageFromHash(totalPages);
    return `<section><div class="w pgfade"><h1>Berita</h1><div class="grid">${newsList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map(newsCard).join('')}</div>${paginationHtml(totalPages, page, (p) => `location.hash='#/berita?p=${p}'`)}</div></section>`;
  },

  pengumuman: (id) => {
    if (id !== undefined && id !== '') {
      const item = announcementList.find((x) => x.id == id);
      if (!item) return PAGES.pengumuman();
      return `<section><div class="w pgfade art">${coverImage(item, announcementList.indexOf(item), 'mega')}<span class="badge ${item.isOpen ? '' : 'g'}">${item.isOpen ? translate('new') : translate('done')}</span><h1>${item.title}</h1><span class="date">Berlaku sampai ${formatDate(item.date)}</span><p>${item.body}</p>${attachmentsHtml(STORAGE_KEYS.announcements, item)}
<h3 style="display:flex;align-items:center;gap:8px">${icon('chat')} Live chat dengan admin</h3><p class="date" style="margin:0 0 8px">Bertanya sebagai <b>${escapeHtml(getCurrentUser()?.name || 'Warga')}</b>. Balasan admin muncul otomatis di sini.</p><div class="chat" id="chatBox" aria-live="polite"></div><div class="row" style="margin-top:10px"><input id="chatInput" aria-label="Pertanyaan" placeholder="Tulis pertanyaan" onkeydown="if(event.key=='Enter')sendChatMessage('${item.id}')"><button class="btn" onclick="sendChatMessage('${item.id}')">${translate('send')}</button></div><p><a class="more" href="#/pengumuman">${icon('l')} Kembali</a></p></div></section>`;
    }
    const totalPages = Math.ceil(announcementList.length / ITEMS_PER_PAGE);
    const page = currentPageFromHash(totalPages);
    return `<section><div class="w pgfade"><h1>Pengumuman</h1>${notificationPill()}<div class="grid">${announcementList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map(announcementCard).join('')}</div>${paginationHtml(totalPages, page, (p) => `location.hash='#/pengumuman?p=${p}'`)}</div></section>`;
  },

  statistik: () => `<section><div class="w pgfade"><h1>${translate('sta')}</h1>
<div class="card p pop rv"><span class="ico">${icon('users')}</span><div class="big">${TOTAL_POPULATION.toLocaleString('id-ID')}</div><div>jumlah penduduk (jiwa)</div></div>
<p class="cap">Data contoh. Ganti dengan data resmi kelurahan.</p>
<div class="stat"><div class="card p rv" style="--i:1"><h3>Jenis kelamin</h3>${statBars(GENDER_STATS)}</div><div class="card p rv" style="--i:2"><h3>Kelompok usia</h3>${statBars(AGE_STATS)}</div><div class="card p rv" style="--i:3"><h3>Pekerjaan</h3>${statBars(JOB_STATS)}</div></div>
<h2 class="rv" style="margin-top:44px">Peta digital dan titik RT/RW</h2>
<div class="mp"><div class="mapbox rv"><iframe id="rtMap" title="Peta Kelurahan Klabala" src="${MAP_EMBED_URL}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
<div class="pr2" id="rtProfile">${EMPTY_PROFILE_HTML}</div></div>
<div id="rtChips"></div></div></section>`
};

/* ========== Statistik: profil RT / RW ========== */
const EMPTY_PROFILE_HTML = '<div class="card p ph0"><p style="margin:0;color:var(--mute)">Pilih RT untuk melihat profil RT &amp; RW.</p></div>';

function profileCard(person, label) {
  const photo = person.img ? `<img src="${escapeHtml(person.img)}" alt="${escapeHtml(person.name)}">` : AVATAR_SVG;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${person.lat.toFixed(6)},${person.lng.toFixed(6)}`;
  return `<div class="card pf cp"><div class="av">${photo}</div><div class="pi"><span class="badge" style="background:var(--sky)">${label}</span><h3>${person.name}</h3><p class="tel">${icon('phone')} <a href="tel:${person.tel.replace(/\D/g, '')}">${person.tel}</a></p><a class="adr" target="_blank" rel="noopener" title="Buka di Google Maps" href="${mapsUrl}">${icon('pin')}<span>${person.a}</span></a></div></div>`;
}

function renderRtChips() {
  const container = qs('#rtChips');
  if (!container) return;
  const start = (rtPage - 1) * RT_PER_PAGE;
  const totalPages = Math.ceil(RT_LIST.length / RT_PER_PAGE);
  const chips = RT_LIST.slice(start, start + RT_PER_PAGE)
    .map((rt) => `<button class="chip ${rt.n == selectedRt ? 'on' : ''}" onclick="selectRt(${rt.n})">${rt.k}</button>`)
    .join('');
  container.innerHTML = `<div class="chips">${chips}</div>${paginationHtml(totalPages, rtPage, (p) => `goToRtPage(${p})`, 'sm')}`;
}

function goToRtPage(page) {
  rtPage = page;
  renderRtChips();
}

function showRtProfile() {
  const rt = RT_LIST[selectedRt - 1];
  const rw = RW_LIST[rt.w - 1];
  qs('#rtProfile').innerHTML = profileCard(rt, 'RT ' + padNumber(rt.n)) + profileCard(rw, 'RW ' + padNumber(rw.w));
  qs('#rtMap').src = 'https://maps.google.com/maps?q=' + rt.lat.toFixed(6) + ',' + rt.lng.toFixed(6) + '&z=17&output=embed';
}

function selectRt(rtNumber) {
  selectedRt = rtNumber;
  renderRtChips();
  showRtProfile();
}

function initStatisticsPage() {
  if (selectedRt > 0) rtPage = Math.ceil(selectedRt / RT_PER_PAGE);
  renderRtChips();
  if (selectedRt > 0) showRtProfile();
}

/* ========== Live chat pengumuman & komentar berita ========== */
function renderChat(announcementId, forceScroll) {
  const box = qs('#chatBox');
  if (!box) return;
  const messages = loadStorage(STORAGE_KEYS.chatPrefix + announcementId, []);
  const user = getCurrentUser();
  const nearBottom = forceScroll || box.scrollHeight - box.scrollTop - box.clientHeight < 90;
  box.innerHTML =
    messages
      .map((m) => `<div class="cm ${m.a ? 'ad' : ''} ${!m.a && user && m.e == user.email ? 'me' : ''}"><b>${m.n}${m.a ? '<span class="adb">Admin</span>' : ''}</b><span class="ct">${m.m}</span>${m.at ? `<small>${formatDateTime(m.at)}</small>` : ''}</div>`)
      .join('') || '<div class="msg">Belum ada pertanyaan. Jadilah yang pertama bertanya.</div>';
  if (nearBottom) box.scrollTop = box.scrollHeight;
  markChatRead(announcementId, messages.length);
}

function sendChatMessage(announcementId) {
  const user = getCurrentUser();
  const input = qs('#chatInput');
  const text = input.value.trim();
  if (!text) return showToast('Tulis pesan terlebih dahulu');
  const key = STORAGE_KEYS.chatPrefix + announcementId;
  const messages = loadStorage(key, []);
  messages.push({ n: escapeHtml(user?.name || 'Warga'), m: escapeHtml(text), e: user?.email || '', at: Date.now() });
  if (!saveStorage(key, messages)) return showToast('Penyimpanan penuh');
  input.value = '';
  renderChat(announcementId, 1);
}

function postComment(newsId) {
  const name = qs('#commentName').value.trim() || 'Warga';
  const text = qs('#commentText').value.trim();
  if (!text) return showToast('Tulis pesan terlebih dahulu');
  const key = STORAGE_KEYS.commentPrefix + newsId;
  const comments = loadStorage(key, []);
  comments.push({ n: escapeHtml(name), m: escapeHtml(text) });
  saveStorage(key, comments);
  renderRoute();
}

/* Buka lampiran berupa file (disimpan sebagai data URL) di tab baru. */
async function openAttachment(event, storageKey, itemId, attachmentIndex) {
  event.preventDefault();
  const item = loadStorage(storageKey, []).find((x) => x.id == itemId);
  const attachment = item && (item.l || [])[attachmentIndex];
  if (!attachment) return;
  const newTab = window.open('', '_blank');
  try {
    const blob = await (await fetch(attachment.u)).blob();
    const objectUrl = URL.createObjectURL(blob);
    if (newTab) newTab.location.href = objectUrl;
    else showToast('Izinkan pop-up untuk membuka berkas');
  } catch (error) {
    if (newTab) newTab.close();
    showToast('Gagal membuka berkas');
  }
}

function shareToInstagram() {
  try {
    navigator.clipboard.writeText(location.href);
  } catch (error) {
    /* clipboard tidak tersedia: abaikan */
  }
  showToast('Tautan disalin, tempel di Instagram');
  window.open('https://instagram.com', '_blank', 'noopener');
}

/* ========== Form layanan ========== */
let isSubmitting = false;

/* Berkas tersimpan pada pengajuan = { n: 'Nama persyaratan - namafile.jpg', ... } */
const findSavedFile = (submission, requirement) =>
  (submission.f || []).find((file) => (file.n || '').startsWith(requirement + ' - '));

function editSubmission(code) {
  const submission = loadStorage(STORAGE_KEYS.submissions, []).find((x) => x.c == code);
  if (!submission) return;
  const serviceIndex = SERVICES.findIndex((service) => service.name == submission.n);
  if (serviceIndex < 0) return showToast('Jenis layanan tidak ditemukan');
  openServiceForm(serviceIndex, code);
}

function openServiceForm(serviceIndex, code) {
  const service = SERVICES[serviceIndex];
  const editing = code ? loadStorage(STORAGE_KEYS.submissions, []).find((x) => x.c == code) : null;
  if (code && !editing) return showToast('Pengajuan tidak ditemukan');
  const user = getCurrentUser();
  const savedFile = (j) => (editing ? findSavedFile(editing, service.requirements[j]) : null);
  const savedFileName = (j) => savedFile(j).n.slice(service.requirements[j].length + 3);

  const uploadRows = service.requirements.map((requirement, j) =>
    `<div class="up"><div><b>${requirement}</b><br><small id="uploadName${j}">${savedFile(j) ? 'Tersimpan: ' + escapeHtml(savedFileName(j)) : 'Belum ada berkas'}</small></div><label class="btn o" for="uploadFile${j}">${icon('upl')} ${savedFile(j) ? 'Ganti' : 'Unggah'}</label><input type="file" id="uploadFile${j}" hidden accept="image/*,.pdf" onchange="showUploadFileName(${j},this)"></div>`
  ).join('');

  qs('#modalBody').innerHTML = `<h2 style="margin-top:0">${editing ? 'Perbaiki pengajuan' : service.name}</h2>${editing ? `<p class="date" style="margin:0 0 8px">${escapeHtml(service.name)} · ${escapeHtml(editing.c)}<br>Periksa data Anda, ganti berkas yang kurang atau tidak jelas, lalu klik Update.</p>` : ''}
<label for="formName">Nama lengkap</label><input id="formName" autocomplete="name" value="${escapeHtml(editing ? editing.p : user?.name || '')}">
<label for="formNik">NIK (16 digit)</label><input id="formNik" inputmode="numeric" maxlength="16" value="${escapeHtml(editing ? editing.k || '' : '')}" oninput="digitsOnly(this)">
<label for="formWhatsapp">Nomor WhatsApp aktif</label><input id="formWhatsapp" type="tel" inputmode="tel" maxlength="13" value="${escapeHtml(editing ? editing.hp || '' : user?.phone || '')}" placeholder="08xxxxxxxxxx" oninput="phoneCharsOnly(this)">
<label>Lampirkan berkas (satu per dokumen)</label>${uploadRows}
<p class="err" id="formError"></p><p style="display:flex;gap:10px;margin:14px 0 0"><button class="btn" onclick="submitServiceForm(${serviceIndex},'${editing ? escapeHtml(editing.c) : ''}')">${icon('send')} ${editing ? 'Update' : 'Kirim pengajuan'}</button><button class="btn o" onclick="closeModal()">Batal</button></p>`;
  qs('#modal').classList.add('on');
  setTimeout(() => qs('#formName').focus(), 50);
}

const successIcon = () => `<span class="ico" style="margin:0 auto 12px;background:#dcf7e5;color:#17703a">${icon('check')}</span>`;

async function submitServiceForm(serviceIndex, code) {
  if (isSubmitting) return;
  const requirements = SERVICES[serviceIndex].requirements;
  const name = qs('#formName').value.trim();
  const nik = qs('#formNik').value.trim();
  const whatsapp = qs('#formWhatsapp').value.trim();
  const errorBox = qs('#formError');
  const submissions = loadStorage(STORAGE_KEYS.submissions, []);
  const existing = code ? submissions.find((x) => x.c == code) : null;
  const savedFile = (j) => (existing ? findSavedFile(existing, requirements[j]) : null);
  const missingIndex = requirements.findIndex((_, j) => !qs('#uploadFile' + j).files.length && !savedFile(j));

  if (code && !existing) return (errorBox.textContent = 'Pengajuan tidak ditemukan.');
  if (existing && existing.s != STATUS.NEEDS_FIX) return (errorBox.textContent = 'Pengajuan ini sedang tidak dalam status perbaikan.');
  if (!name) return (errorBox.textContent = 'Nama lengkap wajib diisi.');
  if (nik.length != 16) return (errorBox.textContent = 'NIK harus 16 digit.');
  if (whatsapp.replace(/\D/g, '').length < 9) return (errorBox.textContent = 'Nomor WhatsApp belum benar.');
  if (missingIndex > -1) return (errorBox.textContent = 'Unggah berkas: ' + requirements[missingIndex] + '.');

  isSubmitting = true;
  errorBox.textContent = 'Memproses berkas...';
  let files;
  try {
    files = await Promise.all(
      requirements.map(async (requirement, j) => {
        const input = qs('#uploadFile' + j);
        if (existing && !input.files.length) return savedFile(j);
        const file = await readFileForUpload(input.files[0]);
        file.n = requirement + ' - ' + file.n;
        return file;
      })
    );
  } catch (error) {
    isSubmitting = false;
    return (errorBox.textContent = error.message);
  }
  errorBox.textContent = '';

  let finalCode = code;
  if (existing) {
    const index = submissions.findIndex((x) => x.c == code);
    if (index < 0) {
      isSubmitting = false;
      return (errorBox.textContent = 'Pengajuan tidak ditemukan.');
    }
    submissions[index] = { ...submissions[index], p: name, k: nik, hp: whatsapp, f: files, u: new Date().toISOString(), s: STATUS.WAITING_VERIFICATION };
  } else {
    finalCode = 'KLB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    submissions.unshift({ n: SERVICES[serviceIndex].name, c: finalCode, p: name, k: nik, hp: whatsapp, e: getCurrentUser()?.email || '', f: files, d: new Date().toISOString(), s: STATUS.WAITING_VERIFICATION });
  }
  isSubmitting = false;
  if (!saveStorage(STORAGE_KEYS.submissions, submissions)) return (errorBox.textContent = 'Penyimpanan penuh. Gunakan berkas yang lebih kecil.');

  qs('#modalBody').innerHTML = existing
    ? `<div style="text-align:center">${successIcon()}<h2 style="margin:0">Pembaruan terkirim</h2><p>Kode pengajuan Anda:</p><div class="big" style="font-size:2rem">${escapeHtml(finalCode)}</div><p style="color:var(--mute)">Data yang sudah Anda perbaiki masuk ke admin untuk diperiksa kembali. Pantau statusnya di halaman Layanan.</p><button class="btn" onclick="closeModal();renderRoute()">Tutup</button></div>`
    : `<div style="text-align:center">${successIcon()}<h2 style="margin:0">Pengajuan terkirim</h2><p>Kode pengajuan Anda:</p><div class="big" style="font-size:2rem">${finalCode}</div><p style="color:var(--mute)">Admin akan memverifikasi berkas. Pantau status di halaman Layanan. Dokumen jadi akan dikirim ke WhatsApp ${escapeHtml(whatsapp)}.</p><button class="btn" onclick="closeModal();renderRoute()">Tutup</button></div>`;
}

/* ========== Pengaduan ========== */
async function submitReport() {
  if (isSubmitting) return;
  const description = qs('#reportDescription').value.trim();
  const phone = qs('#reporterPhone').value.trim();
  const name = qs('#reporterName').value.trim();
  const errorBox = qs('#reportError');
  if (phone.length < 9 || phone.length > 13) return (errorBox.textContent = 'Nomor HP yang bisa dihubungi harus 9 sampai 13 digit.');
  if (!description) return (errorBox.textContent = 'Isi deskripsi aduan terlebih dahulu.');

  isSubmitting = true;
  errorBox.textContent = 'Memproses berkas...';
  let files = [];
  try {
    files = await Promise.all([...qs('#reportFiles').files].slice(0, 5).map(readFileForUpload));
  } catch (error) {
    isSubmitting = false;
    return (errorBox.textContent = error.message);
  }
  errorBox.textContent = '';

  const code = 'ADU-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const reports = loadStorage(STORAGE_KEYS.reports, []);
  reports.unshift({ c: code, n: name || 'Anonim', p: phone, x: description, f: files, d: new Date().toISOString(), s: STATUS.WAITING_VALIDATION });
  isSubmitting = false;
  if (!saveStorage(STORAGE_KEYS.reports, reports)) return (errorBox.textContent = 'Penyimpanan penuh. Gunakan berkas yang lebih kecil.');

  qs('#reportWrapper').innerHTML = `<div style="max-width:560px;margin:0 auto;display:grid;gap:18px"><div class="card p" style="text-align:center;align-items:center">${successIcon()}<h1 style="font-size:1.6rem;margin:0">Laporan berhasil dikirim</h1><p style="margin:10px 0 0;color:var(--mute)">Kode pengaduan Anda</p><div class="big" id="reportCode" style="font-size:2.2rem;margin:4px 0 12px">${code}</div><button class="btn o" onclick="copyReportCode()">${icon('file')} Salin kode</button><p class="date" style="margin:12px 0 0">Simpan kode ini untuk menanyakan perkembangan laporan Anda.</p></div><div class="card p thx"><h3 style="margin:0 0 8px">Terima kasih sudah melapor</h3><p style="margin:0">Laporan Anda sudah kami terima. Tim kelurahan akan segera memvalidasi laporan ini, lalu menindaklanjutinya. Bila ada yang perlu dikonfirmasi, kami akan menghubungi Anda di nomor <b>${escapeHtml(phone)}</b>. Terima kasih telah ikut menjaga dan membangun Klabala bersama kami.</p></div><p style="text-align:center;margin:0"><a class="btn" href="#/home">Kembali ke beranda</a> <button class="btn o" onclick="renderRoute()">Buat laporan baru</button></p></div>`;
  scrollTo(0, 0);
}

function copyReportCode() {
  try {
    navigator.clipboard.writeText(qs('#reportCode').textContent);
  } catch (error) {
    /* clipboard tidak tersedia: abaikan */
  }
  showToast('Kode pengaduan disalin');
}

/* ========== Modal & toast ========== */
function closeModal() {
  qs('#modal').classList.remove('on');
}

qs('#modal').addEventListener('click', (event) => {
  if (event.target.id == 'modal') closeModal();
});

let toastTimer;
function showToast(message) {
  const toast = qs('#toast');
  toast.textContent = message;
  toast.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.style.display = 'none'), 3500);
}

/* ========== Slider beranda ========== */
let currentSlide = 0;
let slideTimer;
let swipeStartX = null;

function renderSlide() {
  const track = qs('#heroTrack');
  if (!track) return;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  qs('#heroDots').innerHTML = HERO_SLIDES.map((_, i) => `<button class="${i == currentSlide ? 'on' : ''}" aria-label="Slide ${i + 1}" onclick="goToSlide(${i})"></button>`).join('');
}

function restartSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    if (qs('#heroTrack')) {
      currentSlide = (currentSlide + 1) % HERO_SLIDES.length;
      renderSlide();
    }
  }, 5000);
}

function goToSlide(index) {
  currentSlide = index;
  renderSlide();
  restartSlideTimer();
}

function moveSlide(direction) {
  goToSlide((currentSlide + direction + HERO_SLIDES.length) % HERO_SLIDES.length);
}

function initHeroSlider() {
  currentSlide = 0;
  const hero = qs('#hero');
  if (!hero) return clearInterval(slideTimer);
  renderSlide();
  restartSlideTimer();
  hero.onpointerdown = (event) => (swipeStartX = event.clientX);
  hero.onpointerup = (event) => {
    if (swipeStartX !== null && Math.abs(event.clientX - swipeStartX) > 40) moveSlide(event.clientX < swipeStartX ? 1 : -1);
    swipeStartX = null;
  };
}

/* ========== Router (hash: #/halaman/parameter?p=2) ========== */
function routeParts() {
  return (location.hash.slice(2) || 'home').split('?')[0].split('/');
}

function renderRoute() {
  loadContent();
  const [page, param] = routeParts();
  const scrollY = window.scrollY;
  const needsLogin = page != 'home' && PAGES[page] && !getCurrentUser();
  qs('#app').innerHTML = needsLogin ? authPageHtml() : (PAGES[page] || PAGES.home)(param);
  if (page == 'pengumuman' && param && qs('#chatBox')) renderChat(param, 1);
  renderChrome(page);
  if (page == 'statistik') initStatisticsPage();
  initHeroSlider();
  initRevealOnScroll();
  if (renderRoute.lastHash != location.hash) {
    scrollTo(0, 0);
    renderRoute.lastHash = location.hash;
  } else {
    scrollTo(0, scrollY);
  }
  qs('#mainNav').classList.remove('open');
}

/* Header, menu, panel aksesibilitas, dan footer */
function renderChrome(activePage) {
  qs('#menuToggle').innerHTML = icon('menu');
  qs('#mainNav').innerHTML = navigationHtml(activePage);
  qs('#a11yButton').innerHTML = icon('acc');
  const isDark = document.documentElement.dataset.theme == 'dark';
  qs('#a11yPanel').innerHTML = `<h3>${translate('a11')}</h3><b style="font-size:.8rem;color:var(--mute)">${translate('size')}</b><div class="g"><button onclick="changeFontSize(-1)">A-</button><button onclick="changeFontSize(0)">A</button><button onclick="changeFontSize(1)">A+</button></div><b style="font-size:.8rem;color:var(--mute)">${translate('lg')}</b><div class="g"><button class="${currentLanguage == 'id' ? 'on' : ''}" onclick="setLanguage('id')">Indonesia</button><button class="${currentLanguage == 'en' ? 'on' : ''}" onclick="setLanguage('en')">English</button></div><b style="font-size:.8rem;color:var(--mute)">${translate('th')}</b><div class="g"><button class="${isDark ? '' : 'on'}" onclick="setTheme('light')">${translate('light')}</button><button class="${isDark ? 'on' : ''}" onclick="setTheme('dark')">${translate('dark')}</button></div>`;
  qs('#siteFooter').innerHTML = `<div><h3>Kelurahan Klabala</h3><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=Kantor+Kelurahan+Klabala+Sorong">${icon('pin')}<span>Kantor Kelurahan Klabala, Distrik Malaimsimsa, Kota Sorong, Papua Barat Daya</span></a></div>
<div><h3>${translate('jam')}</h3><div class="r"><span>Senin - Kamis</span><span>09.00 - 17.00 WIT</span></div><div class="r"><span>Jumat</span><span>09.00 - 14.00 WIT</span></div><div class="r"><span>Sabtu - Minggu</span><span>Libur</span></div></div>
<div><h3>${translate('contact')}</h3><a target="_blank" rel="noopener" href="https://wa.me/6281200000000">${icon('phone')}<span>WhatsApp 0812-0000-0000</span></a><h3 style="margin-top:18px">${translate('soc')}</h3><div class="row" style="gap:10px"><a class="so fb" target="_blank" rel="noopener" aria-label="Facebook" href="https://facebook.com">${SOCIAL_ICONS.facebook}</a><a class="so ig" target="_blank" rel="noopener" aria-label="Instagram" href="https://instagram.com">${SOCIAL_ICONS.instagram}</a><a class="so yt" target="_blank" rel="noopener" aria-label="YouTube" href="https://youtube.com">${SOCIAL_ICONS.youtube}</a></div></div>`;
  document.documentElement.lang = currentLanguage;
}

/* ========== Pencarian ========== */
function openSearch() {
  qs('#modalBody').innerHTML = `<input id="searchInput" placeholder="${translate('search')}" oninput="runSearch(this.value)" aria-label="${translate('search')}"><div id="searchResults" style="margin-top:12px"></div>`;
  qs('#modal').classList.add('on');
  setTimeout(() => qs('#searchInput').focus(), 50);
}

function runSearch(keyword) {
  keyword = keyword.toLowerCase();
  const matches = keyword
    ? [
        ...newsList.filter((n) => n.title.toLowerCase().includes(keyword)).map((n) => ['berita', n]),
        ...announcementList.filter((n) => n.title.toLowerCase().includes(keyword)).map((n) => ['pengumuman', n])
      ]
    : [];
  qs('#searchResults').innerHTML =
    matches.map(([type, item]) => `<a class="st" href="#/${type}/${item.id}" onclick="closeModal()"><span>${item.title}</span><span class="stt">${type}</span></a>`).join('') ||
    (keyword ? '<p>Tidak ada hasil.</p>' : '');
}

/* Animasi muncul saat di-scroll */
function initRevealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.rv').forEach((element) => observer.observe(element));
}

/* ========== Bahasa, tema, ukuran teks ========== */
function setLanguage(language) {
  currentLanguage = language;
  saveStorage(STORAGE_KEYS.language, language);
  renderRoute();
}

function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  saveStorage(STORAGE_KEYS.theme, mode);
  renderChrome(routeParts()[0]);
}

let fontSize = loadStorage(STORAGE_KEYS.fontSize, 16);
function changeFontSize(delta) {
  fontSize = delta == 0 ? 16 : Math.min(22, Math.max(13, fontSize + delta));
  saveStorage(STORAGE_KEYS.fontSize, fontSize);
  document.documentElement.style.setProperty('--fs', fontSize + 'px');
}

qs('#a11yButton').onclick = () => {
  const isOpen = qs('#a11yPanel').classList.toggle('on');
  qs('#a11yButton').setAttribute('aria-expanded', isOpen);
};
qs('#menuToggle').onclick = () => qs('#mainNav').classList.toggle('open');

document.documentElement.dataset.theme = loadStorage(STORAGE_KEYS.theme, 'light');
document.documentElement.style.setProperty('--fs', fontSize + 'px');

/* ========== Akun warga (daftar / masuk) ========== */
let authTab = 'daftar';

function getCurrentUser() {
  const email = loadStorage(STORAGE_KEYS.currentUser, null);
  return email ? loadStorage(STORAGE_KEYS.users, []).find((user) => user.email == email) || null : null;
}

function navigationHtml(activePage) {
  const activeClass = (page) => (activePage == page ? 'on' : '');
  const user = getCurrentUser();
  const inInformation = activePage == 'informasi' || activePage == 'berita' || activePage == 'pengumuman';
  const unread = totalUnread();
  const unreadDot = unread ? '<i class="dot"></i>' : '';
  const accountPart = user
    ? `<span class="me" title="${escapeHtml(user.email)}">${icon('user')}<b>${escapeHtml(user.name.split(' ')[0])}</b></span><button class="ib" onclick="signOut()" aria-label="Keluar">${icon('out')}</button>`
    : '';
  return `<a href="#/home" class="${activeClass('home')}">${translate('home')}</a><a href="#/profil" class="${activeClass('profil')}">${translate('prof')}</a><a href="#/layanan" class="${activeClass('layanan')}">${translate('lay')}</a><a href="#/pengaduan" class="${activeClass('pengaduan')}">${translate('adu')}</a><div class="dd" id="dropdown"><button class="ddb ${inInformation ? 'on' : ''}" onclick="toggleDropdown(event)" aria-haspopup="true" aria-expanded="false">${translate('inf')}${unreadDot} ${icon('down')}</button><div class="ddm"><a href="#/berita">Berita</a><a href="#/pengumuman">Pengumuman${unreadDot}</a></div></div><a href="#/statistik" class="${activeClass('statistik')}">${translate('sta')}</a><button class="ib" onclick="openSearch()" aria-label="Cari">${icon('search')}</button>${accountPart}`;
}

function authPageHtml() {
  const isRegister = authTab == 'daftar';
  return `<section><div class="w pgfade"><div class="card p auth"><div class="tabs"><button class="${isRegister ? 'on' : ''}" onclick="setAuthTab('daftar')">Daftar</button><button class="${isRegister ? '' : 'on'}" onclick="setAuthTab('masuk')">Masuk</button></div><h1 style="font-size:1.5rem;margin:6px 0 4px">${isRegister ? 'Buat akun warga' : 'Masuk ke akun Anda'}</h1><p style="color:var(--mute);margin:0 0 6px">${isRegister ? 'Daftar dulu untuk mengakses menu Kelurahan Klabala. Berita dan pengumuman terbaru akan dikirim ke email Anda.' : 'Cukup masukkan email dan nomor HP yang sudah terdaftar.'}</p>${isRegister ? '<label for="registerName">Nama lengkap</label><input id="registerName" autocomplete="name">' : ''}<label for="authEmail">Alamat email aktif</label><input id="authEmail" type="email" autocomplete="email"><label for="authPhone">Nomor HP (maksimal 13 digit)</label><input id="authPhone" type="tel" inputmode="numeric" maxlength="13" placeholder="08xxxxxxxxxx" oninput="digitsOnly(this)"><p class="err" id="authError"></p><button class="btn" onclick="${isRegister ? 'register()' : 'login()'}">${isRegister ? 'Daftar' : 'Masuk'}</button><p class="date" style="margin:14px 0 6px">${isRegister ? 'Username Anda otomatis memakai nama lengkap.' : 'Belum punya akun? Pilih tab Daftar.'}</p><a class="more" href="#/home">${icon('l')} Kembali ke beranda</a></div></div></section>`;
}

function setAuthTab(tab) {
  authTab = tab;
  renderRoute();
}

function register() {
  const name = qs('#registerName').value.trim();
  const email = qs('#authEmail').value.trim().toLowerCase();
  const phone = qs('#authPhone').value.trim();
  const errorBox = qs('#authError');
  if (name.length < 3) return (errorBox.textContent = 'Nama lengkap minimal 3 huruf.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return (errorBox.textContent = 'Alamat email belum benar.');
  if (phone.length < 9 || phone.length > 13) return (errorBox.textContent = 'Nomor HP harus 9 sampai 13 digit.');
  const users = loadStorage(STORAGE_KEYS.users, []);
  if (users.some((user) => user.email == email)) return (errorBox.textContent = 'Email sudah terdaftar. Silakan pilih tab Masuk.');
  users.push({ name, username: name, email, phone, at: Date.now() });
  saveStorage(STORAGE_KEYS.users, users);
  saveStorage(STORAGE_KEYS.currentUser, email);
  showToast('Selamat datang, ' + name);
  renderRoute();
}

function login() {
  const email = qs('#authEmail').value.trim().toLowerCase();
  const phone = qs('#authPhone').value.trim();
  const user = loadStorage(STORAGE_KEYS.users, []).find((x) => x.email == email && x.phone == phone);
  if (!user) return (qs('#authError').textContent = 'Email atau nomor HP tidak cocok. Belum punya akun? Pilih tab Daftar.');
  saveStorage(STORAGE_KEYS.currentUser, email);
  showToast('Selamat datang kembali, ' + user.name);
  renderRoute();
}

function signOut() {
  saveStorage(STORAGE_KEYS.currentUser, null);
  location.hash = '#/home';
  renderRoute();
  showToast('Anda sudah keluar');
}

/* ========== Membaca berkas unggahan ========== */
/* Gambar dikecilkan (maks 1280 px) dan dikompres JPG; berkas lain maks 1 MB. Hasil: { n, t, u (data URL) } */
function readFileForUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca ' + file.name));

    if (file.type.startsWith('image/')) {
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error(file.name + ' bukan gambar yang didukung (gunakan JPG/PNG)'));
        image.onload = () => {
          const scale = Math.min(1, 1280 / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          const context = canvas.getContext('2d');
          context.fillStyle = '#fff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve({ n: file.name.replace(/\.[^.]+$/, '') + '.jpg', t: 'image/jpeg', u: canvas.toDataURL('image/jpeg', 0.72) });
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      if (file.size > 1048576) return reject(new Error(file.name + ' lebih dari 1 MB'));
      reader.onload = () => resolve({ n: file.name, t: file.type, u: reader.result });
      reader.readAsDataURL(file);
    }
  });
}

function showReportFileNames(input) {
  qs('#reportFileNames').textContent = input.files.length ? [...input.files].map((file) => file.name).join(', ') : 'Belum ada berkas';
}

function showUploadFileName(index, input) {
  qs('#uploadName' + index).textContent = input.files[0] ? input.files[0].name : 'Belum ada berkas';
}

/* ========== Dropdown menu Informasi ========== */
function toggleDropdown(event) {
  event.stopPropagation();
  const isOpen = qs('#dropdown').classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', isOpen);
}

document.addEventListener('click', (event) => {
  const dropdown = qs('#dropdown');
  if (dropdown && !dropdown.contains(event.target)) dropdown.classList.remove('open');
});

/* ========== Sinkronisasi dengan halaman admin (tab lain) ========== */
addEventListener('hashchange', renderRoute);

/* Saat admin menyimpan data di tab lain, halaman yang terbuka ikut diperbarui. */
addEventListener('storage', (event) => {
  const parts = routeParts();
  const page = parts[0];
  const isTyping = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
  const modalOpen = qs('#modal').classList.contains('on');

  if (event.key && event.key.startsWith(STORAGE_KEYS.chatPrefix)) {
    const announcementId = event.key.slice(STORAGE_KEYS.chatPrefix.length);
    const messages = loadStorage(event.key, []);
    const last = messages[messages.length - 1];
    if (page == 'pengumuman' && parts[1] == announcementId && qs('#chatBox')) {
      renderChat(announcementId);
      if (last && last.a) showToast('Admin membalas pertanyaan di Pengumuman');
      return;
    }
    if (last && last.a && getCurrentUser()) {
      showToast('Admin membalas di Pengumuman');
      loadContent();
      renderChrome(page);
      if (page == 'pengumuman' && !parts[1] && !isTyping && !modalOpen) renderRoute();
    }
    return;
  }

  const watchedKeys = [STORAGE_KEYS.news, STORAGE_KEYS.announcements, STORAGE_KEYS.submissions, STORAGE_KEYS.reports];
  if (!watchedKeys.includes(event.key)) return;
  if (!['home', 'berita', 'pengumuman', 'layanan'].includes(page)) return;
  if (modalOpen || isTyping) return;
  renderRoute();
});

renderRoute();
