/* =============================================================
   admin.js - Panel admin Kelurahan Klabala (admin.html)
   Bergantung pada: js/shared.js

   Data dibaca dan ditulis lewat localStorage, kunci yang sama dengan
   halaman warga (lihat STORAGE_KEYS di shared.js).
   ============================================================= */

/* GANTI kata sandi ini. Hanya contoh di sisi browser, BUKAN keamanan sungguhan:
   siapa pun bisa membacanya lewat "View Source". */
const ADMIN_PASSWORD = 'admin123';

document.documentElement.dataset.theme = loadStorage(STORAGE_KEYS.theme, 'light');

/* Tipe konten (nama di URL -> kunci localStorage) */
const CONTENT_KEYS = {
  berita: STORAGE_KEYS.news,
  pengumuman: STORAGE_KEYS.announcements
};

/* Pilihan status per jenis data (kunci = kunci localStorage) */
const STATUS_OPTIONS = {
  [STORAGE_KEYS.submissions]: [STATUS.WAITING_VERIFICATION, STATUS.PROCESSING, STATUS.NEEDS_FIX, STATUS.DONE],
  [STORAGE_KEYS.reports]: [STATUS.WAITING_VALIDATION, STATUS.PROCESSING, STATUS.DONE]
};

/* Menu samping. isHistory = tampil di grup "Riwayat". */
const TABS = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'berita', label: 'Berita' },
  { id: 'pengumuman', label: 'Pengumuman' },
  { id: 'layanan', label: 'Layanan' },
  { id: 'pengaduan', label: 'Pengaduan' },
  { id: 'warga', label: 'Warga' },
  { id: 'riwayat-layanan', label: 'Riwayat Layanan', isHistory: true },
  { id: 'riwayat-pengaduan', label: 'Riwayat Pengaduan', isHistory: true }
];

/* Pesan WhatsApp otomatis. Edit redaksi di sini. */
const WHATSAPP_MESSAGES = {
  service: 'Halo Sobat Klabala 👋😊, Terima kasih sudah menggunakan Layanan Digital di Website Kelurahan Klabala 🙏 berikut ini surat yang kamu minta sudah jadi. Semoga bermanfaat, hubungi kami jika ada keperluan lainnya 🙏',
  report: 'Halo Sobat Klabala 👋😊, terima kasih sudah melapor kepada kami. Laporan Anda sudah sampai kepada Pimpinan, kami akan menindaklanjuti Laporan Anda 🙏. Terima kasih sudah menggunakan Layanan Digital di Website Kelurahan Klabala. Semoga bermanfaat, hubungi kami jika ada keperluan lainnya 🙏'
};

/* Status tampilan */
let searchQuery = '';
let periodFilter = 'all'; /* 'all' atau '30' (30 hari terakhir) */
let toastTimer;
let activeChatId = null;
let editorState = { img: '', l: [] }; /* foto sampul & lampiran yang sedang diedit */

/* ========== Format & helper umum ========== */
const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const formatDateTime = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const todayISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

/* 08123 -> 628123 (format wa.me) */
const toWhatsappNumber = (phone) => String(phone).replace(/\D/g, '').replace(/^0/, '62');

/* Simpan dan beri tahu admin bila penyimpanan penuh. */
function saveData(key, value) {
  const saved = saveStorage(key, value);
  if (!saved) showToast('Penyimpanan penuh. Kurangi ukuran foto/berkas.');
  return saved;
}

function showToast(message) {
  const toast = qs('#toast');
  toast.textContent = message;
  toast.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.style.display = 'none'), 3000);
}

function closeModal() {
  qs('#modal').classList.remove('on');
  if (activeChatId) {
    activeChatId = null;
    renderAdmin();
  }
}

qs('#modal').onclick = (event) => {
  if (event.target.id == 'modal') closeModal();
};

const searchBoxHtml = () =>
  `<input id="searchInput" aria-label="Cari" placeholder="Cari..." value="${escapeHtml(searchQuery)}" oninput="searchQuery=this.value;renderAdmin()">`;

/* ========== Live chat pengumuman ========== */
const CHAT_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/></svg>';

/* Jumlah pesan warga yang belum dibaca admin pada satu pengumuman. */
function unreadFromResidents(announcementId) {
  const messages = loadStorage(STORAGE_KEYS.chatPrefix + announcementId, []);
  const readCount = loadStorage(STORAGE_KEYS.adminReadCounts, {})[announcementId] || 0;
  return messages.slice(readCount).filter((message) => !message.a).length;
}

const totalUnreadFromResidents = () =>
  loadStorage(CONTENT_KEYS.pengumuman, []).reduce((sum, item) => sum + (item.id ? unreadFromResidents(item.id) : 0), 0);

function markAdminChatRead(announcementId, messageCount) {
  const readCounts = loadStorage(STORAGE_KEYS.adminReadCounts, {});
  if (readCounts[announcementId] !== messageCount) {
    readCounts[announcementId] = messageCount;
    saveData(STORAGE_KEYS.adminReadCounts, readCounts);
  }
}

function renderAdminChat(forceScroll) {
  const box = qs('#adminChat');
  if (!box || !activeChatId) return;
  const messages = loadStorage(STORAGE_KEYS.chatPrefix + activeChatId, []);
  const nearBottom = forceScroll || box.scrollHeight - box.scrollTop - box.clientHeight < 90;
  box.innerHTML =
    messages
      .map((m) => `<div class="cm ${m.a ? 'me' : ''}"><b>${m.n}${m.a ? '<span class="adb">Admin</span>' : ''}</b><span class="ct">${m.m}</span>${m.at ? `<small>${formatDateTime(m.at)}</small>` : ''}</div>`)
      .join('') || '<div class="msg">Belum ada pesan dari warga.</div>';
  if (nearBottom) box.scrollTop = box.scrollHeight;
  markAdminChatRead(activeChatId, messages.length);
}

function openChat(announcementId) {
  const announcement = loadStorage(CONTENT_KEYS.pengumuman, []).find((x) => x.id == announcementId);
  if (!announcement) return;
  activeChatId = announcementId;
  qs('#modalBody').innerHTML = `<h2 style="margin-top:0">Live chat</h2><p><small>${escapeHtml(announcement.t)}</small></p><div class="chat" id="adminChat"></div><div class="row" style="margin-top:12px"><input id="adminReply" placeholder="Tulis balasan sebagai Admin" aria-label="Balasan" onkeydown="if(event.key=='Enter')sendAdminReply()"><button class="btn" onclick="sendAdminReply()">Kirim</button></div><p style="margin:12px 0 0"><button class="btn o" onclick="closeModal()">Tutup</button></p>`;
  qs('#modal').classList.add('on');
  renderAdminChat(1);
  setTimeout(() => qs('#adminReply').focus(), 50);
}

function sendAdminReply() {
  const input = qs('#adminReply');
  const text = input.value.trim();
  if (!text || !activeChatId) return;
  const key = STORAGE_KEYS.chatPrefix + activeChatId;
  const messages = loadStorage(key, []);
  messages.push({ n: 'Admin Kelurahan', m: escapeHtml(text), a: 1, at: Date.now() });
  if (!saveData(key, messages)) return;
  input.value = '';
  renderAdminChat(1);
}

/* ========== Foto & lampiran berita / pengumuman ========== */
/* Foto dipotong otomatis ke rasio 16:10 (960x600) agar pas dengan kartu. Hasil: data URL JPG. */
const cropImageToCard = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca foto'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Foto tidak didukung (gunakan JPG/PNG)'));
      image.onload = () => {
        const width = 960;
        const height = 600;
        const scale = Math.max(width / image.width, height / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);
        context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

function renderEditorAttachments() {
  qs('#coverPreview').innerHTML = editorState.img
    ? `<div class="ph im" style="max-width:320px"><img src="${escapeHtml(editorState.img)}" alt="Pratinjau foto"></div>`
    : '';
  qs('#attachmentList').innerHTML = editorState.l
    .map((attachment, index) => `<div class="up"><div><b>${escapeHtml(attachment.n)}</b><br><small>${attachment.k == 'link' ? escapeHtml(attachment.u) : 'File terunggah'}</small></div><button class="btn o dg" type="button" onclick="removeAttachment(${index})">Hapus</button></div>`)
    .join('');
}

function removeAttachment(index) {
  editorState.l.splice(index, 1);
  renderEditorAttachments();
}

function clearCoverImage() {
  editorState.img = '';
  renderEditorAttachments();
}

async function pickCoverImage(input) {
  const file = input.files[0];
  if (!file) return;
  try {
    editorState.img = await cropImageToCard(file);
  } catch (error) {
    showToast(error.message);
  }
  input.value = '';
  renderEditorAttachments();
}

function pickAttachmentFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 1048576) {
    input.value = '';
    return showToast('Ukuran file maksimal 1 MB');
  }
  const reader = new FileReader();
  reader.onload = () => {
    editorState.l.push({ n: file.name, u: reader.result, k: 'file', t: file.type });
    input.value = '';
    renderEditorAttachments();
  };
  reader.readAsDataURL(file);
}

function addAttachmentLink() {
  const name = qs('#linkName').value.trim();
  let url = qs('#linkUrl').value.trim();
  if (!url) return showToast('Isi alamat tautan');
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (error) {
    return showToast('Alamat tautan tidak valid');
  }
  editorState.l.push({ n: name || hostname, u: url, k: 'link' });
  qs('#linkName').value = qs('#linkUrl').value = '';
  renderEditorAttachments();
}

/* ========== Helper data layanan / pengaduan ========== */
/* Nomor WA: pengaduan = r.p. Layanan = r.hp (atau nama lama), atau dicari dari data warga (email/nama). */
function getPhone(record, storageKey) {
  if (storageKey == STORAGE_KEYS.reports) return record.p || '';
  const direct = record.hp || record.wa || record.h || record.phone || record.tel || record.nohp;
  if (direct) return direct;
  const user = loadStorage(STORAGE_KEYS.users, []).find((u) => (record.e && u.email == record.e) || (record.em && u.email == record.em) || (record.p && u.name == record.p));
  return user ? user.phone || '' : '';
}

const whatsappUrl = (phone, message) => `https://wa.me/${toWhatsappNumber(phone)}` + (message ? `?text=${encodeURIComponent(message)}` : '');

const whatsappLinkHtml = (phone, message) =>
  phone ? `<a target="_blank" rel="noopener" href="${whatsappUrl(phone, message)}" title="Buka chat WhatsApp">${escapeHtml(phone)}</a>` : '<small>-</small>';

/* Berkas: array record.f = [{ n: nama, t: tipe, u: dataURL }] (nama field alternatif juga dibaca) */
function getFiles(record) {
  const raw = record.f || record.files || record.berkas || record.file || record.lampiran || [];
  return (Array.isArray(raw) ? raw : [raw])
    .filter(Boolean)
    .map((item, index) =>
      typeof item == 'string'
        ? { n: 'Berkas ' + (index + 1), u: item, t: '' }
        : { n: item.n || item.name || 'Berkas ' + (index + 1), u: item.u || item.data || item.url || item.src || '', t: item.t || item.type || '' }
    )
    .filter((file) => file.u);
}

const isInPeriod = (date) => periodFilter == 'all' || new Date(date) >= new Date(Date.now() - 30 * 864e5);

/* Data terfilter pencarian (dan periode untuk riwayat) sebagai [[record, index]].
   kind: 'submissions' | 'reports' | 'submissionHistory' | 'reportHistory' | 'users' */
function selectRecords(kind) {
  const matches = (text) => String(text ?? '').toLowerCase().includes(searchQuery.toLowerCase());
  if (kind == 'users') {
    return loadStorage(STORAGE_KEYS.users, [])
      .map((user, index) => [user, index])
      .filter(([user]) => matches((user.name || '') + (user.email || '') + (user.phone || '')));
  }
  const isHistory = kind == 'submissionHistory' || kind == 'reportHistory';
  const storageKey = kind == 'submissionHistory' ? STORAGE_KEYS.submissions : kind == 'reportHistory' ? STORAGE_KEYS.reports : STORAGE_KEYS[kind];
  const records = loadStorage(storageKey, [])
    .map((record, index) => [record, index])
    .filter(([record]) => matches((record.c || '') + (record.n || '') + (record.p || '') + (record.x || '')));
  return isHistory ? records.filter(([record]) => record.s == STATUS.DONE && isInPeriod(record.d)) : records;
}

/* ========== Ekspor CSV / Excel / PDF ========== */
const SUBMISSION_HEADERS = ['Kode', 'Layanan', 'Pemohon', 'No. HP/WA', 'Tanggal', 'Status', 'Jumlah berkas'];
const REPORT_HEADERS = ['Kode', 'Pelapor', 'No. HP/WA', 'Isi pengaduan', 'Tanggal', 'Status', 'Jumlah berkas'];
const submissionRow = (r) => [r.c, r.n, r.p, getPhone(r, STORAGE_KEYS.submissions), formatDate(r.d), r.s, getFiles(r).length];
const reportRow = (r) => [r.c, r.n, r.p, r.x, formatDate(r.d), r.s, getFiles(r).length];

const EXPORT_CONFIG = {
  submissions: { title: 'Rekap Layanan', headers: SUBMISSION_HEADERS, toRow: submissionRow },
  submissionHistory: { title: 'Riwayat Layanan', headers: SUBMISSION_HEADERS, toRow: submissionRow },
  reports: { title: 'Rekap Pengaduan', headers: REPORT_HEADERS, toRow: reportRow },
  reportHistory: { title: 'Riwayat Pengaduan', headers: REPORT_HEADERS, toRow: reportRow },
  users: { title: 'Rekap Warga', headers: ['Nama', 'Email', 'No. HP', 'Tanggal daftar'], toRow: (u) => [u.name, u.email, u.phone, formatDate(u.at)] }
};

const downloadButtonsHtml = (kind) =>
  `<span class="dlg"><small>Unduh:</small><button class="btn o" onclick="exportData('${kind}','csv')">CSV</button><button class="btn o" onclick="exportData('${kind}','xlsx')">Excel</button><button class="btn o" onclick="exportData('${kind}','pdf')">PDF</button></span>`;

function saveBlob(blob, fileName) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

function exportData(kind, format) {
  const config = EXPORT_CONFIG[kind];
  const rows = selectRecords(kind).map(([record]) => config.toRow(record).map((value) => value ?? ''));
  if (!rows.length) return showToast('Tidak ada data');
  const fileName = config.title.replace(/\s+/g, '_').toLowerCase() + '_' + new Date().toISOString().slice(0, 10);
  const isHistory = kind == 'submissionHistory' || kind == 'reportHistory';
  const subtitle = isHistory ? (periodFilter == 'all' ? 'Rekap keseluruhan' : 'Rekap 1 bulan terakhir') : 'Dicetak ' + formatDate(Date.now());

  if (format == 'csv') {
    const quote = (value) => '"' + String(value).replace(/"/g, '""') + '"';
    const csv = '\ufeff' + [config.headers, ...rows].map((row) => row.map(quote).join(',')).join('\n');
    saveBlob(new Blob([csv], { type: 'text/csv' }), fileName + '.csv');
  } else if (format == 'xlsx') {
    if (!window.XLSX) return showToast('Pustaka Excel belum termuat (perlu internet)');
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([config.headers, ...rows]), 'Rekap');
    XLSX.writeFile(workbook, fileName + '.xlsx');
  } else {
    if (!window.jspdf) return showToast('Pustaka PDF belum termuat (perlu internet)');
    const pdf = new jspdf.jsPDF({ orientation: 'landscape' });
    pdf.setFontSize(14);
    pdf.text('Kelurahan Klabala - ' + config.title, 14, 14);
    pdf.setFontSize(9);
    pdf.text(subtitle + ' | Total: ' + rows.length + ' data', 14, 20);
    pdf.autoTable({ head: [config.headers], body: rows, startY: 25, styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [14, 165, 233] } });
    pdf.save(fileName + '.pdf');
  }
}

/* ========== Lihat berkas ========== */
async function viewFiles(storageKey, index) {
  const record = loadStorage(storageKey, [])[index];
  const files = getFiles(record);
  qs('#modalBody').innerHTML = `<h2 style="margin-top:0">Berkas ${escapeHtml(record.c)}</h2><div id="filesView"></div><p><button class="btn o" onclick="closeModal()">Tutup</button></p>`;
  qs('#modal').classList.add('on');
  for (const file of files) {
    let url = file.u;
    try {
      if (url.startsWith('data:')) url = URL.createObjectURL(await (await fetch(url)).blob());
    } catch (error) {
      /* pakai data URL apa adanya */
    }
    const mimeType = file.t || (file.u.match(/^data:([^;,]+)/) || [])[1] || '';
    const isImage = mimeType.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(file.n);
    const isPdf = mimeType == 'application/pdf' || /\.pdf$/i.test(file.n);
    const preview = isImage
      ? `<img src="${escapeHtml(url)}" alt="${escapeHtml(file.n)}">`
      : isPdf
        ? `<iframe src="${escapeHtml(url)}" title="${escapeHtml(file.n)}"></iframe>`
        : '';
    qs('#filesView').insertAdjacentHTML('beforeend', `<div class="fi"><b>${escapeHtml(file.n)}</b>${preview}<p class="ac"><a class="btn o" target="_blank" rel="noopener" href="${escapeHtml(url)}">Buka</a><a class="btn o" href="${escapeHtml(url)}" download="${escapeHtml(file.n)}">Unduh</a></p></div>`);
  }
}

/* ========== Tampilan: ringkasan ========== */
function renderDashboard() {
  const submissions = loadStorage(STORAGE_KEYS.submissions, []);
  const reports = loadStorage(STORAGE_KEYS.reports, []);
  const users = loadStorage(STORAGE_KEYS.users, []);
  const waitingSubmissions = submissions.filter((x) => x.s == STATUS.WAITING_VERIFICATION);
  const waitingReports = reports.filter((x) => x.s == STATUS.WAITING_VALIDATION);

  /* Daftar "Perlu tindakan": [jenis, judul, nama, tanggal] */
  const todo = [
    ...waitingSubmissions.map((x) => [x.u ? 'Layanan (diperbarui)' : 'Layanan', x.n, x.p, x.u || x.d]),
    ...waitingReports.map((x) => ['Pengaduan', (x.x || '').slice(0, 70), x.n, x.d])
  ]
    .sort((a, b) => (b[3] < a[3] ? -1 : 1))
    .slice(0, 6);

  const kpi = (number, label, extraClass = '') => `<div class="card ${extraClass}"><b>${number}</b><span>${label}</span></div>`;
  const unreadChats = totalUnreadFromResidents();

  return `<div class="kpi">${kpi(loadStorage(CONTENT_KEYS.berita, []).length, 'Berita')}${kpi(loadStorage(CONTENT_KEYS.pengumuman, []).length, 'Pengumuman')}${kpi(submissions.length, 'Total pengajuan layanan')}${kpi(reports.length, 'Total pengaduan')}${kpi(users.length, 'Warga terdaftar')}${kpi(waitingSubmissions.length, 'Pengajuan menunggu', waitingSubmissions.length ? 'w2' : '')}${kpi(waitingReports.length, 'Pengaduan menunggu', waitingReports.length ? 'w2' : '')}${kpi(unreadChats, 'Chat warga belum dibaca', unreadChats ? 'w2' : '')}</div><h3>Perlu tindakan</h3><div class="card tb"><table>${todo.map((row) => `<tr><td><span class="stt">${row[0]}</span></td><td>${escapeHtml(row[1])}<br><small>${escapeHtml(row[2])}</small></td><td>${formatDate(row[3])}</td></tr>`).join('') || '<tr><td>Tidak ada yang menunggu. Semua sudah ditangani.</td></tr>'}</table></div>`;
}

/* ========== Tampilan: kelola berita / pengumuman ========== */
function renderContentManager(type) {
  const items = loadStorage(CONTENT_KEYS[type], [])
    .map((item, index) => [item, index])
    .filter(([item]) => item.t.toLowerCase().includes(searchQuery.toLowerCase()));

  const rows = items.map(([item, index]) => {
    const unread = type == 'pengumuman' && item.id ? unreadFromResidents(item.id) : 0;
    const chatButton = type == 'pengumuman' && item.id
      ? `<button class="btn o chb" onclick="openChat('${item.id}')" aria-label="Live chat" title="Live chat warga">${CHAT_ICON}${unread ? `<span class="nb">${unread}</span>` : ''}</button>`
      : '';
    return `<tr><td>${item.img ? `<img class="th" src="${escapeHtml(item.img)}" alt="">` : ''}${escapeHtml(item.t)}${(item.l || []).length ? ` <small>· ${item.l.length} lampiran</small>` : ''}</td><td>${formatDate(item.d)}</td><td class="ac">${chatButton}<button class="btn o" onclick="openContentEditor('${type}',${index})">Edit</button><button class="btn o dg" onclick="removeRecord('${CONTENT_KEYS[type]}',${index})">Hapus</button></td></tr>`;
  }).join('');

  return `<div class="bar">${searchBoxHtml()}<button class="btn" onclick="openContentEditor('${type}',-1)">+ Tambah</button></div><div class="card tb"><table><tr><th>Judul</th><th>${type == 'berita' ? 'Tanggal' : 'Berlaku sampai'}</th><th></th></tr>${rows || '<tr><td colspan="3">Belum ada data. Klik Tambah, atau buka website sekali agar data contoh termuat.</td></tr>'}</table></div>`;
}

/* index = -1 untuk data baru */
function openContentEditor(type, index) {
  const item = index < 0 ? { t: '', d: todayISO(), x: '' } : loadStorage(CONTENT_KEYS[type], [])[index];
  editorState = { img: item.img || '', l: [...(item.l || [])] };
  qs('#modalBody').innerHTML = `<h2 style="margin-top:0">${index < 0 ? 'Tambah' : 'Ubah'} ${type}</h2><label for="contentTitle">Judul</label><input id="contentTitle" value="${escapeHtml(item.t)}"><label for="contentDate">${type == 'berita' ? 'Tanggal terbit' : 'Berlaku sampai'}</label><input id="contentDate" type="date" value="${item.d}"><label for="contentBody">Isi</label><textarea id="contentBody" rows="6">${escapeHtml(item.x)}</textarea>
<label>Foto (otomatis dipotong rasio 16:10 agar pas dengan kartu)</label><div class="upz"><label class="btn s2" for="coverInput">Pilih foto</label><input id="coverInput" type="file" accept="image/*" hidden onchange="pickCoverImage(this)"><button class="btn o" type="button" onclick="clearCoverImage()">Hapus foto</button></div><div id="coverPreview"></div>
<label>Lampiran file / tautan (bisa diklik langsung terbuka)</label><div class="upz"><label class="btn s2" for="attachmentInput">Unggah file</label><input id="attachmentInput" type="file" hidden onchange="pickAttachmentFile(this)"><small>PDF, Word, Excel, gambar. Maks 1 MB per file.</small></div><div class="row" style="margin-top:8px;flex-wrap:wrap"><input id="linkName" placeholder="Nama tombol (mis. Formulir)" style="min-width:150px"><input id="linkUrl" placeholder="https://alamat-tautan" style="min-width:180px"><button class="btn o" type="button" onclick="addAttachmentLink()">Tambah tautan</button></div><div id="attachmentList"></div>
<p class="err" id="editorError"></p><p style="display:flex;gap:10px"><button class="btn" onclick="saveContent('${type}',${index})">Simpan</button><button class="btn o" onclick="closeModal()">Batal</button></p>`;
  qs('#modal').classList.add('on');
  renderEditorAttachments();
  setTimeout(() => qs('#contentTitle').focus(), 50);
}

function saveContent(type, index) {
  const item = {
    t: qs('#contentTitle').value.trim(),
    d: qs('#contentDate').value,
    x: qs('#contentBody').value.trim(),
    img: editorState.img,
    l: editorState.l
  };
  if (!item.t || !item.d || !item.x) return (qs('#editorError').textContent = 'Judul, tanggal, dan isi wajib diisi.');

  const list = loadStorage(CONTENT_KEYS[type], []);
  if (index < 0) {
    item.id = generateId();
    list.unshift(item);
  } else {
    item.id = list[index].id || Date.now().toString(36);
    list[index] = item;
  }
  if (type == 'berita') list.sort((a, b) => (b.d < a.d ? -1 : 1));

  /* Menyimpan memicu event "storage" di tab website, sehingga beranda & halaman terkait langsung ter-update. */
  if (!saveStorage(CONTENT_KEYS[type], list)) return (qs('#editorError').textContent = 'Penyimpanan penuh. Perkecil foto/berkas.');
  closeModal();
  renderAdmin();
  showToast('Tersimpan & langsung terbit');
}

function removeRecord(storageKey, index) {
  if (!confirm('Hapus data ini?')) return;
  const list = loadStorage(storageKey, []);
  list.splice(index, 1);
  saveData(storageKey, list);
  renderAdmin();
  showToast('Dihapus');
}

/* ========== Tampilan: layanan, pengaduan, dan riwayatnya ========== */
function renderRecordTable(kind) {
  const isHistory = kind == 'submissionHistory' || kind == 'reportHistory';
  const storageKey = kind == 'submissionHistory' ? STORAGE_KEYS.submissions : kind == 'reportHistory' ? STORAGE_KEYS.reports : STORAGE_KEYS[kind];
  const isSubmission = storageKey == STORAGE_KEYS.submissions;
  const periodSelect = isHistory
    ? `<select aria-label="Periode" onchange="periodFilter=this.value;renderAdmin()"><option value="all" ${periodFilter == 'all' ? 'selected' : ''}>Rekap keseluruhan</option><option value="30" ${periodFilter == '30' ? 'selected' : ''}>Rekap 1 bulan terakhir</option></select>`
    : '';

  const rows = selectRecords(kind).map(([record, index]) => {
    const fileCount = getFiles(record).length;
    const details = isSubmission
      ? `${escapeHtml(record.n)}${record.u ? ` <span class="stt fix">Diperbarui warga · ${formatDate(record.u)}</span>` : ''}<br><small>${escapeHtml(record.p)}${record.k ? ' · NIK ' + escapeHtml(record.k) : ''}</small>`
      : `${escapeHtml(record.n)}<br><small>${escapeHtml(record.x)}</small>`;
    const whatsapp = whatsappLinkHtml(getPhone(record, storageKey), isSubmission ? WHATSAPP_MESSAGES.service : '');
    const filesCell = fileCount ? `<button class="btn o" onclick="viewFiles('${storageKey}',${index})">Lihat (${fileCount})</button>` : '<small>-</small>';
    const statusCell = isHistory
      ? `<span class="stt">${escapeHtml(record.s)}</span>`
      : `<select aria-label="Status" onchange="setStatus('${storageKey}',${index},this.value)">${STATUS_OPTIONS[storageKey].map((option) => `<option ${option == record.s ? 'selected' : ''}>${option}</option>`).join('')}</select>`;
    const deleteCell = isHistory ? '' : `<td><button class="btn o dg" onclick="removeRecord('${storageKey}',${index})">Hapus</button></td>`;
    return `<tr><td><b>${escapeHtml(record.c)}</b></td><td>${details}</td><td>${whatsapp}</td><td>${filesCell}</td><td>${formatDate(record.d)}</td><td>${statusCell}</td>${deleteCell}</tr>`;
  }).join('');

  const emptyText = isHistory ? 'Belum ada riwayat pada periode ini.' : 'Belum ada data.';
  return `<div class="bar">${searchBoxHtml()}${periodSelect}${downloadButtonsHtml(kind)}</div><div class="card tb"><table><tr><th>Kode</th><th>${isSubmission ? 'Layanan / pemohon' : 'Pelapor / isi aduan'}</th><th>No. WA</th><th>Berkas</th><th>Tanggal</th><th>Status</th>${isHistory ? '' : '<th></th>'}</tr>${rows || `<tr><td colspan="7">${emptyText}</td></tr>`}</table></div>`;
}

function setStatus(storageKey, index, status) {
  const list = loadStorage(storageKey, []);
  list[index].s = status;
  if (storageKey == STORAGE_KEYS.submissions) delete list[index].u;
  saveData(storageKey, list);
  showToast('Status diperbarui');

  /* Pengaduan selesai -> buka WhatsApp pelapor dengan pesan otomatis */
  if (storageKey == STORAGE_KEYS.reports && status == STATUS.DONE) {
    const phone = getPhone(list[index], storageKey);
    if (phone) window.open(whatsappUrl(phone, WHATSAPP_MESSAGES.report), '_blank');
    else showToast('Status selesai, tetapi nomor WA pelapor kosong');
  }
}

/* ========== Tampilan: warga ========== */
function renderUsers() {
  const rows = selectRecords('users').map(([user, index]) =>
    `<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td>${whatsappLinkHtml(user.phone, '')}</td><td>${formatDate(user.at)}</td><td><button class="btn o dg" onclick="removeRecord('${STORAGE_KEYS.users}',${index})">Hapus</button></td></tr>`
  ).join('');
  return `<div class="bar">${searchBoxHtml()}${downloadButtonsHtml('users')}</div><div class="card tb"><table><tr><th>Nama</th><th>Email</th><th>No. HP</th><th>Daftar</th><th></th></tr>${rows || '<tr><td colspan="5">Belum ada warga terdaftar.</td></tr>'}</table></div>`;
}

/* ========== Login & layout utama ========== */
function login() {
  if (qs('#passwordInput').value == ADMIN_PASSWORD) {
    saveStorage(STORAGE_KEYS.adminSession, 1);
    renderAdmin();
  } else {
    qs('#loginError').textContent = 'Kata sandi salah.';
  }
}

function logout() {
  saveStorage(STORAGE_KEYS.adminSession, 0);
  renderAdmin();
}

const TAB_VIEWS = {
  ringkasan: renderDashboard,
  berita: () => renderContentManager('berita'),
  pengumuman: () => renderContentManager('pengumuman'),
  layanan: () => renderRecordTable('submissions'),
  pengaduan: () => renderRecordTable('reports'),
  warga: renderUsers,
  'riwayat-layanan': () => renderRecordTable('submissionHistory'),
  'riwayat-pengaduan': () => renderRecordTable('reportHistory')
};

function renderAdmin() {
  const root = qs('#root');
  if (!loadStorage(STORAGE_KEYS.adminSession, 0)) {
    root.innerHTML = `<div class="card lgn"><h1>Admin Kelurahan Klabala</h1><label for="passwordInput">Kata sandi</label><input id="passwordInput" type="password" onkeydown="if(event.key=='Enter')login()"><p class="err" id="loginError"></p><button class="btn" onclick="login()">Masuk</button></div>`;
    return;
  }

  const tabId = location.hash.slice(2) || 'ringkasan';
  const tab = TABS.find((t) => t.id == tabId) || TABS[0];
  const view = TAB_VIEWS[tab.id] || renderDashboard;
  const unreadChats = totalUnreadFromResidents();

  const menu = TABS.map((item, index) => {
    const groupLabel = item.isHistory && !TABS[index - 1].isHistory ? '<div class="grp">Riwayat</div>' : '';
    const badge = item.id == 'pengumuman' && unreadChats ? `<span class="nb">${unreadChats}</span>` : '';
    return `${groupLabel}<a href="#/${item.id}" class="${item == tab ? 'on' : ''}">${item.label}${badge}</a>`;
  }).join('');

  root.innerHTML = `<div class="admin-layout"><aside><div class="lg">Admin<small>Kelurahan Klabala</small></div>${menu}<button class="btn o" onclick="logout()">Keluar</button></aside><main><h1>${tab.label}</h1>${view()}</main></div>`;

  /* kembalikan fokus ke kolom pencarian setelah render ulang */
  const searchInput = qs('#searchInput');
  if (searchInput && searchQuery) {
    searchInput.focus();
    searchInput.setSelectionRange(searchQuery.length, searchQuery.length);
  }
}

/* ========== Notifikasi lintas-tab (pesan chat, pengajuan baru) ========== */
addEventListener('storage', (event) => {
  if (!loadStorage(STORAGE_KEYS.adminSession, 0) || !event.key) return;
  const modalOpen = qs('#modal').classList.contains('on');

  if (event.key.startsWith(STORAGE_KEYS.chatPrefix)) {
    const announcementId = event.key.slice(STORAGE_KEYS.chatPrefix.length);
    if (activeChatId == announcementId) {
      renderAdminChat();
      return;
    }
    const messages = loadStorage(event.key, []);
    const last = messages[messages.length - 1];
    if (last && !last.a) showToast('Pesan baru dari warga di Pengumuman');
    if (!modalOpen) renderAdmin();
    return;
  }

  if (![STORAGE_KEYS.submissions, STORAGE_KEYS.reports, STORAGE_KEYS.users].includes(event.key)) return;
  try {
    const oldList = JSON.parse(event.oldValue || '[]');
    const newList = JSON.parse(event.newValue || '[]');
    const wasUpdatedByResident = newList.some((r) => r.u && (oldList.find((x) => x.c == r.c) || {}).u != r.u);
    if (event.key == STORAGE_KEYS.submissions && wasUpdatedByResident) showToast('Warga memperbarui pengajuan. Cek menu Layanan.');
    else if (event.key == STORAGE_KEYS.submissions && newList.length > oldList.length) showToast('Ada pengajuan layanan baru');
    else if (event.key == STORAGE_KEYS.reports && newList.length > oldList.length) showToast('Ada pengaduan baru');
  } catch (error) {
    /* data tidak terbaca: lewati notifikasi */
  }
  if (!modalOpen) renderAdmin();
});

addEventListener('hashchange', () => {
  searchQuery = '';
  renderAdmin();
});

renderAdmin();
