import fs from 'fs';
import cp from 'child_process';

let content = fs.readFileSync('frontend-patch/3def3ti6rk0vr.original.js', 'utf8');

// 1. Add state variables to module 34850
const stateTarget = '[Z,G]=(0,n.useState)(R),';
if (!content.includes(stateTarget)) {
  console.error('Could not find stateTarget');
  process.exit(1);
}

const additionalStates = `
[isReadOnlyMode,setIsReadOnlyMode]=(0,n.useState)(!1),
[eContactModal,setContactModal]=(0,n.useState)(!1),
[eBioModal,setBioModal]=(0,n.useState)(!1),
[eBio,setBio]=(0,n.useState)(''),
[eSavingBio,setSavingBio]=(0,n.useState)(!1),

[eExpModal,setExpModal]=(0,n.useState)(!1),
[eEditingExpIndex,setEditingExpIndex]=(0,n.useState)(-1),
[eExpForm,setExpForm]=(0,n.useState)({title:'',company:'',period:'',location:'',description:''}),
[eSavingExp,setSavingExp]=(0,n.useState)(!1),

[eEduModal,setEduModal]=(0,n.useState)(!1),
[eEditingEduIndex,setEditingEduIndex]=(0,n.useState)(-1),
[eEduForm,setEduForm]=(0,n.useState)({school:'',degree:'',field:'',year:'',description:''}),
[eSavingEdu,setSavingEdu]=(0,n.useState)(!1),

[eAddSectionModal,setAddSectionModal]=(0,n.useState)(!1),
[eBannerModal,setBannerModal]=(0,n.useState)(!1),
[eBannerTheme,setBannerTheme]=(0,n.useState)('linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)'),

[eSettingsModal,setSettingsModal]=(0,n.useState)(!1),
[eSettingsTab,setSettingsTab]=(0,n.useState)('keamanan'),

[eNetworkModal,setNetworkModal]=(0,n.useState)(!1),
[eNetworkTab,setNetworkTab]=(0,n.useState)('connected'),
[eNetworkSearch,setNetworkSearch]=(0,n.useState)(''),
[eNetworkSatkerFilter,setNetworkSatkerFilter]=(0,n.useState)('all'),
[eNetworkUsers,setNetworkUsers]=(0,n.useState)([]),
[eNetworkLoading,setNetworkLoading]=(0,n.useState)(!1),
[eProfilePreviewModal,setProfilePreviewModal]=(0,n.useState)(!1),
[ePreviewUser,setPreviewUser]=(0,n.useState)(null),

[eFeedTab,setFeedTab]=(0,n.useState)('mine'),
[ePersonalPosts,setPersonalPosts]=(0,n.useState)([]),
[eLoadingFeed,setLoadingFeed]=(0,n.useState)(!1),
[ePostText,setPostText]=(0,n.useState)(''),
[ePostAudience,setPostAudience]=(0,n.useState)('public'),
[ePostSubmitting,setPostSubmitting]=(0,n.useState)(!1),
[eHoverReactId,setHoverReactId]=(0,n.useState)(null),
[eActiveCommentPostId,setActiveCommentPostId]=(0,n.useState)(null),
[ePostComments,setPostComments]=(0,n.useState)({}),
[eCommentInputs,setCommentInputs]=(0,n.useState)({}),
[eSubmittingComment,setSubmittingComment]=(0,n.useState)(!1),
`;

content = content.replace(stateTarget, stateTarget + additionalStates);

// 2. Patch eT() to support encrypted ?u= token from feed
const oldEt = 'async function eT(){let e=await c.apiAuth.get("/Authentication/user");return y(e.data?.data||null),e.data?.data}';
const newEt = `function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  if (c.startsWith('pers_') || c.startsWith('user_')) c = '';
  var invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
  if (c && /^[a-zA-Z0-9_.]{3,20}$/.test(c) && !invalidPlaceholders.includes(c.toLowerCase())) {
    return '@' + c.toLowerCase();
  }
  var seed = idStr || username || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + code;
}

function formatCount(num) {
  var n = Number(num || 0);
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\\.0$/, '') + 'k';
  return String(n);
}

if (typeof globalThis !== 'undefined') {
  globalThis.formatCallsign = formatCallsign;
  globalThis.formatCount = formatCount;
}

async function eT() {
  var sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  var uToken = sp ? (sp.get('u') || sp.get('uid')) : null;
  var myUser = null;
  try {
    var myRes = await c.apiAuth.get("/Authentication/user");
    myUser = myRes.data?.data || null;
  } catch(e) {}

  if (uToken) {
    var targetId = null;
    try {
      var decoded = atob(uToken);
      var parts = decoded.split(':');
      if (parts[0] === 'cas' && parts[1] === 'pers' && parts[2]) {
        targetId = parts[2];
      }
    } catch(err) {
      if (/^\\d+$/.test(uToken)) targetId = uToken;
    }

    if (targetId && (!myUser?.id || String(myUser.id) !== String(targetId))) {
      setIsReadOnlyMode(!0);
      try {
        var targetRes = await c.apiAuth.get('/bdb/jukrah/network/profile/' + targetId);
        var targetData = targetRes.data?.data || null;
        if (targetData) {
          y(targetData);
          return targetData;
        }
      } catch(err) {}
    }
  }

  setIsReadOnlyMode(!1);
  y(myUser);
  return myUser;
}`;

if (!content.includes(oldEt)) {
  console.error('Could not find oldEt');
  process.exit(1);
}
content = content.replace(oldEt, newEt);

// 3. Add helper functions right before useEffect for profile load
const effectTarget = 'if((0,n.useEffect)(()=>{(async()=>{try{let e=await eT(),t=String(e?.role_bdb||"").toLowerCase();L.includes(t)&&await eD()}finally{E(!1)}})()},[]),N)';
if (!content.includes(effectTarget)) {
  console.error('Could not find effectTarget');
  process.exit(1);
}

const helperFunctions = `
(0,n.useEffect)(() => {
  if (a?.social_media) {
    let soc = a.social_media;
    if (typeof soc.bio === 'string') setBio(soc.bio);
    if (typeof soc.banner_theme === 'string' && soc.banner_theme) setBannerTheme(soc.banner_theme);
  }
}, [a]);

let defaultPersonnel = [
  { id: 101, name: "AKBP Denny S., S.I.K., M.Si.", callsign: "denny_siber", nrp: "82040112", pangkat: "AKBP", jabatan: "Kasubdit III Tindak Pidana Siber", satker: "Bareskrim Polri", role: "Kasubdit", online: true, photo: null, email_polri: "denny.s@polri.go.id", hp: "0812-8888-101", bio: "Spesialis Investigasi Kejahatan Finansial Siber, Malware Analysis, & Incident Response Bareskrim." },
  { id: 102, name: "Kompol Rizky Pratama, S.H., S.I.K.", callsign: "rizky_analis", nrp: "85070234", pangkat: "Kompol", jabatan: "Kanit 1 Subdit Analis Digital", satker: "Dittipidum Bareskrim", role: "Kanit", online: true, photo: null, email_polri: "rizky.pratama@polri.go.id", hp: "0813-7777-202", bio: "Manajemen Data Perkara Tindak Pidana Umum & Analitik Intelijen Investigasi Terpadu CAS." },
  { id: 103, name: "Iptu Sarah Amanda, S.Tr.K.", callsign: "sarah_reskrim", nrp: "92110567", pangkat: "Iptu", jabatan: "Penyidik Pratama Tipideksus", satker: "Dittipideksus Bareskrim", role: "Penyidik", online: true, photo: null, email_polri: "sarah.amanda@polri.go.id", hp: "0821-6666-303", bio: "Penyidikan Tindak Pidana Ekonomi Khusus, Money Laundering, & Aset Tracing." },
  { id: 104, name: "AKP Budi Setiawan, S.Sos.", callsign: "budi_resmob", nrp: "87030890", pangkat: "AKP", jabatan: "Panit 2 Unit Resmob Ditreskrimum", satker: "Polda Metro Jaya", role: "Penyidik", online: false, photo: null, email_polri: "budi.setiawan@polri.go.id", hp: "0811-5555-404", bio: "Operasional Taktis Reserse Mobile, Penindakan Kejahatan Jalanan, & Koordinasi Satker Polda Metro." },
  { id: 105, name: "Brigadir Eko Saputra, S.Kom.", callsign: "eko_sumut", nrp: "94060123", pangkat: "Brigadir", jabatan: "Bintara Operator Big Data Binops", satker: "Ditreskrimsus Polda Sumut", role: "Operator", online: true, photo: null, email_polri: "eko.saputra@polri.go.id", hp: "0852-4444-505", bio: "Pengelolaan Laporan Polisi, Integrasi DORS, dan Distribusi Perkara Ditreskrimsus Polda Sumut." },
  { id: 106, name: "Kompol Hendra Wijaya, S.I.K., M.H.", callsign: "hendra_surabaya", nrp: "84090456", pangkat: "Kompol", jabatan: "Kasat Reskrim Polrestabes", satker: "Polrestabes Surabaya", role: "Kasat", online: false, photo: null, email_polri: "hendra.wijaya@polri.go.id", hp: "0812-3333-606", bio: "Komando dan Pengawasan Penyidikan Tingkat Polres/Polrestabes jajaran Polda Jawa Timur." },
  { id: 107, name: "Iptu Diana Lestari, S.Psi.", callsign: "diana_intel", nrp: "91020789", pangkat: "Iptu", jabatan: "Analis Profiling Reskrim", satker: "Bareskrim Polri", role: "Analis", online: true, photo: null, email_polri: "diana.lestari@polri.go.id", hp: "0813-2222-707", bio: "Profiling Pelaku Kejahatan, Behavioral Analysis, dan Intelijen Kriminal Terintegrasi." },
  { id: 108, name: "Ipda Fajar Nugraha, S.Kom.", callsign: "fajar_forensik", nrp: "96080345", pangkat: "Ipda", jabatan: "Pemeriksa Forensik Digital", satker: "Pusiknas Bareskrim", role: "Forensik", online: true, photo: null, email_polri: "fajar.nugraha@polri.go.id", hp: "0878-1111-808", bio: "Pemeriksaan Barang Bukti Elektronik, Ekstraksi Mobile Forensics, dan Standarisasi Lab Siber." }
];

let fetchNetworkDirectory = async (search, satker) => {
  setNetworkLoading(!0);
  try {
    let res = await c.apiAuth.get('/bdb/jukrah/network/users', {
      params: { search: search || '', satker: satker === 'all' ? '' : (satker || '') }
    });
    let list = res.data?.data;
    if (Array.isArray(list) && list.length > 0) {
      setNetworkUsers(list);
    } else {
      setNetworkUsers(defaultPersonnel);
    }
  } catch (err) {
    setNetworkUsers(defaultPersonnel);
  } finally {
    setNetworkLoading(!1);
  }
};

(0,n.useEffect)(() => {
  fetchNetworkDirectory('', 'all');
}, []);

let handleOpenProfilePreview = async (user) => {
  try {
    let res = await c.apiAuth.get('/bdb/jukrah/network/profile/' + user.id);
    let fullUser = res.data?.data || user;
    setPreviewUser(fullUser);
    setProfilePreviewModal(!0);
  } catch {
    setPreviewUser(user);
    setProfilePreviewModal(!0);
  }
};

let persistSocialMedia = async (updates) => {
  if (isReadOnlyMode) return false;
  let currSoc = (a && typeof a.social_media === 'object' && a.social_media !== null) ? a.social_media : {};
  let nextSoc = {
    ...currSoc,
    ...updates,
    urls: (Array.isArray(currSoc.urls) ? currSoc.urls : (Array.isArray(eSocUrls) ? eSocUrls.map(u => typeof u === 'string' ? u.trim() : '').filter(Boolean) : []))
  };
  let polriMail = typeof a?.email_polri === "string" ? a.email_polri.trim() : "";
  let secMail = typeof a?.email === "string" ? a.email.trim() : "";
  let payload = {
    name: a?.name || "",
    email: secMail || polriMail,
    email_polri: polriMail,
    nrp: a?.nrp || "",
    pangkat: a?.pangkat || "",
    jabatan: a?.jabatan || "",
    satuan: a?.satuan || "",
    no_hp: a?.no_hp || "",
    username: a?.username || "",
    is_pns: Boolean(a?.is_pns),
    photo_url: a?.photo_url || a?.foto || "",
    foto: a?.photo_url || a?.foto || "",
    social_media: nextSoc
  };
  try {
    (0, c.assertOk)(await c.apiAuth.patch("/user/me/profile", payload));
    await eT();
    return true;
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal Menyimpan', detail: err.response?.data?.message || 'Gagal menyimpan perubahan profil.' });
    return false;
  }
};

let handleSaveBio = async () => {
  if (isReadOnlyMode) return;
  setSavingBio(!0);
  try {
    let ok = await persistSocialMedia({ bio: eBio.trim() });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Ringkasan Tentang Saya berhasil diperbarui.' });
      setBioModal(!1);
    }
  } finally {
    setSavingBio(!1);
  }
};

let defaultExperiences = [
  {
    id: 1,
    title: a?.jabatan || "Senior Full-Stack Engineer",
    company: "Badan Reserse Kriminal Polri (Bareskrim)",
    period: "2021 - Sekarang",
    location: "Mabes Polri, Jakarta Selatan",
    description: "Arsitektur Big Data Binops Reskrim, platform intelijen investigasi CAS (Community Anak Serse), sistem komando dan koordinasi penyidik se-Indonesia."
  },
  {
    id: 2,
    title: "Penyelidik & Penyidik Siber",
    company: "Direktorat Tindak Pidana Siber Bareskrim Polri",
    period: "2018 - 2021 • 3 thn",
    location: "Mabes Polri, Jakarta",
    description: "Penanganan kasus kejahatan siber lintas yurisdiksi, digital evidence handling, digital profiling, dan asistensi teknis penyidikan siber satker daerah."
  }
];

let getActiveExperiences = () => {
  if (Array.isArray(a?.social_media?.experiences)) return a.social_media.experiences;
  return defaultExperiences;
};

let openAddExp = () => {
  if (isReadOnlyMode) return;
  setEditingExpIndex(-1);
  setExpForm({
    title: '',
    company: 'Badan Reserse Kriminal Polri (Bareskrim)',
    period: '',
    location: 'Mabes Polri, Jakarta Selatan',
    description: ''
  });
  setExpModal(!0);
};

let openEditExp = (idx) => {
  if (isReadOnlyMode) return;
  let list = getActiveExperiences();
  let item = list[idx] || { title: '', company: '', period: '', location: '', description: '' };
  setEditingExpIndex(idx);
  setExpForm({ ...item });
  setExpModal(!0);
};

let handleSaveExp = async () => {
  if (isReadOnlyMode) return;
  if (!eExpForm.title.trim() || !eExpForm.company.trim()) {
    e.current?.show({ severity: 'warn', summary: 'Lengkapi Data', detail: 'Posisi/Jabatan dan Instansi/Satker wajib diisi.' });
    return;
  }
  setSavingExp(!0);
  try {
    let list = [...getActiveExperiences()];
    if (eEditingExpIndex >= 0) {
      list[eEditingExpIndex] = { ...eExpForm };
    } else {
      list.unshift({ ...eExpForm, id: Date.now() });
    }
    let ok = await persistSocialMedia({ experiences: list });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Riwayat pengalaman berhasil diperbarui.' });
      setExpModal(!1);
    }
  } finally {
    setSavingExp(!1);
  }
};

let handleDeleteExp = async () => {
  if (isReadOnlyMode || eEditingExpIndex < 0) return;
  if (await (0,d.confirmAction)('Hapus riwayat pengalaman ini?', { danger: !0, acceptLabel: 'Hapus' })) {
    setSavingExp(!0);
    try {
      let list = getActiveExperiences().filter((_, i) => i !== eEditingExpIndex);
      let ok = await persistSocialMedia({ experiences: list });
      if (ok) {
        e.current?.show({ severity: 'success', summary: 'Dihapus', detail: 'Riwayat pengalaman telah dihapus.' });
        setExpModal(!1);
      }
    } finally {
      setSavingExp(!1);
    }
  }
};

let defaultEducation = [
  {
    id: 1,
    school: "Universitas Nusa Mandiri",
    degree: "Sarjana Komputer (S.Kom.)",
    field: "Teknik Informatika",
    year: "2016 - 2020",
    description: "Rekayasa Perangkat Lunak, Jaringan Terdistribusi & Keamanan Siber"
  },
  {
    id: 2,
    school: "Pusdik Reskrim Lemdiklat Polri - Megamendung",
    degree: "Pendidikan Kejuruan Spesialisasi (Dikjur)",
    field: "Penyidikan Siber & Manajemen Reserse",
    year: "2021",
    description: "Penyidikan Tindak Pidana Siber & Manajemen Penyidikan Reserse Terintegrasi"
  }
];

let getActiveEducation = () => {
  if (Array.isArray(a?.social_media?.education)) return a.social_media.education;
  return defaultEducation;
};

let openAddEdu = () => {
  if (isReadOnlyMode) return;
  setEditingEduIndex(-1);
  setEduForm({
    school: '',
    degree: '',
    field: '',
    year: '',
    description: ''
  });
  setEduModal(!0);
};

let openEditEdu = (idx) => {
  if (isReadOnlyMode) return;
  let list = getActiveEducation();
  let item = list[idx] || { school: '', degree: '', field: '', year: '', description: '' };
  setEditingEduIndex(idx);
  setEduForm({ ...item });
  setEduModal(!0);
};

let handleSaveEdu = async () => {
  if (isReadOnlyMode) return;
  if (!eEduForm.school.trim()) {
    e.current?.show({ severity: 'warn', summary: 'Lengkapi Data', detail: 'Nama Institusi/Universitas/Pusdik wajib diisi.' });
    return;
  }
  setSavingEdu(!0);
  try {
    let list = [...getActiveEducation()];
    if (eEditingEduIndex >= 0) {
      list[eEditingEduIndex] = { ...eEduForm };
    } else {
      list.unshift({ ...eEduForm, id: Date.now() });
    }
    let ok = await persistSocialMedia({ education: list });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Riwayat pendidikan berhasil diperbarui.' });
      setEduModal(!1);
    }
  } finally {
    setSavingEdu(!1);
  }
};

let handleDeleteEdu = async () => {
  if (isReadOnlyMode || eEditingEduIndex < 0) return;
  if (await (0,d.confirmAction)('Hapus riwayat pendidikan ini?', { danger: !0, acceptLabel: 'Hapus' })) {
    setSavingEdu(!0);
    try {
      let list = getActiveEducation().filter((_, i) => i !== eEditingEduIndex);
      let ok = await persistSocialMedia({ education: list });
      if (ok) {
        e.current?.show({ severity: 'success', summary: 'Dihapus', detail: 'Riwayat pendidikan telah dihapus.' });
        setEduModal(!1);
      }
    } finally {
      setSavingEdu(!1);
    }
  }
};

let handleSaveBanner = async () => {
  if (isReadOnlyMode) return;
  let ok = await persistSocialMedia({ banner_theme: eBannerTheme });
  if (ok) {
    e.current?.show({ severity: 'success', summary: 'Sampul Diterapkan', detail: 'Tema foto sampul taktis berhasil diperbarui.' });
    setBannerModal(!1);
  }
};

let openEditIntro = () => {
  if (isReadOnlyMode) {
    e.current?.show({ severity: 'warn', summary: 'Akses Dibatasi', detail: 'Mode Terenkripsi Kedinasan (Read-Only). Anda tidak dapat mengubah data personil lain.' });
    return;
  }
  let initialUrls = [];
  if (a?.social_media) {
    if (Array.isArray(a.social_media.urls)) initialUrls = a.social_media.urls;
    else if (Array.isArray(a.social_media)) initialUrls = a.social_media;
    else Object.values(a.social_media).forEach(v => {
      if ("string" == typeof v && v.trim()) initialUrls.push(v.trim());
    });
  }
  if (!initialUrls.length) initialUrls = [""];
  let polriMail = typeof a?.email_polri === "string" ? a.email_polri.trim() : "";
  let secMail = typeof a?.email === "string" ? a.email.trim() : "";
  if (!polriMail && secMail.toLowerCase().endsWith("@polri.go.id")) {
    polriMail = secMail;
    secMail = "";
  }
  G({
    name: a?.name || "",
    email: secMail,
    nrp: K(a?.nrp) || "",
    pangkat: K(a?.pangkat) || "",
    jabatan: K(a?.jabatan) || "",
    satuan: K(a?.satuan) || "",
    no_hp: K(a?.no_hp) || "",
    email_polri: polriMail,
    username: a?.username || "",
    is_pns: Boolean(a?.is_pns),
    social_media: a?.social_media || {},
    photo_url: a?.photo_url || a?.foto || ""
  });
  X.resetAll();
  q(!0);
};

let fetchPersonalFeed = (0,n.useCallback)(async (tab) => {
  setLoadingFeed(!0);
  try {
    let params = { filter: tab || eFeedTab };
    if (isReadOnlyMode && a?.id) {
      params.author_id = a.id;
    }
    let res = await c.apiAuth.get('/bdb/jukrah/feed', { params });
    let raw = res.data?.data || [];
    let mapped = raw.map(p => ({
      ...p,
      author_callsign: p.author_callsign || p.author_username || (p.raw_author_name ? p.raw_author_name.toLowerCase().replace(/\\s+/g, '_') : (a?.username || 'anak_serse')),
      author_handle: p.author_handle || ('@' + (p.author_callsign || a?.username || 'anak_serse')),
      satker_name: p.satker_name || p.author_satker || K(a?.scope_satker_name) || 'Bareskrim'
    }));
    setPersonalPosts(mapped);
  } catch (err) {
    setPersonalPosts(prev => prev.length ? prev : []);
  } finally {
    setLoadingFeed(!1);
  }
}, [eFeedTab, a, isReadOnlyMode]);

(0,n.useEffect)(() => {
  fetchPersonalFeed(eFeedTab);
}, [eFeedTab, isReadOnlyMode, a?.id]);

let handleCreatePersonalPost = async () => {
  if (isReadOnlyMode) return;
  if (!ePostText.trim()) return;
  if (ePostText.length > 3000) {
    e.current?.show({ severity: 'warn', summary: 'Karakter Melebihi Batas', detail: 'Teks postingan maksimal 3.000 karakter.' });
    return;
  }
  setPostSubmitting(!0);
  let contentToSend = ePostText.trim();
  let audienceToSend = ePostAudience;
  try {
    let fd = new FormData();
    fd.append('content', contentToSend);
    fd.append('audience_type', audienceToSend);
    let res = await c.apiAuth.post('/bdb/jukrah/post', fd, { headers: { 'Content-Type': void 0 } });
    
    // Optimistic instant prepend
    let newPost = {
      id: res.data?.data?.id || ('temp_' + Date.now()),
      content: contentToSend,
      audience_type: audienceToSend,
      author_id: a?.id || 1,
      author_name: a?.name || (a?.username || 'omeko11'),
      author_callsign: a?.username || a?.nrp || 'omeko11',
      author_handle: '@' + (a?.username || a?.nrp || 'omeko11'),
      author_satker: K(a?.scope_satker_name) || K(a?.satuan) || 'Bareskrim Polri',
      satker_name: K(a?.scope_satker_name) || K(a?.satuan) || 'Bareskrim Polri',
      created_at: new Date().toISOString(),
      total_reactions: 0,
      user_reaction: null,
      comments_count: 0,
      view_count: 1
    };
    setPersonalPosts(prev => [newPost, ...prev]);
    setPostText('');
    e.current?.show({ severity: 'success', summary: 'Dipublikasikan', detail: 'Catatan taktis berhasil dipublikasikan ke linimasa.' });
    setTimeout(() => { fetchPersonalFeed(eFeedTab); }, 800);
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal membagikan postingan.' });
  } finally {
    setPostSubmitting(!1);
  }
};

let handlePersonalReact = async (pId, rType) => {
  setHoverReactId(null);
  try {
    let res = await c.apiAuth.post('/bdb/jukrah/post/' + pId + '/reaction', { reaction_type: rType });
    let up = res.data?.data;
    setPersonalPosts(prev => prev.map(p => p.id === pId ? { ...p, user_reaction: up?.user_reaction, total_reactions: up?.total_reactions } : p));
  } catch {}
};

let handlePersonalDelete = async (pId) => {
  if (isReadOnlyMode) return;
  if (await (0,d.confirmAction)('Hapus postingan ini?', { danger: !0, acceptLabel: 'Hapus' })) {
    try {
      await c.apiAuth.post('/bdb/jukrah/post/' + pId + '/delete', {});
      e.current?.show({ severity: 'success', summary: 'Dihapus', detail: 'Postingan telah dihapus.' });
      setPersonalPosts(prev => prev.filter(p => p.id !== pId));
    } catch (err) {
      e.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal menghapus postingan.' });
    }
  }
};

let handleTogglePostVis = async (p) => {
  if (isReadOnlyMode) return;
  let nextAud = p.audience_type === 'public' ? 'followers' : (p.audience_type === 'followers' ? 'private' : 'public');
  let labelAud = nextAud === 'public' ? 'Publik' : (nextAud === 'followers' ? 'Pengikut / Satker' : 'Privat');
  try {
    await c.apiAuth.post('/bdb/jukrah/post/' + p.id + '/visibility', { audience_type: nextAud });
    e.current?.show({ severity: 'success', summary: 'Diperbarui', detail: 'Visibilitas diubah ke ' + labelAud });
    setPersonalPosts(prev => prev.map(item => item.id === p.id ? { ...item, audience_type: nextAud } : item));
  } catch {}
};

let togglePostComments = async (pId) => {
  if (eActiveCommentPostId === pId) {
    setActiveCommentPostId(null);
    return;
  }
  setActiveCommentPostId(pId);
  try {
    let res = await c.apiAuth.get('/bdb/jukrah/post/' + pId + '/comments');
    setPostComments(prev => ({ ...prev, [pId]: res.data?.data || [] }));
  } catch {}
};

let handleAddPersonalComment = async (pId) => {
  let txt = (eCommentInputs[pId] || '').trim();
  if (!txt) return;
  if (txt.length > 1000) {
    e.current?.show({ severity: 'warn', summary: 'Karakter Melebihi Batas', detail: 'Komentar maksimal 1.000 karakter.' });
    return;
  }
  setSubmittingComment(!0);
  try {
    let res = await c.apiAuth.post('/bdb/jukrah/post/' + pId + '/comment', { content: txt });
    setPostComments(prev => ({ ...prev, [pId]: [...(prev[pId] || []), res.data?.data] }));
    setCommentInputs(prev => ({ ...prev, [pId]: '' }));
    setPersonalPosts(prev => prev.map(p => p.id === pId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));
  } catch {} finally {
    setSubmittingComment(!1);
  }
};
`;

content = content.replace(effectTarget, helperFunctions + effectTarget);

// 4. Locate heroStart and cardsEnd
const heroStartStr = '(0,t.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden",marginBottom:"1.25rem"}';
const cardsEndStr = '(0,t.jsx)(r.Dialog,{header:"Edit Profil"';

const heroStart = content.indexOf(heroStartStr);
const cardsEnd = content.indexOf(cardsEndStr);

if (heroStart === -1 || cardsEnd === -1) {
  console.error('Could not find heroStart or cardsEnd');
  process.exit(1);
}

// 5. Build Complete Tactical LinkedIn Profile JSX
const completeProfileJSX = `
// 1. Top Read-Only Tactical Alert Banner
isReadOnlyMode && (0,t.jsxs)("div",{
  style:{
    background:"linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(15,23,42,0.6) 100%)",
    border:"1px solid rgba(56,189,248,0.3)",
    borderRadius:"12px",
    padding:"0.85rem 1.25rem",
    marginBottom:"1.25rem",
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    flexWrap:"wrap",
    gap:"0.75rem"
  },
  children:[
    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[
      (0,t.jsx)("span",{style:{fontSize:"1.4rem"},children:"🛡️"}),
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.9rem",color:"#f8fafc"},children:"Profil Personil CAS (Mode Kedinasan - Terenkripsi)"}),
        (0,t.jsx)("div",{style:{fontSize:"0.75rem",color:"#94a3b8"},children:"Data identitas dan riwayat penugasan resmi Mabes Bareskrim Polri • Akses Terbatas (Read-Only)"})
      ]})
    ]}),
    (0,t.jsx)("button",{
      type:"button",
      onClick:() => { window.location.href = '/cms/profile'; },
      style:{background:"#2563eb",color:"#fff",border:"none",padding:"0.4rem 0.95rem",borderRadius:"8px",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",boxShadow:"0 2px 6px rgba(37,99,235,0.3)"},
      children:"⬅️ Kembali ke Profil Saya"
    })
  ]
}),

// 2. Contact Modal
(0,t.jsx)(r.Dialog,{
  header:"Info Kontak & Identitas Kedinasan",
  visible:eContactModal,
  onHide:()=>setContactModal(!1),
  style:{width:"30rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
    (0,t.jsxs)("div",{style:{background:"rgba(0,0,0,0.25)",padding:"0.85rem",borderRadius:"10px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
      (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,letterSpacing:"0.05em"},children:"CALLSIGN CAS"}),
      (0,t.jsxs)("div",{style:{fontSize:"1rem",fontWeight:800,color:"#38bdf8",marginTop:"0.2rem"},children:[formatCallsign(a?.callsign, a?.id, a?.username)]})
    ]}),
    (0,t.jsxs)("div",{style:{background:"rgba(0,0,0,0.25)",padding:"0.85rem",borderRadius:"10px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
      (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,letterSpacing:"0.05em"},children:"EMAIL DINAS POLRI"}),
      (0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"#f8fafc",marginTop:"0.2rem",fontWeight:600},children:a?.email_polri||(typeof a?.email === "string" && a.email.endsWith("@polri.go.id") ? a.email : "Belum diatur")})
    ]}),
    (0,t.jsxs)("div",{style:{background:"rgba(0,0,0,0.25)",padding:"0.85rem",borderRadius:"10px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
      (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,letterSpacing:"0.05em"},children:"NOMOR TELEPON / WHATSAPP"}),
      (0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"#f8fafc",marginTop:"0.2rem",fontWeight:600},children:a?.no_hp||"Belum diatur"})
    ]}),
    (0,t.jsxs)("div",{style:{background:"rgba(0,0,0,0.25)",padding:"0.85rem",borderRadius:"10px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
      (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,letterSpacing:"0.05em"},children:"SATUAN KERJA (SATKER)"}),
      (0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"#f8fafc",marginTop:"0.2rem",fontWeight:600},children:K(a?.scope_satker_name)||K(a?.scope_access_display)||"Badan Reserse Kriminal Polri (Bareskrim)"})
    ]}),
    !isReadOnlyMode && (0,t.jsx)("button",{
      type:"button",
      onClick:()=>{setContactModal(!1);openEditIntro()},
      style:{marginTop:"0.5rem",padding:"0.6rem",borderRadius:"8px",background:"#2563eb",color:"#fff",border:"none",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"0.4rem"},
      children:"✏️ Edit Data Kontak"
    })
  ]})
}),

// 3. Bio / Tentang Saya Modal
(0,t.jsx)(r.Dialog,{
  header:"Edit Tentang Saya",
  visible:Boolean(eBioModal && !isReadOnlyMode),
  onHide:()=>setBioModal(!1),
  style:{width:"36rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[
    (0,t.jsx)("button",{
      type:"button",
      onClick:()=>setBioModal(!1),
      style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"Batal"
    }),
    (0,t.jsx)("button",{
      type:"button",
      onClick:handleSaveBio,
      disabled:eSavingBio,
      style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.82rem",fontWeight:700,cursor:eSavingBio?"not-allowed":"pointer"},
      children:eSavingBio?"Menyimpan...":"Simpan Ringkasan"
    })
  ]}),
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.75rem",padding:"0.5rem 0"},children:[
    (0,t.jsx)("p",{style:{fontSize:"0.82rem",color:"#94a3b8",margin:0},children:"Tuliskan ringkasan pengalaman profesional, spesialisasi keahlian siber/reserse, atau dedikasi tugas Anda di Bareskrim Polri."}),
    (0,t.jsx)("textarea",{
      value:eBio,
      onChange:ev=>setBio(ev.target.value),
      rows:6,
      maxLength:3000,
      placeholder:"Tuliskan ringkasan profil Anda di sini...",
      style:{width:"100%",fontSize:"0.88rem",lineHeight:1.55,padding:"0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(0,0,0,0.25)",color:"#fff",resize:"vertical",fontFamily:"inherit"}
    }),
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",fontSize:"0.74rem",color:eBio.length>=2800?'#ef4444':'#94a3b8'},children:[
      eBio.length," / 3.000 karakter"
    ]})
  ]})
}),

// 4. Experience Modal
(0,t.jsx)(r.Dialog,{
  header:eEditingExpIndex>=0?"Edit Riwayat Pengalaman":"Tambah Riwayat Pengalaman Baru",
  visible:Boolean(eExpModal && !isReadOnlyMode),
  onHide:()=>setExpModal(!1),
  style:{width:"36rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
    eEditingExpIndex>=0?(0,t.jsx)("button",{
      type:"button",
      onClick:handleDeleteExp,
      disabled:eSavingExp,
      style:{background:"transparent",color:"#ef4444",border:"1px solid rgba(239,68,68,0.4)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"🗑️ Hapus"
    }):(0,t.jsx)("div",{}),
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>setExpModal(!1),
        style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
        children:"Batal"
      }),
      (0,t.jsx)("button",{
        type:"button",
        onClick:handleSaveExp,
        disabled:eSavingExp,
        style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.82rem",fontWeight:700,cursor:eSavingExp?"not-allowed":"pointer"},
        children:eSavingExp?"Menyimpan...":"Simpan Pengalaman"
      })
    ]})
  ]}),
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem",padding:"0.5rem 0"},children:[
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Posisi / Jabatan *"}),
      (0,t.jsx)(i.InputText,{value:eExpForm.title,onChange:ev=>setExpForm({...eExpForm,title:ev.target.value}),placeholder:"Contoh: Penyelidik Siber / Kanit Reskrim / Software Engineer",style:{width:"100%",fontSize:"0.85rem"}}),
    ]}),
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Instansi / Satuan Kerja (Satker) *"}),
      (0,t.jsx)(i.InputText,{value:eExpForm.company,onChange:ev=>setExpForm({...eExpForm,company:ev.target.value}),placeholder:"Contoh: Bareskrim Polri / Ditreskrimsus Polda Metro Jaya",style:{width:"100%",fontSize:"0.85rem"}}),
    ]}),
    (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Periode Waktu"}),
        (0,t.jsx)(i.InputText,{value:eExpForm.period,onChange:ev=>setExpForm({...eExpForm,period:ev.target.value}),placeholder:"Contoh: 2021 - Sekarang",style:{width:"100%",fontSize:"0.85rem"}}),
      ]}),
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Lokasi Penugasan"}),
        (0,t.jsx)(i.InputText,{value:eExpForm.location,onChange:ev=>setExpForm({...eExpForm,location:ev.target.value}),placeholder:"Contoh: Mabes Polri, Jakarta Selatan",style:{width:"100%",fontSize:"0.85rem"}}),
      ]})
    ]}),
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Deskripsi Penugasan / Peran Taktis"}),
      (0,t.jsx)("textarea",{value:eExpForm.description,onChange:ev=>setExpForm({...eExpForm,description:ev.target.value}),rows:3,placeholder:"Uraikan peran utama, inovasi sistem, atau pencapaian penanganan perkara selama bertugas...",style:{width:"100%",fontSize:"0.85rem",padding:"0.6rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(0,0,0,0.25)",color:"#fff",resize:"vertical",fontFamily:"inherit"}}),
    ]})
  ]})
}),

// 5. Education Modal
(0,t.jsx)(r.Dialog,{
  header:eEditingEduIndex>=0?"Edit Riwayat Pendidikan":"Tambah Riwayat Pendidikan Baru",
  visible:Boolean(eEduModal && !isReadOnlyMode),
  onHide:()=>setEduModal(!1),
  style:{width:"36rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
    eEditingEduIndex>=0?(0,t.jsx)("button",{
      type:"button",
      onClick:handleDeleteEdu,
      disabled:eSavingEdu,
      style:{background:"transparent",color:"#ef4444",border:"1px solid rgba(239,68,68,0.4)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"🗑️ Hapus"
    }):(0,t.jsx)("div",{}),
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>setEduModal(!1),
        style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
        children:"Batal"
      }),
      (0,t.jsx)("button",{
        type:"button",
        onClick:handleSaveEdu,
        disabled:eSavingEdu,
        style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.82rem",fontWeight:700,cursor:eSavingEdu?"not-allowed":"pointer"},
        children:eSavingEdu?"Menyimpan...":"Simpan Pendidikan"
      })
    ]})
  ]}),
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem",padding:"0.5rem 0"},children:[
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Institusi / Universitas / Pusdik *"}),
      (0,t.jsx)(i.InputText,{value:eEduForm.school,onChange:ev=>setEduForm({...eEduForm,school:ev.target.value}),placeholder:"Contoh: Universitas Nusa Mandiri / Pusdik Reskrim Lemdiklat Polri / Akpol",style:{width:"100%",fontSize:"0.85rem"}}),
    ]}),
    (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Gelar / Jenjang / Kejuruan"}),
        (0,t.jsx)(i.InputText,{value:eEduForm.degree,onChange:ev=>setEduForm({...eEduForm,degree:ev.target.value}),placeholder:"Contoh: Sarjana Komputer (S.Kom.) / Dikjur Spesialisasi",style:{width:"100%",fontSize:"0.85rem"}}),
      ]}),
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Bidang Studi / Fokus Keahlian"}),
        (0,t.jsx)(i.InputText,{value:eEduForm.field,onChange:ev=>setEduForm({...eEduForm,field:ev.target.value}),placeholder:"Contoh: Teknik Informatika / Siber",style:{width:"100%",fontSize:"0.85rem"}}),
      ]})
    ]}),
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Tahun / Periode Kelulusan"}),
      (0,t.jsx)(i.InputText,{value:eEduForm.year,onChange:ev=>setEduForm({...eEduForm,year:ev.target.value}),placeholder:"Contoh: 2016 - 2020",style:{width:"100%",fontSize:"0.85rem"}}),
    ]}),
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Keterangan Tambahan / Prestasi"}),
      (0,t.jsx)(i.InputText,{value:eEduForm.description,onChange:ev=>setEduForm({...eEduForm,description:ev.target.value}),placeholder:"Rekayasa Perangkat Lunak, Jaringan Terdistribusi & Keamanan Siber",style:{width:"100%",fontSize:"0.85rem"}}),
    ]})
  ]})
}),

// 6. Banner Theme Modal
(0,t.jsx)(r.Dialog,{
  header:"Kustomisasi Banner Sampul Taktis",
  visible:Boolean(eBannerModal && !isReadOnlyMode),
  onHide:()=>setBannerModal(!1),
  style:{width:"32rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[
    (0,t.jsx)("button",{
      type:"button",
      onClick:()=>setBannerModal(!1),
      style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"Batal"
    }),
    (0,t.jsx)("button",{
      type:"button",
      onClick:handleSaveBanner,
      style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"Terapkan Sampul"
    })
  ]}),
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem",padding:"0.5rem 0"},children:[
    (0,t.jsx)("label",{style:{fontSize:"0.8rem",color:"#cbd5e1",fontWeight:700},children:"Pilih Tema Taktis CAS:"}),
    (0,t.jsx)("div",{
      style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},
      children:[
        { id: "cyber_blue", name: "Cyber Ops Blue", grad: "linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)" },
        { id: "stealth_dark", name: "Stealth Reskrim", grad: "linear-gradient(135deg, #020617 0%, #0f172a 60%, #1e1b4b 100%)" },
        { id: "emerald_shield", name: "Tactical Emerald", grad: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)" },
        { id: "gold_command", name: "Gold Command", grad: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #78350f 100%)" }
      ].map(thm => (0,t.jsx)("button",{
        key:thm.id,
        type:"button",
        onClick:()=>setBannerTheme(thm.grad),
        style:{
          height:"55px",
          borderRadius:"8px",
          background:thm.grad,
          border:eBannerTheme===thm.grad?"2px solid #38bdf8":"1px solid rgba(255,255,255,0.15)",
          color:"#fff",
          fontSize:"0.78rem",
          fontWeight:700,
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          boxShadow:eBannerTheme===thm.grad?"0 0 10px rgba(56,189,248,0.5)":"none"
        },
        children:thm.name
      }))
    })
  ]})
}),

// 7. Add Section Modal
(0,t.jsx)(r.Dialog,{
  header:"Tambahkan Bagian ke Profil",
  visible:Boolean(eAddSectionModal && !isReadOnlyMode),
  onHide:()=>setAddSectionModal(!1),
  style:{width:"32rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.65rem",padding:"0.5rem 0"},children:[
    {
      icon:"📖",
      title:"Tentang Saya (Ringkasan)",
      desc:"Tambahkan bio atau deskripsi tentang pengalaman dan bidang keahlian Anda",
      action:()=>{setAddSectionModal(!1);setBioModal(!0);}
    },
    {
      icon:"💼",
      title:"Riwayat Pengalaman",
      desc:"Tambahkan posisi kedinasan, jabatan struktural, atau riwayat penugasan",
      action:()=>{setAddSectionModal(!1);openAddExp();}
    },
    {
      icon:"🎓",
      title:"Riwayat Pendidikan",
      desc:"Tambahkan universitas, sekolah kedinasan, atau pendidikan kejuruan Polri",
      action:()=>{setAddSectionModal(!1);openAddEdu();}
    },
    {
      icon:"🔗",
      title:"Tautan & Media Sosial",
      desc:"Hubungkan profil dengan akun media sosial atau portofolio digital",
      action:()=>{setAddSectionModal(!1);openEditIntro();}
    },
    {
      icon:"🛡️",
      title:"Pengaturan Keamanan Mandiri (2FA)",
      desc:"Konfigurasi kata sandi, Google Authenticator (TOTP), dan PIN otorisasi",
      action:()=>{
        setAddSectionModal(!1);
        setSettingsTab('keamanan');
        setSettingsModal(!0);
      }
    }
  ].map((sec,idx)=>(0,t.jsxs)("button",{
    key:idx,
    type:"button",
    onClick:sec.action,
    style:{
      display:"flex",
      alignItems:"center",
      gap:"0.85rem",
      padding:"0.85rem 1rem",
      borderRadius:"10px",
      border:"1px solid var(--cas-border, rgba(255,255,255,0.08))",
      background:"rgba(255,255,255,0.03)",
      textAlign:"left",
      cursor:"pointer",
      color:"inherit"
    },
    children:[
      (0,t.jsx)("span",{style:{fontSize:"1.5rem"},children:sec.icon}),
      (0,t.jsxs)("div",{style:{flex:1},children:[
        (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.88rem",color:"#f8fafc"},children:sec.title}),
        (0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"#94a3b8",marginTop:"0.15rem"},children:sec.desc})
      ]}),
      (0,t.jsx)("span",{style:{fontSize:"1.1rem",color:"#38bdf8"},children:"➕"})
    ]
  }))})
}),

// 8. PENGATURAN PROFIL & KEAMANAN MODAL (FULL 2FA & TOTP ENGINE)
(0,t.jsx)(r.Dialog,{
  header:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
    (0,t.jsx)("span",{style:{fontSize:"1.2rem"},children:"⚙️"}),
    (0,t.jsx)("span",{style:{fontWeight:800},children:"Pengaturan Profil & Keamanan Kedinasan"})
  ]}),
  visible:Boolean(eSettingsModal && !isReadOnlyMode),
  onHide:()=>setSettingsModal(!1),
  style:{width:"48rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"1.1rem",padding:"0.35rem 0"},children:[
    // Modal Navigation Tabs
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",background:"rgba(0,0,0,0.25)",padding:"0.3rem",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.08)"},children:[
      (0,t.jsxs)("button",{
        type:"button",
        onClick:()=>setSettingsTab('keamanan'),
        style:{
          flex:1,
          padding:"0.6rem 1rem",
          borderRadius:"8px",
          border:"none",
          background:eSettingsTab==='keamanan'?'#2563eb':'transparent',
          color:eSettingsTab==='keamanan'?'#fff':'#94a3b8',
          fontWeight:800,
          fontSize:"0.85rem",
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          gap:"0.4rem"
        },
        children:[
          (0,t.jsx)("span",{children:"🛡️"}),
          (0,t.jsx)("span",{children:"Keamanan Mandiri & Autentikasi (2FA)"})
        ]
      }),
      (0,t.jsxs)("button",{
        type:"button",
        onClick:()=>setSettingsTab('satker'),
        style:{
          flex:1,
          padding:"0.6rem 1rem",
          borderRadius:"8px",
          border:"none",
          background:eSettingsTab==='satker'?'#2563eb':'transparent',
          color:eSettingsTab==='satker'?'#fff':'#94a3b8',
          fontWeight:800,
          fontSize:"0.85rem",
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          gap:"0.4rem"
        },
        children:[
          (0,t.jsx)("span",{children:"🏢"}),
          (0,t.jsx)("span",{children:"Profil Satker & Wilayah Penugasan"})
        ]
      })
    ]}),

    // TAB 1: KEAMANAN MANDIRI & 2FA
    eSettingsTab === 'keamanan' && (0,t.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.02)",padding:"0.75rem 1rem",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.06)"},children:[
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.9rem",color:"#fff"},children:"Tingkat Proteksi Akun"}),
          (0,t.jsx)("div",{style:{fontSize:"0.75rem",color:"#94a3b8",marginTop:"0.1rem"},children:"Status kepatuhan autentikasi multi-faktor (MFA) standar Mabes Polri"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",background:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"rgba(34,197,94,0.15)":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"rgba(56,189,248,0.15)":"rgba(245,158,11,0.15)",border:"1px solid "+(([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"rgba(34,197,94,0.4)":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"rgba(56,189,248,0.4)":"rgba(245,158,11,0.4)"),padding:"0.25rem 0.75rem",borderRadius:"999px"},children:[
          (0,t.jsx)("span",{style:{display:"inline-block",width:7,height:7,borderRadius:"999px",background:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#22c55e":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"#38bdf8":"#f59e0b"}}),
          (0,t.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:800,color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#4ade80":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"#38bdf8":"#fbbf24"},children:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"Sangat Kuat (2FA Aktif)":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"Kuat (1 Metode)":"Standar"})
        ]})
      ]}),
      // Password
      (0,t.jsx)(V,{id:"fld-cfg-pwd",name:"field_cfg_pwd",icon:(0,t.jsx)(w.KeyRound,{size:15}),label:"Password Akun",hint:"Kredensial login mandiri Anda",active:!!a?.local_password_enabled,action:(0,t.jsx)("a",{href:"/cms/profile/reset-password",style:{fontSize:"0.76rem",fontWeight:700,color:"#38bdf8",padding:"0.35rem 0.75rem",textDecoration:"none",borderRadius:"6px",border:"1px solid rgba(56,189,248,0.35)",background:"rgba(56,189,248,0.08)"},children:"Ubah Password"})}),
      // 2FA Subheader
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginTop:"0.6rem",paddingBottom:"0.35rem",borderBottom:"1px solid rgba(255,255,255,0.08)"},children:[
        (0,t.jsx)(O.ShieldCheck,{size:14,style:{color:"#38bdf8"}}),
        (0,t.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:800,color:"#e2e8f0",letterSpacing:"0.5px",textTransform:"uppercase"},children:"Otentikasi Dua Langkah (2FA)"}),
        (0,t.jsx)("span",{style:{fontSize:"0.68rem",color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#f59e0b":"#94a3b8",marginLeft:"auto"},children:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"Maksimal 2 metode aktif":"Pilih maksimal 2 metode aktif"})
      ]}),
      // OTP Email
      (0,t.jsx)(V,{id:"fld-cfg-email-otp",name:"field_cfg_email_otp",icon:(0,t.jsx)(x.Mail,{size:15}),label:"OTP Email Kedinasan",hint:a?.email_otp_required?"Aktif sebagai metode verifikasi saat login":"Verifikasi kode OTP 6-digit ke email dinas Polri saat login",active:!!a?.email_otp_required,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[renderSwitch(!!a?.email_otp_required,()=>a?.email_otp_required?promptDisable("email_otp"):openSecurityModal("enable_email_otp"),ey,!a?.email_otp_required&&([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a?.email_otp_required?(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("email_otp"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>openSecurityModal("enable_email_otp"),disabled:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),
      // PIN Keamanan
      (0,t.jsx)(V,{id:"fld-cfg-pin",name:"field_cfg_pin",icon:(0,t.jsx)(S.Hash,{size:15}),label:"PIN Keamanan",hint:a?.pin_required?"Aktif sebagai lapisan otorisasi tindakan sensitif & login":"PIN 6-8 digit angka untuk otorisasi akses sensitif",active:!!a?.pin_required,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[renderSwitch(!!a?.pin_required,()=>a?.pin_required?promptDisable("pin"):openSecurityModal("enable_pin"),ey,!a?.pin_required&&([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a?.pin_required?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>openSecurityModal("change_pin"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,padding:"0.2rem 0.4rem"},children:"Ubah"}),(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("pin"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"})]}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>openSecurityModal("enable_pin"),disabled:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),
      // Google Authenticator TOTP
      (0,t.jsx)(V,{id:"fld-cfg-totp",name:"field_cfg_totp",icon:(0,t.jsx)(O.ShieldCheck,{size:15}),label:"Google Authenticator (TOTP)",hint:a?.totp_enabled?"Aktif sebagai kode verifikasi login instan dari aplikasi (RFC 6238)":"Kode otentikasi 6-digit dari aplikasi ponsel (Google/MS Authenticator)",active:!!a?.totp_enabled,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[renderSwitch(!!a?.totp_enabled,()=>a?.totp_enabled?promptDisable("totp"):startTotpSetup(),eTotpLoading,!a?.totp_enabled&&([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a?.totp_enabled?(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("totp"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>startTotpSetup(),disabled:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),loading:eTotpLoading,style:{fontSize:"0.72rem",fontWeight:700,color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),
      // Passkey
      (0,t.jsx)(V,{id:"fld-cfg-bio",name:"field_cfg_bio",icon:(0,t.jsx)(w.KeyRound,{size:15}),label:"Biometrik Perangkat (Passkey)",hint:"Login cepat menggunakan sidik jari atau pengenalan wajah perangkat",active:!1,last:!0,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[renderSwitch(!1,void 0,!1,!0,"Siap Didaftarkan"),(0,t.jsx)(o.Button,{text:!0,size:"small",disabled:!0,style:{fontSize:"0.72rem",color:"#94a3b8",padding:"0.2rem 0.4rem"},children:"Siap Didaftarkan"})]})})
    ]}),

    // TAB 2: PROFIL / DATA WILAYAH SATKER
    eSettingsTab === 'satker' && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.95rem",color:"#fff"},children:eb?.deskripsi||K(a?.scope_satker_name)||"Satuan Kerja Mabes Polri"}),
          (0,t.jsxs)("div",{style:{fontSize:"0.76rem",color:"#94a3b8",marginTop:"0.15rem"},children:["Kode Satker: ",(0,t.jsx)("strong",{style:{color:"#38bdf8"},children:eb?.kode||a?.scope_satker_key||"060.01.00.00"})," • Wilayah hukum & parameter crime rate"]})
        ]}),
        eb&&(0,t.jsxs)(o.Button,{
          onClick:function(){
            eb&&(eE({alamat:eb.alamat||"",provinsi:eb.provinsi||"",kabupaten_kota:eb.kabupaten_kota||"",kecamatan:eb.kecamatan||"",desa:eb.desa||"",kode_pos:eb.kode_pos||"",longitude:eb.longitude||"",latitude:eb.latitude||"",jumlah_penduduk:eb.jumlah_penduduk||""}),eP(!0));
            setSettingsModal(!1);
          },
          className:"att-btn",
          size:"small",
          style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.4rem 0.9rem",fontWeight:700},
          children:[(0,t.jsx)(I.Pencil,{size:14,style:{marginRight:"0.35rem"}})," Edit Wilayah"]
        })
      ]}),
      ej?(0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",margin:0},children:"Memuat data wilayah satker…"}):ew?(0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"#dc2626",margin:0},children:ew}):eb?(0,t.jsxs)(t.Fragment,{children:[
        (0,t.jsx)(W,{id:"fld-cfg-sat-1",name:"field_cfg_sat_1",icon:(0,t.jsx)(k.MapPin,{size:15}),label:"Alamat",value:K(eb.alamat)||"Gedung Bareskrim Mabes Polri, Jl. Trunojoyo No. 3"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-2",name:"field_cfg_sat_2",icon:(0,t.jsx)(A,{id:"fld-cfg-sat-2-ico",name:"field_cfg_sat_2_ico",size:15}),label:"Provinsi",value:K(eb.provinsi)||"DKI Jakarta"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-3",name:"field_cfg_sat_3",icon:(0,t.jsx)(M.Landmark,{size:15}),label:"Kabupaten/Kota",value:K(eb.kabupaten_kota)||"Kota Jakarta Selatan"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-4",name:"field_cfg_sat_4",icon:(0,t.jsx)(b.Building2,{size:15}),label:"Kecamatan",value:K(eb.kecamatan)||"Kebayoran Baru"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-5",name:"field_cfg_sat_5",icon:(0,t.jsx)(b.Building2,{size:15}),label:"Desa/Kelurahan",value:K(eb.desa)||"Selong"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-6",name:"field_cfg_sat_6",icon:(0,t.jsx)(S.Hash,{size:15}),label:"Kode Pos",value:K(eb.kode_pos)||"12110"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-7",name:"field_cfg_sat_7",icon:(0,t.jsx)(z,{id:"fld-cfg-sat-7-ico",name:"field_cfg_sat_7_ico",size:15}),label:"Longitude",value:K(eb.longitude)||"106.7992"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-8",name:"field_cfg_sat_8",icon:(0,t.jsx)(z,{id:"fld-cfg-sat-8-ico",name:"field_cfg_sat_8_ico",size:15}),label:"Latitude",value:K(eb.latitude)||"-6.2383"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-9",name:"field_cfg_sat_9",icon:(0,t.jsx)(_.Users,{size:15}),label:"Jumlah Penduduk",value:function(e){let t=K(e);if(!t)return"FUNGSI"===String(eb?.tipe_satker||"").toUpperCase()?"Menginduk ke Wilayah Polda/Polres":"Belum diisi";let n=Number(t);return Number.isFinite(n)?\`\${n.toLocaleString("id-ID")} jiwa\`:t}(eb.jumlah_penduduk),last:!0})
      ]}):(0,t.jsxs)("div",{style:{padding:"1rem",background:"rgba(255,255,255,0.02)",borderRadius:"8px",border:"1px dashed rgba(255,255,255,0.1)",textAlign:"center"},children:[
        (0,t.jsx)("p",{style:{fontSize:"0.84rem",color:"#94a3b8",margin:"0 0 0.5rem"},children:"Data wilayah satker otomatis menginduk ke Mabes Polri (Nasional)."}),
        !isReadOnlyMode && (0,t.jsx)("button",{type:"button",onClick:()=>openEditIntro(),style:{padding:"0.35rem 0.75rem",borderRadius:"6px",background:"#2563eb",color:"#fff",border:"none",fontWeight:700,fontSize:"0.76rem",cursor:"pointer"},children:"Perbarui Satuan Kerja di Profil"})
      ]})
    ]})
  ]})
}),

// 9. JARINGAN & KONEKSI CAS MODAL (LINKEDIN STYLE)
(0,t.jsx)(r.Dialog,{
  header:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
    (0,t.jsx)("span",{style:{fontSize:"1.2rem"},children:"👥"}),
    (0,t.jsx)("span",{style:{fontWeight:800},children:"Jaringan & Koneksi Personil CAS"}),
    (0,t.jsx)("span",{style:{fontSize:"0.72rem",background:"rgba(56,189,248,0.15)",color:"#38bdf8",padding:"0.15rem 0.55rem",borderRadius:"999px",fontWeight:700},children:"4.120+ Personil"})
  ]}),
  visible:eNetworkModal,
  onHide:()=>setNetworkModal(!1),
  style:{width:"52rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"1rem",padding:"0.25rem 0"},children:[
    // Search & Filter Bar
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[
      (0,t.jsx)("div",{style:{flex:1,minWidth:"200px"},children:
        (0,t.jsx)(i.InputText,{
          value:eNetworkSearch,
          onChange:ev=>{
            setNetworkSearch(ev.target.value);
            fetchNetworkDirectory(ev.target.value, eNetworkSatkerFilter);
          },
          placeholder:"🔍 Cari personil berdasarkan nama, NRP, callsign, atau fungsi…",
          style:{width:"100%",fontSize:"0.85rem",padding:"0.5rem 0.75rem"}
        })
      }),
      (0,t.jsxs)("select",{
        value:eNetworkSatkerFilter,
        onChange:ev=>{
          setNetworkSatkerFilter(ev.target.value);
          fetchNetworkDirectory(eNetworkSearch, ev.target.value);
        },
        style:{fontSize:"0.82rem",padding:"0.45rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(0,0,0,0.3)",color:"#fff"},
        children:[
          (0,t.jsx)("option",{value:"all",children:"Semua Satker / Nasional"}),
          (0,t.jsx)("option",{value:"Bareskrim",children:"Mabes Bareskrim Polri"}),
          (0,t.jsx)("option",{value:"Polda Metro Jaya",children:"Polda Metro Jaya"}),
          (0,t.jsx)("option",{value:"Polda Jatim",children:"Polda Jawa Timur"}),
          (0,t.jsx)("option",{value:"Polda Sumut",children:"Polda Sumatera Utara"}),
          (0,t.jsx)("option",{value:"Polda Jabar",children:"Polda Jawa Barat"})
        ]
      })
    ]}),

    // Personnel Cards Grid
    eNetworkLoading ? (
      (0,t.jsx)("div",{style:{textAlign:"center",padding:"2rem",color:"#94a3b8"},children:"Memuat direktori personil CAS…"})
    ) : (
      (0,t.jsx)("div",{
        style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))",gap:"0.85rem",maxHeight:"60vh",overflowY:"auto",paddingRight:"0.25rem"},
        children:eNetworkUsers.map(user => {
          var userCallsign = formatCallsign(user.callsign, user.id, user.username);
          return (0,t.jsxs)("div",{
            key:user.id,
            style:{
              background:"rgba(255,255,255,0.03)",
              border:"1px solid var(--cas-border, rgba(255,255,255,0.08))",
              borderRadius:"12px",
              padding:"1rem",
              display:"flex",
              flexDirection:"column",
              justifyContent:"space-between",
              gap:"0.75rem"
            },
            children:[
              (0,t.jsxs)("div",{style:{display:"flex",gap:"0.75rem"},children:[
                (0,t.jsx)("div",{
                  style:{
                    width:"46px",
                    height:"46px",
                    borderRadius:"50%",
                    background:"#0f172a",
                    border:"2px solid #38bdf8",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontWeight:800,
                    fontSize:"1.1rem",
                    color:"#fff",
                    flexShrink:0,
                    overflow:"hidden"
                  },
                  children:user.photo_url || user.foto ? (0,t.jsx)("img",{src:user.photo_url||user.foto,alt:user.name,style:{width:"100%",height:"100%",objectFit:"cover"}}) : (user.name ? user.name.charAt(0).toUpperCase() : "👮")
                }),
                (0,t.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                  (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.86rem",color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:user.name}),
                  (0,t.jsx)("div",{style:{fontSize:"0.75rem",fontWeight:700,color:"#38bdf8"},children:userCallsign}),
                  (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",marginTop:"0.15rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:user.jabatan || user.pangkat || "Penyidik"})
                ]})
              ]}),
              (0,t.jsxs)("div",{style:{fontSize:"0.72rem",color:"#cbd5e1",background:"rgba(0,0,0,0.2)",padding:"0.35rem 0.5rem",borderRadius:"6px"},children:[
                "🏢 ", user.satker_nama || user.satker || user.satuan || "Bareskrim Polri"
              ]}),
              (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",marginTop:"0.25rem"},children:[
                (0,t.jsx)("button",{
                  type:"button",
                  onClick:() => handleOpenProfilePreview(user),
                  style:{flex:1,padding:"0.35rem",borderRadius:"6px",background:"transparent",border:"1px solid rgba(56,189,248,0.35)",color:"#38bdf8",fontSize:"0.74rem",fontWeight:700,cursor:"pointer"},
                  children:"Lihat Profil"
                }),
                (0,t.jsx)("button",{
                  type:"button",
                  onClick:() => {
                    e.current?.show({severity:'info',summary:'Koneksi Taktis',detail:'Koordinasi taktis terhubung dengan ' + user.name});
                  },
                  style:{padding:"0.35rem 0.65rem",borderRadius:"6px",background:"#2563eb",border:"none",color:"#fff",fontSize:"0.74rem",fontWeight:700,cursor:"pointer"},
                  children:"💬 Pesan"
                })
              ]})
            ]
          });
        })
      })
    )
  ]})
}),

// 10. PREVIEW PROFIL MODAL
(0,t.jsx)(r.Dialog,{
  header:"Profil Personil CAS",
  visible:eProfilePreviewModal,
  onHide:()=>setProfilePreviewModal(!1),
  style:{width:"36rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:ePreviewUser ? (0,t.jsxs)("div",{style:{display:"grid",gap:"1rem",padding:"0 0 0.5rem 0"},children:[
    // Mini Cover & Avatar Header
    (0,t.jsxs)("div",{style:{position:"relative",height:"105px",borderRadius:"10px",background:"linear-gradient(135deg, #090d16 0%, #0f172a 50%, #0369a1 100%)",overflow:"hidden",display:"flex",alignItems:"flex-end",padding:"0.75rem 1rem"},children:[
      (0,t.jsx)("div",{style:{position:"absolute",inset:0,opacity:0.25,backgroundImage:"radial-gradient(rgba(56,189,248,0.5) 1px, transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}),
      (0,t.jsxs)("div",{style:{position:"absolute",bottom:"-25px",left:"1.25rem",display:"flex",alignItems:"flex-end",gap:"0.75rem"},children:[
        (0,t.jsx)("div",{
          style:{
            width:"70px",
            height:"70px",
            borderRadius:"50%",
            background:"#0f172a",
            border:"3px solid #1e293b",
            boxShadow:"0 4px 12px rgba(0,0,0,0.5)",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:"1.75rem",
            fontWeight:800,
            color:"#fff",
            overflow:"hidden"
          },
          children:ePreviewUser.photo_url || ePreviewUser.foto ? (0,t.jsx)("img",{src:ePreviewUser.photo_url||ePreviewUser.foto,alt:ePreviewUser.name,style:{width:"100%",height:"100%",objectFit:"cover"}}) : (ePreviewUser.name ? ePreviewUser.name.charAt(0).toUpperCase() : "👮")
        })
      ]})
    ]}),

    // Identity Meta
    (0,t.jsxs)("div",{style:{marginTop:"1.8rem",padding:"0 0.5rem"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},children:[
        (0,t.jsx)("span",{style:{fontSize:"1.2rem",fontWeight:800,color:"#fff"},children:ePreviewUser.name}),
        (0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:18,height:18,children:[
          (0,t.jsx)("circle",{cx:12,cy:12,r:11,fill:"#0284c7"}),
          (0,t.jsx)("path",{d:"m7.5 12 3 3 6-6",stroke:"#ffffff",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
        ]}),
        (0,t.jsx)("span",{style:{fontSize:"0.74rem",fontWeight:700,padding:"0.15rem 0.55rem",borderRadius:"999px",background:"rgba(34,197,94,0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.3)"},children:"● Online / Aktif"})
      ]}),
      (0,t.jsxs)("div",{style:{fontSize:"0.84rem",color:"#38bdf8",fontWeight:700,marginTop:"0.2rem"},children:[
        formatCallsign(ePreviewUser.callsign, ePreviewUser.id, ePreviewUser.username)
      ]}),
      (0,t.jsxs)("div",{style:{fontSize:"0.86rem",color:"#e2e8f0",marginTop:"0.25rem",fontWeight:600},children:[
        ePreviewUser.pangkat ? ePreviewUser.pangkat + " • " : "",
        ePreviewUser.jabatan || ePreviewUser.role || "Penyidik Reserse Polri"
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginTop:"0.15rem"},children:
        ePreviewUser.satker_nama || ePreviewUser.satker || ePreviewUser.satuan || "Badan Reserse Kriminal Polri"
      })
    ]}),

    // Details Grid (NRP, Email, HP, Bio)
    (0,t.jsxs)("div",{style:{display:"grid",gap:"0.6rem",padding:"0 0.5rem"},children:[
      (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[
        (0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.03)",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)"},children:[
          (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"NRP / IDENTITAS"}),
          (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#fff",fontWeight:700,marginTop:"0.15rem"},children:ePreviewUser.nrp || "78090123"})
        ]}),
        (0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.03)",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)"},children:[
          (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"STATUS KEDINASAN"}),
          (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#4ade80",fontWeight:700,marginTop:"0.15rem"},children:"Polri Aktif"})
        ]})
      ]}),
      (0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.03)",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)"},children:[
        (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"EMAIL DINAS POLRI"}),
        (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#fff",fontWeight:600,marginTop:"0.15rem"},children:ePreviewUser.email_polri || (typeof ePreviewUser.email === "string" && ePreviewUser.email.endsWith("@polri.go.id") ? ePreviewUser.email : "reskrim.ops@polri.go.id")})
      ]}),
      ePreviewUser.bio && (0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.03)",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)"},children:[
        (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"TENTANG PERSONIL"}),
        (0,t.jsx)("div",{style:{fontSize:"0.8rem",color:"#cbd5e1",marginTop:"0.2rem",lineHeight:1.45},children:ePreviewUser.bio})
      ]})
    ]}),

    // Action Footer
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"flex-end",padding:"0.5rem",borderTop:"1px solid rgba(255,255,255,0.08)"},children:[
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>setProfilePreviewModal(!1),
        style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.45rem 1rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer"},
        children:"Tutup"
      }),
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>{
          setProfilePreviewModal(!1);
          e.current?.show({severity:'info',summary:'Ruang Koordinasi',detail:'Menghubungkan ke ruang koordinasi taktis perkara dengan ' + ePreviewUser.name});
        },
        style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.45rem 1.15rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer"},
        children:"💬 Kirim Pesan Taktis"
      })
    ]})
  ]}) : null
}),

// HERO CARD (Pure LinkedIn Replica)
(0,t.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden",marginBottom:"1.25rem",borderRadius:"16px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",background:"var(--cas-bg-surface, #1e293b)",boxShadow:"0 8px 30px rgba(0,0,0,0.25)"},children:[
  // 1. Cover Banner (Height: 200px)
  (0,t.jsxs)("div",{style:{position:"relative",height:"200px",background:eBannerTheme,overflow:"hidden",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"1rem 1.5rem"},children:[
    // Grid pattern background
    (0,t.jsx)("div",{style:{position:"absolute",inset:0,opacity:0.25,backgroundImage:"radial-gradient(rgba(56,189,248,0.5) 1px, transparent 1px)",backgroundSize:"22px 22px",pointerEvents:"none"}}),
    // Tactical cyber text watermark
    (0,t.jsxs)("div",{style:{position:"absolute",top:"1.25rem",left:"1.75rem",pointerEvents:"none",opacity:0.6},children:[
      (0,t.jsx)("div",{style:{fontSize:"1.15rem",fontWeight:900,color:"#38bdf8",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"monospace"},children:"READY TO WORK"}),
      (0,t.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"#94a3b8",letterSpacing:"0.08em",fontFamily:"monospace"},children:"BUILDING SOLUTIONS ONE LINE AT A TIME • CAS RESKRIM POLRI"})
    ]}),
    // Edit cover button (Hidden in read-only mode)
    !isReadOnlyMode && (0,t.jsx)("button",{
      type:"button",
      "aria-label":"Edit gambar latar belakang",
      title:"Edit tema foto sampul",
      onClick:()=>setBannerModal(!0),
      style:{position:"absolute",top:"14px",right:"16px",background:"rgba(15,23,42,0.75)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"50%",width:"36px",height:"36px",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"1rem",cursor:"pointer",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"},
      children:"✏️"
    })
  ]}),

  // 2. Hero Body
  (0,t.jsxs)("div",{style:{padding:"0 1.75rem 1.5rem 1.75rem"},children:[
    // Top Row: Avatar & Right Institutions & Top-Right Edit Intro Pencil
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"1rem"},children:[
      // Overlapping Avatar
      (0,t.jsxs)("div",{
        style:{position:"relative",marginTop:"-70px",width:"135px",height:"135px",flex:"0 0 135px"},
        children:[
          (0,t.jsx)("div",{style:{width:"100%",height:"100%",borderRadius:"50%",background:"var(--cas-bg-surface, #0f172a)",border:"4px solid var(--cas-card-bg, #1e293b)",boxShadow:"0 8px 24px rgba(0,0,0,0.45)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3rem",fontWeight:800,color:"#fff"},children:
            (a?.photo_url||a?.foto)?(0,t.jsx)("img",{src:a.photo_url||a.foto,alt:a?.name||"Foto Profil",style:{width:"100%",height:"100%",objectFit:"cover"}}):eB
          }),
          // Pencil Edit Icon on Avatar (Hidden in read-only mode)
          !isReadOnlyMode && (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Edit foto profil",
            title:"Edit foto profil",
            onClick:()=>{if(isReadOnlyMode)return;let f0=a?.photo_url||a?.foto||null;setPhotoPreview(f0);setRawPhoto(f0);setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0);setPhotoModal(!0)},
            style:{position:"absolute",bottom:"4px",right:"4px",width:"34px",height:"34px",borderRadius:"50%",background:"#2563eb",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"0.95rem",boxShadow:"0 2px 6px rgba(0,0,0,0.35)",cursor:"pointer"},
            children:"✏️"
          })
        ]
      }),

      // Top Right: Institution Affiliations + Edit Intro Pencil Button
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:"1.25rem",marginTop:"0.75rem"},children:[
        // Institutional Badges
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.6rem",maxWidth:"340px"},children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",cursor:isReadOnlyMode?"default":"pointer"},onClick:isReadOnlyMode?void 0:()=>openEditExp(0),children:[
            (0,t.jsx)("div",{style:{width:"34px",height:"34px",borderRadius:"8px",background:"rgba(56,189,248,0.12)",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0},children:"🏢"}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.84rem",color:"var(--cas-text-primary, #f8fafc)",lineHeight:1.2},children:"Kepolisian Negara Republik Indonesia"}),
              (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:K(a?.scope_satker_name)||K(a?.satuan)||"Bareskrim Polri"})
            ]})
          ]}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",cursor:isReadOnlyMode?"default":"pointer"},onClick:isReadOnlyMode?void 0:()=>openEditEdu(0),children:[
            (0,t.jsx)("div",{style:{width:"34px",height:"34px",borderRadius:"8px",background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0},children:"🎓"}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.84rem",color:"var(--cas-text-primary, #f8fafc)",lineHeight:1.2},children:"Universitas Nusa Mandiri"}),
              (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:"Pusdik Reskrim Lemdiklat Polri"})
            ]})
          ]})
        ]}),

        // Top-Right Pencil Edit Button for Intro (Hidden in read-only mode)
        !isReadOnlyMode && (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit profil",
          title:"Edit data diri profil",
          onClick:openEditIntro,
          style:{background:"transparent",border:"none",fontSize:"1.25rem",cursor:"pointer",padding:"0.35rem",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#94a3b8"},
          children:"✏️"
        })
      ]})
    ]}),

    // Identity, Headline, Location & Action Bar
    (0,t.jsxs)("div",{style:{marginTop:"0.85rem"},children:[
      // Name & Callsign row with Verified Checkmark & Online Status
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap"},children:[
        (0,t.jsx)("span",{style:{fontSize:"1.55rem",fontWeight:800,color:"var(--cas-text-primary, #ffffff)",lineHeight:1.2},children:(a?.name||a?.username||"Anak Serse")}),
        (0,t.jsx)("span",{style:{fontSize:"0.88rem",fontWeight:800,color:"#38bdf8",background:"rgba(56,189,248,0.18)",border:"1px solid rgba(56,189,248,0.35)",padding:"0.15rem 0.65rem",borderRadius:"999px",fontFamily:"monospace"},children:formatCallsign(a?.callsign, a?.id, a?.username)}),
        // Centang Verifikasi (Official blue checkmark)
        (0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:20,height:20,style:{verticalAlign:"middle",flexShrink:0},title:"Terverifikasi Kedinasan Mabes Polri",children:[
          (0,t.jsx)("circle",{cx:12,cy:12,r:11,fill:"#0284c7"}),
          (0,t.jsx)("path",{d:"m7.5 12 3 3 6-6",stroke:"#ffffff",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
        ]}),
        // Clean Online Status Pill
        (0,t.jsxs)("span",{style:{fontSize:"0.76rem",fontWeight:700,padding:"0.2rem 0.65rem",borderRadius:"999px",background:"rgba(34,197,94,0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.35)",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[
          "● Online"
        ]})
      ]}),

      // Headline (Custom or Position)
      (0,t.jsx)("div",{style:{fontSize:"0.95rem",color:"var(--cas-text-primary, #e2e8f0)",marginTop:"0.35rem",fontWeight:500,lineHeight:1.4},children:
        (a?.social_media?.headline || a?.jabatan || "Senior Full-Stack Engineer • Badan Reserse Kriminal Polri")
      }),

      // Location, Contact Info & Connections (Clickable to open Network modal)
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap",marginTop:"0.45rem",fontSize:"0.82rem",color:"var(--cas-text-secondary, #94a3b8)"},children:[
        (0,t.jsx)("span",{children:(a?.social_media?.kota || "Jakarta Selatan, Indonesia")}),
        (0,t.jsx)("span",{style:{color:"#64748b"},children:"•"}),
        (0,t.jsx)("button",{type:"button",onClick:()=>setContactModal(!0),style:{background:"transparent",border:"none",color:"#38bdf8",fontWeight:700,cursor:"pointer",padding:0,textDecoration:"underline"},children:"Info kontak"}),
        (0,t.jsx)("span",{style:{color:"#64748b"},children:"•"}),
        (0,t.jsxs)("button",{
          type:"button",
          onClick:()=>{
            setNetworkModal(!0);
            fetchNetworkDirectory(eNetworkSearch, eNetworkSatkerFilter);
          },
          style:{background:"transparent",border:"none",color:"#38bdf8",fontWeight:700,cursor:"pointer",padding:0,display:"inline-flex",alignItems:"center",gap:"0.3rem",textDecoration:"underline"},
          children:[
            (function(){
              let isSuper = String(a?.role_bdb||"").toLowerCase() === "superadmin" || String(eH||"").toLowerCase() === "superadmin";
              return isSuper ? "4.120+ koneksi" : ((a?.social_media?.connections_count || 38) + " koneksi");
            })()
          ]
        })
      ]}),

      // Action Pills Bar (Strictly separated for Owner vs Read-Only View)
      !isReadOnlyMode ? (
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap",marginTop:"1.1rem"},children:[
          (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Terbuka untuk",
            onClick:()=>e.current?.show({severity:'info',summary:'Terbuka Untuk',detail:'Status kedinasan: Terbuka untuk koordinasi perkara & asistensi teknis siber.'}),
            style:{background:"#0a66c2",color:"#fff",border:"none",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem",boxShadow:"0 2px 8px rgba(10,102,194,0.35)"},
            children:"Terbuka untuk"
          }),
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>setAddSectionModal(!0),
            style:{background:"transparent",color:"#38bdf8",border:"1px solid #0284c7",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer"},
            children:"Tambahkan bagian"
          }),
          (0,t.jsx)("button",{
            type:"button",
            onClick:openEditIntro,
            style:{background:"transparent",color:"var(--cas-text-primary, #cbd5e1)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:600,cursor:"pointer"},
            children:"Optimalkan profil"
          }),
          // Top Gear Config Button (Keamanan 2FA & Satker)
          (0,t.jsxs)("button",{
            type:"button",
            "aria-label":"Pengaturan Profil dan Keamanan",
            title:"Buka Pengaturan Satker & Keamanan Mandiri",
            onClick:()=>{
              setSettingsTab('keamanan');
              setSettingsModal(!0);
            },
            style:{background:"rgba(255,255,255,0.06)",color:"#f8fafc",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.4rem"},
            children:[
              (0,t.jsx)("span",{children:"⚙️"}),
              (0,t.jsx)("span",{children:"Pengaturan ▾"})
            ]
          }),
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>{if(navigator.clipboard){navigator.clipboard.writeText(window.location.href);e.current?.show({severity:'info',summary:'Tautan Disalin',detail:'Tautan profil telah disalin.'})}},
            title:"Lainnya",
            style:{background:"transparent",color:"#cbd5e1",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"50%",width:"34px",height:"34px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",fontWeight:700,cursor:"pointer"},
            children:"⋯"
          })
        ]})
      ) : (
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap",marginTop:"1.1rem"},children:[
          (0,t.jsxs)("div",{
            style:{background:"rgba(56,189,248,0.12)",color:"#38bdf8",border:"1px solid rgba(56,189,248,0.3)",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"0.4rem"},
            children:[
              (0,t.jsx)("span",{children:"🔒"}),
              (0,t.jsx)("span",{children:"Profil Terverifikasi (Mode Kedinasan)"})
            ]
          }),
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>{
              let cs = formatCallsign(a?.callsign, a?.id, a?.username);
              if(navigator.clipboard) navigator.clipboard.writeText(cs);
              e.current?.show({severity:'success',summary:'Callsign Disalin',detail:'Callsign ' + cs + ' berhasil disalin ke clipboard.'});
            },
            style:{background:"rgba(255,255,255,0.06)",color:"#f8fafc",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.4rem"},
            children:[
              (0,t.jsx)("span",{children:"📋"}),
              (0,t.jsx)("span",{children:"Salin Callsign"})
            ]
          }),
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>e.current?.show({severity:'info',summary:'Ruang Koordinasi',detail:'Menghubungkan ke ruang koordinasi taktis perkara dengan ' + (a?.name || 'Personil CAS')}),
            style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.4rem",boxShadow:"0 2px 8px rgba(37,99,235,0.35)"},
            children:[
              (0,t.jsx)("span",{children:"💬"}),
              (0,t.jsx)("span",{children:"Kirim Pesan Taktis"})
            ]
          }),
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>{if(navigator.clipboard){navigator.clipboard.writeText(window.location.href);e.current?.show({severity:'info',summary:'Tautan Disalin',detail:'Tautan profil telah disalin.'})}},
            title:"Lainnya",
            style:{background:"transparent",color:"#cbd5e1",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"50%",width:"34px",height:"34px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",fontWeight:700,cursor:"pointer"},
            children:"⋯"
          })
        ]})
      )
    ]})
  ]})
]}),

// 3. TWO-COLUMN LAYOUT (Main 70% + Sidebar 30%)
(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"minmax(0, 1fr) 340px",gap:"1.25rem",alignItems:"start"},className:"cas-two-col-profile",children:[

  // ================= LEFT COLUMN (70%) =================
  (0,t.jsxs)("div",{style:{display:"grid",gap:"1.25rem",minWidth:0},children:[

    // A. Tentang Saya (Bio & Ringkasan Diri)
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,t.jsx)("span",{style:{fontSize:"1.2rem"},children:"📖"}),
          (0,t.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Tentang Saya"})
        ]}),
        !isReadOnlyMode && (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit Tentang Saya",
          title:"Edit Ringkasan Profil",
          onClick:()=>setBioModal(!0),
          style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#94a3b8",padding:"0.2rem"},
          children:"✏️"
        })
      ]}),
      eBio.trim() ? (
        (0,t.jsx)("div",{style:{fontSize:"0.88rem",lineHeight:"1.6",color:"var(--cas-text-primary, #e2e8f0)",whiteSpace:"pre-wrap",wordBreak:"break-word"},children:eBio})
      ) : (
        (0,t.jsxs)("div",{style:{padding:"1rem",borderRadius:"10px",background:"rgba(56,189,248,0.04)",border:"1px dashed rgba(56,189,248,0.25)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem"},children:[
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.86rem",color:"#38bdf8"},children:isReadOnlyMode ? "Ringkasan belum ditambahkan" : "Belum ada ringkasan tentang profil Anda"}),
            (0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"#94a3b8",marginTop:"0.15rem"},children:isReadOnlyMode ? "Personil bersangkutan belum menambahkan biodata publik." : "Tambahkan ringkasan peran operasional, keahlian reserse siber, atau moto integritas kedinasan."})
          ]}),
          !isReadOnlyMode && (0,t.jsx)("button",{
            type:"button",
            onClick:()=>setBioModal(!0),
            style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.4rem 0.9rem",fontSize:"0.78rem",fontWeight:700,cursor:"pointer"},
            children:"➕ Tambahkan Ringkasan"
          })
        ]})
      )
    ]}),

    // B. Aktivitas & Linimasa Personal Card
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      // Header & Subtitle
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:"0.75rem"},children:[
        (0,t.jsxs)("div",{children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem"},children:[
            (0,t.jsx)("span",{style:{fontSize:"1.25rem"},children:"📝"}),
            (0,t.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Aktivitas"})
          ]}),
          (0,t.jsx)("p",{style:{margin:"0.15rem 0 0",fontSize:"0.78rem",color:"#94a3b8"},children:isReadOnlyMode ? "Postingan dan catatan operasional personil" : "Postingan, catatan operasional, dan pemikiran taktis Anda"})
        ]}),

        // Filter Tabs
        (0,t.jsxs)("div",{style:{display:"inline-flex",background:"var(--cas-bg-surface, rgba(255,255,255,0.05))",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",borderRadius:"8px",padding:"0.25rem",gap:"0.25rem"},children:[
          [
            { id: 'mine', label: isReadOnlyMode ? 'Postingan' : 'Postingan Saya' },
            { id: 'reposts', label: 'Tanggapan' }
          ].concat(!isReadOnlyMode ? [
            { id: 'private', label: '🔒 Privat' },
            { id: 'drafts', label: '💾 Draft' }
          ] : []).map(tab => (0,t.jsx)("button",{
            key:tab.id,
            type:"button",
            onClick:() => setFeedTab(tab.id),
            style:{
              background:eFeedTab === tab.id ? '#2563eb' : 'transparent',
              color:eFeedTab === tab.id ? '#fff' : 'var(--cas-text-secondary, #94a3b8)',
              border:"none",
              borderRadius:"6px",
              padding:"0.35rem 0.75rem",
              fontSize:"0.76rem",
              fontWeight:700,
              cursor:"pointer"
            },
            children:tab.label
          }))
        ]})
      ]}),

      // Quick Composer for personal notes/posts (Owner Only)
      !isReadOnlyMode && (0,t.jsxs)("div",{style:{padding:"0.9rem",borderRadius:"10px",marginBottom:"1.25rem",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",background:"rgba(0,0,0,0.18)"},children:[
        (0,t.jsx)("textarea",{
          id:"cas-post-composer",
          value:ePostText,
          onChange:ev => setPostText(ev.target.value),
          rows:2,
          placeholder:"Mulai buat postingan catatan taktis, pemikiran intelijen, atau temuan perkara baru... (Maks 3.000 karakter)",
          maxLength:3000,
          style:{width:"100%",fontSize:"0.86rem",padding:"0.65rem 0.85rem",borderRadius:"8px",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",background:"var(--cas-bg-surface-2, rgba(0,0,0,0.25))",color:"var(--cas-text-primary, #f8fafc)",resize:"vertical",fontFamily:"inherit"}
        }),
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.6rem",flexWrap:"wrap",gap:"0.5rem"},children:[
          (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center"},children:[
            (0,t.jsxs)("select",{
              value:ePostAudience,
              onChange:ev => setPostAudience(ev.target.value),
              style:{fontSize:"0.76rem",padding:"0.35rem 0.6rem",borderRadius:"6px",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",background:"rgba(0,0,0,0.3)",color:"var(--cas-text-primary, #f8fafc)"},
              children:[
                (0,t.jsx)("option",{value:"public",children:"🌐 Publik"}),
                (0,t.jsx)("option",{value:"followers",children:"👥 Pengikut / Teman Dekat / Satker tertentu"}),
                (0,t.jsx)("option",{value:"private",children:"🔒 Privat"})
              ]
            }),
            (0,t.jsxs)("span",{style:{fontSize:"0.72rem",color:ePostText.length >= 2800 ? '#ef4444' : '#94a3b8',fontWeight:600},children:[
              ePostText.length," / 3.000 karakter"
            ]})
          ]}),
          (0,t.jsx)("button",{
            type:"button",
            onClick:handleCreatePersonalPost,
            disabled:ePostSubmitting || !ePostText.trim(),
            style:{
              display:"inline-flex",
              alignItems:"center",
              gap:"0.35rem",
              padding:"0.45rem 1rem",
              borderRadius:"8px",
              background:"#2563eb",
              color:"#fff",
              border:"none",
              fontWeight:700,
              fontSize:"0.82rem",
              cursor:ePostSubmitting || !ePostText.trim() ? "not-allowed" : "pointer",
              opacity:ePostSubmitting || !ePostText.trim() ? 0.6 : 1
            },
            children:ePostSubmitting ? "Mengirim..." : "🚀 Publikasikan"
          })
        ]})
      ]}),

      // Personal Posts List
      eLoadingFeed ? (
        (0,t.jsx)("div",{style:{textAlign:"center",padding:"2rem",color:"#94a3b8"},children:"Memuat linimasa…"})
      ) : ePersonalPosts.length === 0 ? (
        (0,t.jsxs)("div",{style:{textAlign:"center",padding:"2.5rem",borderRadius:"12px",background:"rgba(0,0,0,0.12)",border:"1px dashed rgba(255,255,255,0.1)"},children:[
          (0,t.jsx)("div",{style:{fontSize:"2.2rem",marginBottom:"0.4rem"},children:"📭"}),
          (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.95rem",color:"var(--cas-text-primary, #f1f5f9)"},children:"Belum ada postingan di kategori ini."}),
          (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginTop:"0.2rem"},children:isReadOnlyMode ? "Personil ini belum mempublikasikan catatan taktis." : "Gunakan form di atas untuk membagikan tulisan atau catatan taktis pertama Anda."})
        ]})
      ) : (
        (0,t.jsx)("div",{style:{display:"grid",gap:"1rem"},children:
          ePersonalPosts.map(p => {
            var totRcts = p.total_reactions || 0;
            var audLabel = p.audience_type === 'private' ? '🔒 Privat' : (p.audience_type === 'followers' ? '👥 Satker / Pengikut' : '🌐 Publik');
            return (0,t.jsxs)("div",{key:p.id,style:{padding:"1rem",borderRadius:"10px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))",background:"rgba(0,0,0,0.15)"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.5rem",marginBottom:"0.55rem"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
                  (0,t.jsx)("span",{style:{fontWeight:800,color:"#38bdf8",fontSize:"0.86rem"},children:p.author_callsign ? ('@' + p.author_callsign) : ('@' + (a?.username || 'anak_serse'))}),
                  (0,t.jsx)("span",{style:{color:"#64748b",fontSize:"0.7rem"},children:"•"}),
                  (0,t.jsx)("span",{style:{color:"#94a3b8",fontSize:"0.72rem"},children:audLabel}),
                  (0,t.jsx)("span",{style:{color:"#64748b",fontSize:"0.7rem"},children:"•"}),
                  (0,t.jsx)("span",{style:{color:"#94a3b8",fontSize:"0.72rem"},children:new Date(p.created_at).toLocaleDateString("id-ID",{dateStyle:"medium"})})
                ]}),
                !isReadOnlyMode && (0,t.jsxs)("div",{style:{display:"flex",gap:"0.3rem"},children:[
                  (0,t.jsx)("button",{
                    type:"button",
                    onClick:() => handleTogglePostVis(p),
                    title:"Ubah Visibilitas (Publik / Satker / Privat)",
                    style:{background:"transparent",border:"none",cursor:"pointer",padding:"0.25rem",fontSize:"0.85rem"},
                    children:p.audience_type === 'private' ? '🔒' : (p.audience_type === 'followers' ? '👥' : '🌐')
                  }),
                  (0,t.jsx)("button",{
                    type:"button",
                    onClick:() => handlePersonalDelete(p.id),
                    title:"Hapus Postingan",
                    style:{background:"transparent",border:"none",cursor:"pointer",padding:"0.25rem",fontSize:"0.85rem"},
                    children:'🗑️'
                  })
                ]})
              ]}),

              (0,t.jsx)("div",{style:{fontSize:"0.88rem",lineHeight:"1.5",color:"var(--cas-text-primary, #e2e8f0)",whiteSpace:"pre-wrap",wordBreak:"break-word",marginBottom:"0.75rem"},children:p.content}),

              // Stats & Action Bar (Reaction Count on LEFT of button)
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:"0.4rem",borderTop:"1px solid var(--cas-border, rgba(255,255,255,0.06))",fontSize:"0.76rem"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.8rem"},children:[
                  (0,t.jsxs)("button",{
                    type:"button",
                    onClick:() => handlePersonalReact(p.id, p.user_reaction ? p.user_reaction : 'like'),
                    style:{background:"transparent",border:"none",color:p.user_reaction ? '#38bdf8' : '#94a3b8',fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.76rem"},
                    children:[
                      totRcts > 0 ? (0,t.jsx)("span",{style:{fontWeight:800,color:p.user_reaction ? '#38bdf8' : '#cbd5e1'},children:formatCount(totRcts)}):null,
                      "👍 Suka"
                    ]
                  }),
                  (0,t.jsxs)("button",{
                    type:"button",
                    onClick:() => togglePostComments(p.id),
                    style:{background:"transparent",border:"none",color:eActiveCommentPostId === p.id ? '#38bdf8' : '#94a3b8',fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.3rem",fontSize:"0.76rem"},
                    children:[
                      "💬 ",(p.comments_count || 0)," Komentar"
                    ]
                  })
                ]}),
                (0,t.jsxs)("span",{style:{color:"#64748b",fontSize:"0.7rem"},children:[
                  "👁️ ",(p.view_count || 0)," dilihat"
                ]})
              ]}),

              // Comments drawer
              eActiveCommentPostId === p.id && (0,t.jsxs)("div",{style:{marginTop:"0.75rem",paddingTop:"0.75rem",borderTop:"1px solid rgba(255,255,255,0.06)"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",marginBottom:"0.6rem"},children:[
                  (0,t.jsx)("input",{
                    type:"text",
                    value:eCommentInputs[p.id] || '',
                    onChange:ev => setCommentInputs({ ...eCommentInputs, [p.id]: ev.target.value }),
                    onKeyDown:ev => ev.key === 'Enter' && handleAddPersonalComment(p.id),
                    placeholder:"Balas tanggapan ini... (maks 1.000 karakter)",
                    maxLength:1000,
                    style:{flex:1,fontSize:"0.8rem",padding:"0.35rem 0.6rem",borderRadius:"6px",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",background:"rgba(0,0,0,0.25)",color:"#fff"}
                  }),
                  (0,t.jsx)("button",{
                    type:"button",
                    onClick:() => handleAddPersonalComment(p.id),
                    disabled:eSubmittingComment,
                    style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",padding:"0.35rem 0.65rem",fontSize:"0.78rem",fontWeight:700,cursor:"pointer"},
                    children:"Kirim"
                  })
                ]}),
                (ePostComments[p.id] || []).map(cm => (0,t.jsxs)("div",{key:cm.id,style:{background:"rgba(255,255,255,0.03)",borderRadius:"6px",padding:"0.45rem 0.65rem",fontSize:"0.78rem",marginBottom:"0.35rem"},children:[
                  (0,t.jsx)("span",{style:{fontWeight:700,color:"#38bdf8",marginRight:"0.4rem"},children:'@' + (cm.author_callsign || 'anak_serse')}),
                  (0,t.jsx)("span",{style:{color:"#cbd5e1"},children:cm.content})
                ]}))
              ]})
            ]});
          })
        })
      )
    ]}),

    // C. Pengalaman (Dynamic Experience Card)
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,t.jsx)("span",{style:{fontSize:"1.25rem"},children:"💼"}),
          (0,t.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Pengalaman"})
        ]}),
        !isReadOnlyMode && (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
          (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Tambahkan pengalaman",
            title:"Tambahkan riwayat pengalaman baru",
            onClick:openAddExp,
            style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#94a3b8",padding:"0.2rem"},
            children:"➕"
          }),
          (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Edit pengalaman",
            title:"Edit pengalaman",
            onClick:()=>openEditExp(0),
            style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#94a3b8",padding:"0.2rem"},
            children:"✏️"
          })
        ]})
      ]}),
      getActiveExperiences().map((exp, idx, arr) => (
        (0,t.jsxs)("div",{key:exp.id||idx,style:{display:"flex",gap:"0.85rem",paddingTop:idx>0?"1rem":0,paddingBottom:idx<arr.length-1?"1rem":0,borderBottom:idx<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none"},children:[
          (0,t.jsx)("div",{style:{width:"44px",height:"44px",borderRadius:"8px",background:"rgba(56,189,248,0.12)",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0},children:"🏢"}),
          (0,t.jsxs)("div",{style:{flex:1},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between"},children:[
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.92rem",color:"#fff"},children:exp.title||"Posisi Kedinasan"}),
              !isReadOnlyMode && (0,t.jsx)("button",{
                type:"button",
                title:"Edit pengalaman ini",
                onClick:()=>openEditExp(idx),
                style:{background:"transparent",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"0.85rem",padding:"0.15rem 0.35rem"},
                children:"✏️"
              })
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.8rem",color:"#38bdf8",fontWeight:600},children:exp.company||"Satuan Kerja"}),
            (0,t.jsxs)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem"},children:[exp.period||"Periode", exp.location ? " • " + exp.location : ""]}),
            exp.description ? (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#cbd5e1",marginTop:"0.4rem",lineHeight:1.45,whiteSpace:"pre-wrap"},children:exp.description}) : null
          ]})
        ]})
      ))
    ]}),

    // D. Pendidikan (Dynamic Education Card)
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,t.jsx)("span",{style:{fontSize:"1.25rem"},children:"🎓"}),
          (0,t.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Pendidikan"})
        ]}),
        !isReadOnlyMode && (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
          (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Tambahkan pendidikan",
            title:"Tambahkan riwayat pendidikan baru",
            onClick:openAddEdu,
            style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#94a3b8",padding:"0.2rem"},
            children:"➕"
          }),
          (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Edit pendidikan",
            title:"Edit pendidikan",
            onClick:()=>openEditEdu(0),
            style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#94a3b8",padding:"0.2rem"},
            children:"✏️"
          })
        ]})
      ]}),
      getActiveEducation().map((edu, idx, arr) => (
        (0,t.jsxs)("div",{key:edu.id||idx,style:{display:"flex",gap:"0.85rem",paddingTop:idx>0?"1rem":0,paddingBottom:idx<arr.length-1?"1rem":0,borderBottom:idx<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none"},children:[
          (0,t.jsx)("div",{style:{width:"44px",height:"44px",borderRadius:"8px",background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0},children:"🎓"}),
          (0,t.jsxs)("div",{style:{flex:1},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between"},children:[
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.92rem",color:"#fff"},children:edu.school||"Institusi Pendidikan"}),
              !isReadOnlyMode && (0,t.jsx)("button",{
                type:"button",
                title:"Edit pendidikan ini",
                onClick:()=>openEditEdu(idx),
                style:{background:"transparent",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"0.85rem",padding:"0.15rem 0.35rem"},
                children:"✏️"
              })
            ]}),
            (0,t.jsxs)("div",{style:{fontSize:"0.8rem",color:"#c084fc",fontWeight:600},children:[edu.degree||"", edu.field ? (edu.degree ? ", " : "") + edu.field : ""]}),
            edu.year ? (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem"},children:edu.year}) : null,
            edu.description ? (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#cbd5e1",marginTop:"0.4rem",lineHeight:1.45,whiteSpace:"pre-wrap"},children:edu.description}) : null
          ]})
        ]})
      ))
    ]})

  ]}),

  // ================= RIGHT COLUMN (30% SIDEBAR) =================
  (0,t.jsxs)("div",{style:{display:"grid",gap:"1.25rem"},children:[

    // 1. Keamanan Mandiri Status Widget
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"#fff"},children:!isReadOnlyMode ? "Keamanan Mandiri" : "Otoritas & Kepatuhan"}),
        (0,t.jsx)("span",{style:{fontSize:"1rem"},children:"🛡️"})
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginBottom:"0.6rem"},children:!isReadOnlyMode ? "Status proteksi autentikasi akun CAS Anda:" : "Status autentikasi kedinasan personil resmi Bareskrim Polri:"}),
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0,0,0,0.25)",padding:"0.5rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.08)",marginBottom:"0.75rem"},children:[
        (0,t.jsx)("span",{style:{fontSize:"0.8rem",fontWeight:700,color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2||isReadOnlyMode)?"#4ade80":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"#38bdf8":"#fbbf24"},children:isReadOnlyMode ? "● Akun Terverifikasi" : ([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"● Terproteksi (2FA Aktif)":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"● 1 Lapisan Aktif":"○ Keamanan Standar"}),
        (0,t.jsx)("span",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:isReadOnlyMode ? "CAS Zero-Trust" : ([a?.local_password_enabled,a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length) + " Aktif"})
      ]}),
      !isReadOnlyMode ? (
        (0,t.jsx)("button",{
          type:"button",
          onClick:()=>{
            setSettingsTab('keamanan');
            setSettingsModal(!0);
          },
          style:{width:"100%",padding:"0.45rem",borderRadius:"8px",background:"transparent",border:"1px solid rgba(56,189,248,0.4)",color:"#38bdf8",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",textAlign:"center"},
          children:"Kelola Keamanan (2FA & TOTP)"
        })
      ) : (
        (0,t.jsxs)("div",{style:{fontSize:"0.74rem",color:"#64748b",textAlign:"center",padding:"0.2rem"},children:[
          "🔒 Data Kredensial Terenkripsi"
        ]})
      )
    ]}),

    // 2. Bahasa profil Card
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"#fff"},children:"Bahasa profil"}),
        !isReadOnlyMode && (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit bahasa profil",
          title:"Edit bahasa profil",
          onClick:()=>e.current?.show({severity:'info',summary:'Bahasa Profil',detail:'Bahasa utama profil dinas adalah Bahasa Indonesia.'}),
          style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1rem",color:"#94a3b8"},
          children:"✏️"
        })
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#94a3b8"},children:"Bahasa Indonesia"})
    ]}),

    // 3. Profil publik dan URL Card
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"#fff"},children:"Profil publik dan URL"}),
        !isReadOnlyMode && (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit Profil publik dan URL",
          title:"Kelola Identitas Callsign",
          onClick:openEditIntro,
          style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1rem",color:"#94a3b8"},
          children:"✏️"
        })
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginBottom:"0.6rem"},children:"Identitas Callsign terverifikasi di jaringan CAS:"}),
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0,0,0,0.25)",padding:"0.5rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.08)"},children:[
        (0,t.jsx)("span",{style:{fontSize:"0.84rem",fontWeight:800,color:"#38bdf8",fontFamily:"monospace"},children:formatCallsign(a?.callsign, a?.id, a?.username)}),
        (0,t.jsx)("span",{style:{fontSize:"0.7rem",color:"#4ade80",fontWeight:700},children:"✓ Terverifikasi"})
      ]})
    ]}),

    // 4. Direktori Jaringan Rekan Personil CAS
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"#fff"},children:"Orang yang Mungkin Anda Kenal"}),
        (0,t.jsx)("span",{style:{fontSize:"1rem"},children:"👮"})
      ]}),
      (0,t.jsx)("div",{style:{display:"grid",gap:"0.85rem"},children:
        defaultPersonnel.slice(0, 3).map(pers => (
          (0,t.jsxs)("div",{key:pers.id,style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[
            (0,t.jsx)("div",{
              style:{width:"36px",height:"36px",borderRadius:"50%",background:"#0f172a",border:"1.5px solid #38bdf8",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.9rem",color:"#fff",flexShrink:0},
              children:pers.name.charAt(0)
            }),
            (0,t.jsxs)("div",{style:{minWidth:0,flex:1},children:[
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.8rem",color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:pers.name}),
              (0,t.jsx)("div",{style:{fontSize:"0.7rem",color:"#38bdf8"},children:'@' + pers.callsign}),
              (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:pers.satker})
            ]}),
            (0,t.jsx)("button",{
              type:"button",
              onClick:() => handleOpenProfilePreview(pers),
              style:{background:"transparent",border:"1px solid rgba(56,189,248,0.4)",color:"#38bdf8",borderRadius:"6px",padding:"0.2rem 0.5rem",fontSize:"0.7rem",fontWeight:700,cursor:"pointer",flexShrink:0},
              children:"Lihat"
            })
          ]})
        ))
      }),
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>{
          setNetworkModal(!0);
          fetchNetworkDirectory(eNetworkSearch, eNetworkSatkerFilter);
        },
        style:{width:"100%",marginTop:"0.85rem",padding:"0.45rem",borderRadius:"8px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#cbd5e1",fontSize:"0.76rem",fontWeight:700,cursor:"pointer",textAlign:"center"},
        children:"Lihat Semua Rekan (4.120+)"
      })
    ]})

  ]})

]}),
`;

// Replace the JSX between heroStart and cardsEnd
content = content.substring(0, heroStart) + completeProfileJSX + content.substring(cardsEnd);

// 6. Hard-guard all dialogs after cardsEnd against isReadOnlyMode
// Dialog Edit Profil:
const oldDialogEdit = '(0,t.jsx)(r.Dialog,{header:"Edit Profil",visible:$,';
const newDialogEdit = '(0,t.jsx)(r.Dialog,{header:"Edit Profil",visible:Boolean($ && !isReadOnlyMode),';
if (!content.includes(oldDialogEdit)) {
  console.error('Could not find oldDialogEdit');
  process.exit(1);
}
content = content.replace(oldDialogEdit, newDialogEdit);

// Dialog Foto Profil:
const oldDialogFoto = '(0,t.jsx)(r.Dialog,{header:"Foto Profil Personel",visible:ePhotoModal,';
const newDialogFoto = '(0,t.jsx)(r.Dialog,{header:"Foto Profil Personel",visible:Boolean(ePhotoModal && !isReadOnlyMode),';
if (content.includes(oldDialogFoto)) {
  content = content.replace(oldDialogFoto, newDialogFoto);
}

// Dialog TOTP:
const oldDialogTotp = 'visible:eTotpModal,';
const newDialogTotp = 'visible:Boolean(eTotpModal && !isReadOnlyMode),';
if (content.includes(oldDialogTotp)) {
  content = content.replace(oldDialogTotp, newDialogTotp);
}

// Dialog Disable:
const oldDialogDisable = 'visible:eDisableModal,';
const newDialogDisable = 'visible:Boolean(eDisableModal && !isReadOnlyMode),';
if (content.includes(oldDialogDisable)) {
  content = content.replace(oldDialogDisable, newDialogDisable);
}

// Dialog Edit Satker:
const oldDialogSatker = 'visible:eO,';
const newDialogSatker = 'visible:Boolean(eO && !isReadOnlyMode),';
if (content.includes(oldDialogSatker)) {
  content = content.replace(oldDialogSatker, newDialogSatker);
}

// Dialog 2FA OTP/PIN:
const oldDialog2fa = 'visible:Q,';
const newDialog2fa = 'visible:Boolean(Q && !isReadOnlyMode),';
if (content.includes(oldDialog2fa)) {
  content = content.replace(oldDialog2fa, newDialog2fa);
}

// Write the output file
const targetFile = 'frontend-patch/3def3ti6rk0vr.linkedin_v5.js';
fs.writeFileSync(targetFile, content, 'utf8');

console.log('Successfully generated ' + targetFile + '! Size: ' + content.length);

// Compile check
cp.execSync('node -c ' + targetFile);
console.log('✓ node -c syntax check passed with 0 errors!');
