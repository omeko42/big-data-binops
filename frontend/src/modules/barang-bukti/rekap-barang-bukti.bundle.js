(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,2114,e=>{"use strict";let a=(0,e.i(56420).default)("gavel",[["path",{d:"m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381",key:"pgg06f"}],["path",{d:"m16 16 6-6",key:"vzrcl6"}],["path",{d:"m21.5 10.5-8-8",key:"a17d9x"}],["path",{d:"m8 8 6-6",key:"18bi4p"}],["path",{d:"m8.5 7.5 8 8",key:"1oyaui"}]]),LIcon=(0,e.i(56420).default)("landmark",[["path",{d:"M10 18v-7",key:"wt116b"}],["path",{d:"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z",key:"yxxwt6"}],["path",{d:"M14 18v-7",key:"vav6t3"}],["path",{d:"M18 18v-7",key:"aexdmj"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M6 18v-7",key:"1ivflk"}]]);e.s(["Gavel",0,a,"Landmark",0,LIcon],2114)},91246,e=>{"use strict";var a=e.i(43476),l=e.i(71645),t=e.i(17580),s=e.i(24718),n=e.i(53729),i=e.i(44080),r=e.i(68242),d=e.i(2114),o=e.i(54858),authBB=e.i(38036);

const BB_LIST_CACHE_PREFIX="bdb-bb-list-v6:",BB_LIST_TTL=24e4,BB_SUMMARY_CACHE_PREFIX="bdb-bb-summary-v6:",BB_SUMMARY_TTL=24e4,BB_LOCAL_OVERRIDES_KEY="cas_rekap_bb_overrides_v1";

function SafeLandmark({size=12,style={}}){
  return(0,a.jsxs)("svg",{
    xmlns:"http://www.w3.org/2000/svg",
    width:size,
    height:size,
    viewBox:"0 0 24 24",
    fill:"none",
    stroke:"currentColor",
    strokeWidth:"2",
    strokeLinecap:"round",
    strokeLinejoin:"round",
    style,
    children:[
      (0,a.jsx)("path",{d:"M10 18v-7"}),
      (0,a.jsx)("path",{d:"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"}),
      (0,a.jsx)("path",{d:"M14 18v-7"}),
      (0,a.jsx)("path",{d:"M18 18v-7"}),
      (0,a.jsx)("path",{d:"M3 22h18"}),
      (0,a.jsx)("path",{d:"M6 18v-7"})
    ]
  });
}

function SafeGavel({size=12,style={}}){
  return(0,a.jsxs)("svg",{
    xmlns:"http://www.w3.org/2000/svg",
    width:size,
    height:size,
    viewBox:"0 0 24 24",
    fill:"none",
    stroke:"currentColor",
    strokeWidth:"2",
    strokeLinecap:"round",
    strokeLinejoin:"round",
    style,
    children:[
      (0,a.jsx)("path",{d:"m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381"}),
      (0,a.jsx)("path",{d:"m16 16 6-6"}),
      (0,a.jsx)("path",{d:"m21.5 10.5-8-8"}),
      (0,a.jsx)("path",{d:"m8 8 6-6"}),
      (0,a.jsx)("path",{d:"m8.5 7.5 8 8"})
    ]
  });
}

/**
 * Standar Master Kategori Jenis Barang Indonesia (Kemendag / BPS / Bareskrim Polri)
 */
const MASTER_JENIS_BARANG_INDONESIA=[
  "Kendaraan Bermotor",
  "Perangkat Elektronik & Komunikasi",
  "Alat Penerangan & Kelistrikan",
  "Hewan & Ternak",
  "Dokumen & Surat Berharga",
  "Uang Tunai & Logam Mulia",
  "Narkotika, Psikotropika & Obat",
  "Senjata Tajam",
  "Senjata Api & Bahan Peledak",
  "Pakaian, Tekstil & Aksesoris",
  "Perkakas, Mesin & Alat Berat",
  "Bahan Bakar, Kimia & Material",
  "Pangan, Pertanian & Perkebunan",
  "Perabotan & Alat Rumah Tangga",
  "Alat Perjudian & Permainan",
  "Barang Bukti Lainnya"
];

/**
 * Standar Satuan Barang Indonesia (Kemendag / BPS / Bareskrim Polri)
 */
const SATUAN_BARANG_INDONESIA=[
  "Buah",
  "Unit",
  "Butir",
  "Batang",
  "Bilah",
  "Pucuk",
  "Lembar",
  "Helai",
  "Berkas / Bundel",
  "Pasang",
  "Set",
  "Paket",
  "Keping",
  "Kotak / Box",
  "Bungkus",
  "Botol",
  "Kaleng",
  "Tabung",
  "Jerigen",
  "Galon",
  "Karung",
  "Sak",
  "Roll / Gulung",
  "Ekor",
  "Gram (g)",
  "Kilogram (Kg)",
  "Kuintal",
  "Ton",
  "Mililiter (mL)",
  "Liter (L)",
  "Meter (m)",
  "Sentimeter (cm)",
  "Meter Persegi (m²)",
  "Hektare (Ha)",
  "Meter Kubik (m³)",
  "Rupiah (Rp)"
];

const CANONICAL_JENIS_SET=new Set(MASTER_JENIS_BARANG_INDONESIA.map(x=>x.toUpperCase()));
const GENERIC_RAW_JENIS_SET=new Set([
  ...MASTER_JENIS_BARANG_INDONESIA.map(x=>x.toUpperCase()),
  "KENDARAAN / RANMOR",
  "ELEKTRONIK / DIGITAL",
  "UANG / BUKTI KEUANGAN",
  "DOKUMEN / SURAT",
  "DOKUMEN KEUANGAN",
  "NARKOTIKA / OBAT",
  "NARKOTIKA / OBAT TERLARANG",
  "SENJATA / TAJAM",
  "SENJATA API / AMUNISI",
  "PAKAIAN / BARANG PRIBADI",
  "PERANGKAT ELEKTRONIK",
  "ALAT / PERKAKAS",
  "BBM / MIGAS",
  "BARANG BUKTI UMUM",
  "BARANG BUKTI FISIK",
  "BARANG BUKTI LAINNYA",
  "TIDAK DIKETAHUI",
  "LAIN-LAIN",
  "LAINNYA",
  "NIHIL",
  "NULL",
  "-",
  "—"
]);

function safeTodayWib(){
  try{
    return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Jakarta"}).format(new Date());
  }catch{
    try{return new Date().toISOString().slice(0,10)}catch{return"2026-12-31"}
  }
}

const ANIMAL_KEYWORDS_RE=/\b(sapi|kerbau|kambing|domba|ayam|unggas|bebek|itik|anjing|kucing|burung|merpati|murai|babi|kuda|ikan|udang|benur|bibit\s*lobster|lobster|ternak|hewan|satwa|binatang|trenggiling|gajah|harimau|orangutan|rusa|ular|buaya|penyu)\b/i;
const NARKOTIKA_KEYWORDS_RE=/\b(sabu|shabu|metamfetamina|ganja|kanabis|ekstasi|inex|narkotika|narkoba|psikotropika|heroin|kokain|tembakau\s*gorila|sinte|double\s*l|tramadol|hexymer|trihexyphenidyl|dextro|carnophen|zenith|yarindo|alprazolam|riklona|dumolid|serbuk\s*kristal|kristal\s*putih|pil\s*koplo|obat\s*keras|miras|minuman\s*keras|alkohol|ciu\b|tuak|cap\s*tikus|anggur\s*merah|botol\s*minuman|bong\b|pipet|pirex)\b/i;

function detectCategoryFromKeywords(txtInput){
  let txt=String(txtInput||"").toLowerCase().trim();
  if(!txt)return"";
  if(NARKOTIKA_KEYWORDS_RE.test(txt)||/\b(\bpil\b|\bobat\b)\b/i.test(txt)){
    return"Narkotika, Psikotropika & Obat";
  }
  if(/\b(pistol|revolver|senapan|laras\s*panjang|senjata\s*api|senpi|airsoft|airgun|amunisi|peluru|proyektil|selongsong|magasin|bom\b|bahan\s*peledak|handak|detonator|mesiu|petasan|mercon|granat)\b/i.test(txt)){
    return"Senjata Api & Bahan Peledak";
  }
  if(/\b(parang|celurit|clurit|pisau|golok|badik|pedang|samurai|katana|keris|klewang|mandau|sabit|arit|tombak|kujang|belati|sangkur|kapak|kampak|anak\s*panah|busur\s*panah|ketapel|senjata\s*tajam|sajam)\b/i.test(txt)){
    return"Senjata Tajam";
  }
  if(/\b(sepeda\s*motor|\bmotor\b|\bmobil\b|\btruk\b|pikap|pick\s*up|stnk|bpkb|nopol|plat\s*nomor|yamaha|honda|toyota|suzuki|kawasaki|daihatsu|mitsubishi|vespa|nmax|vario|beat|scoopy|avanza|xenia|innova|pajero|fortuner|brio|sigra|calya|kendaraan|ranmor)\b/i.test(txt)){
    return"Kendaraan Bermotor";
  }
  if(/\b(handphone|\bhp\b|iphone|samsung|xiaomi|oppo|vivo|realme|infinix|nokia|telepon|imei|sim\s*card|simcard|laptop|komputer|\bpc\b|monitor|televisi|\btv\b|flashdisk|harddisk|ssd|microsd|memory\s*card|cctv|dvr|modem|router|printer|kamera|drone|elektronik|digital)\b/i.test(txt)){
    return"Perangkat Elektronik & Komunikasi";
  }
  if(/\b(uang|rupiah|\brp\b|tunai|dollar|\busd\b|mata\s*uang|emas\b|perak\b|berlian|permata|perhiasan|cincin|kalung|gelang|anting|liontin|logam\s*mulia|antam|kartu\s*atm|kartu\s*kredit|kartu\s*debit|e-money|flazz|brizzi)\b/i.test(txt)){
    return"Uang Tunai & Logam Mulia";
  }
  if(/\b(sertifikat|\bshm\b|\bshgb\b|\bsurat\b|\bktp\b|\bkk\b|kartu\s*keluarga|akta|ijazah|paspor|\bsim\b|buku\s*tabungan|rekening|mutasi|kwitansi|kuitansi|\bnota\b|faktur|invoice|struk|bilyet|\bcek\b|giro|dokumen|polis|kontrak|perjanjian|skep|berkas|arsip|bukti\s*transfer)\b/i.test(txt)){
    return"Dokumen & Surat Berharga";
  }
  if(/\b(kartu\s*remi|domino|gaple|ceki|dadu|koprok|kupon\s*togel|togel|toto\s*gelap|rekapan\s*togel|tafsir\s*mimpi|mesin\s*judi|dingdong|slot\b|chip\s*judi|bilyar|billiard|sabung\s*ayam|alat\s*perjudian|\bjudi\b)\b/i.test(txt)){
    return"Alat Perjudian & Permainan";
  }
  if(/\b(senter|lampu|bohlam|led|kabel\s*listrik|saklar|stop\s*kontak|steker|aki\b|accu\b|baterai|genset|generator|trafo|inverter|kwh|meteran\s*listrik|alat\s*penerangan|kelistrikan)\b/i.test(txt)){
    return"Alat Penerangan & Kelistrikan";
  }
  if(/\b(solar|biosolar|pertalite|pertamax|\bbbm\b|bensin|minyak\s*tanah|avtur|\boli\b|pelumas|aspal|\bgas\b|elpiji|lpg|pupuk|urea|phonska|npk|pestisida|herbisida|sianida|merkuri|air\s*raksa|asam\s*sulfat|bahan\s*kimia|semen|\bbesi\b|baja|tembaga|aluminium|seng|\bkayu\b|balok|papan|rotan|pasir|\bbatu\b|kerikil|batubara|nikel|timah|bauksit|tambang|material)\b/i.test(txt)){
    return"Bahan Bakar, Kimia & Material";
  }
  if(/\b(beras|gabah|padi|gula|minyak\s*goreng|migor|tepung|terigu|daging|telur|susu|garam|bawang|cabai|kedelai|jagung|kopi|kakao|karet|lateks|kelapa\s*sawit|sawit|\btbs\b|tandan\s*buah|berondolan|\bcpo\b|cengkeh|pala|lada|merica|tembakau|rokok|cerutu|makanan|minuman|sembako|pangan|pertanian|perkebunan)\b/i.test(txt)){
    return"Pangan, Pertanian & Perkebunan";
  }
  if(/\b(kunci\s*t|kunci\s*l|kunci\s*inggris|kunci\s*pas|\bkunci\b|obeng|\btang\b|\bpalu\b|martil|linggis|gergaji|chainsaw|senso|\bbor\b|gerinda|mesin|pompa|kompresor|dinamo|ekskavator|excavator|bulldozer|loader|crane|traktor|alat\s*berat|timbangan|gunting|cangkul|sekop|dodos|egrek|tojok|angkong|perkakas)\b/i.test(txt)){
    return"Perkakas, Mesin & Alat Berat";
  }
  if(/\b(baju|kaos|kemeja|celana|jeans|jaket|hoodie|sweater|daster|gamis|kerudung|jilbab|hijab|mukena|sarung|batik|\bkain\b|tekstil|handuk|selendang|pakaian|helm\b|\btas\b|ransel|dompet|koper|sepatu|sandal|topi|ikat\s*pinggang|sabuk|kacamata|jam\s*tangan|arloji)\b/i.test(txt)){
    return"Pakaian, Tekstil & Aksesoris";
  }
  if(/\b(kursi|sofa|meja|lemari|bufet|\brak\b|kasur|matras|bantal|guling|sprei|selimut|karpet|tikar|terpal|gorden|kompor|panci|wajan|piring|gelas|sendok|termos|dispenser|kulkas|mesin\s*cuci|kipas\s*angin|setrika|blender|magic\s*com|rice\s*cooker|ember|baskom|gayung|galon|tabung|jerigen|drum|tandon|toren|keranjang|karung|goni|\bsak\b|plastik|kardus|karton|kotak|\bbox\b|peti|botol|kaleng|perabotan|rumah\s*tangga)\b/i.test(txt)){
    return"Perabotan & Alat Rumah Tangga";
  }
  if(ANIMAL_KEYWORDS_RE.test(txt)){
    return"Hewan & Ternak";
  }
  return"";
}

/**
 * Klasifikasi & Normalisasi Jenis Barang ke 16 Kategori Standar Indonesia
 * sekaligus menjaga deskripsi spesifik pada Nama / Detail Barang.
 */
function classifyJenisBarang(rawJenisInput,rawNamaInput){
  let rawJ=String(rawJenisInput??"").trim(),
      rawN=String(rawNamaInput??"").trim();
  if(["-","—","null","NULL","undefined","TIDAK DIKETAHUI","NIHIL"].includes(rawJ))rawJ="";
  if(["-","—","null","NULL","undefined"].includes(rawN))rawN="";

  let exactMatch=MASTER_JENIS_BARANG_INDONESIA.find(c=>c.toUpperCase()===rawJ.toUpperCase())||"";
  let fromNama=rawN?detectCategoryFromKeywords(rawN):"";
  let nonGenericRawJ=exactMatch===""?rawJ:"";
  let fromJenis=nonGenericRawJ?detectCategoryFromKeywords(nonGenericRawJ):"";

  let category="";
  if(NARKOTIKA_KEYWORDS_RE.test(rawN)||NARKOTIKA_KEYWORDS_RE.test(rawJ)){
    category="Narkotika, Psikotropika & Obat";
  }else if(fromNama){
    category=fromNama;
  }else if(fromJenis){
    category=fromJenis;
  }else if(exactMatch){
    if(exactMatch==="Hewan & Ternak"&&rawN&&!ANIMAL_KEYWORDS_RE.test(rawN)){
      category="Barang Bukti Lainnya";
    }else{
      category=exactMatch;
    }
  }else{
    category="Barang Bukti Lainnya";
  }

  if(category==="Hewan & Ternak"){
    let checkAnimalText=rawN||(exactMatch===""?rawJ:"");
    if(!ANIMAL_KEYWORDS_RE.test(checkAnimalText)){
      category=fromNama||fromJenis||"Barang Bukti Lainnya";
      if(category==="Hewan & Ternak")category="Barang Bukti Lainnya";
    }
  }

  let isGenericRaw=!rawJ||GENERIC_RAW_JENIS_SET.has(rawJ.toUpperCase())||/^hewan\s*&?\s*ternak$/i.test(rawJ);
  let cleanRawJ=rawJ.replace(/^\d+(?:[.,]\d+)?\s*(?:buah|bh|pcs|biji|unit|butir|btr|batang|btg|bilah|pucuk|lembar|lbr|helai|potong|ptg|berkas|bundel|bundle|pasang|psg|set|paket|keping|kotak|box|dus|kardus|bungkus|bks|slop|pak|pack|sachet|klip|botol|btl|kaleng|klg|tabung|tbg|jerigen|jrgn|jergen|galon|karung|krg|sak|zak|roll|gulung|ekor|gram|gr|g|kilogram|kg|kilo|kuintal|kwintal|ton|mililiter|ml|liter|ltr|l|meter|mtr|m|sentimeter|cm|hektare|hektar|ha)\b\s*/i,"").trim()||rawJ;
  let detail="";
  if(!isGenericRaw){
    if(!rawN){
      detail=cleanRawJ;
    }else if(rawN.toLowerCase().includes(cleanRawJ.toLowerCase())||rawN.toLowerCase().includes(rawJ.toLowerCase())){
      detail=rawN;
    }else{
      detail=cleanRawJ+" — "+rawN;
    }
  }else{
    detail=rawN||"—";
  }

  return{
    jenis:category||"Barang Bukti Lainnya",
    detail:detail||"—"
  };
}

function classifyBbJenis(row){
  if(!row||typeof row!=="object")return"Barang Bukti Lainnya";
  return classifyJenisBarang(row.jenis_barang||row.jenis,row.nama_barang||row.keterangan).jenis;
}

function readLocalBbOverrides(){
  if(typeof window==="undefined")return{};
  try{
    let raw=localStorage.getItem(BB_LOCAL_OVERRIDES_KEY);
    if(!raw)return{};
    let parsed=JSON.parse(raw);
    if(!parsed||typeof parsed!=="object")return{};
    let cleaned={},dirty=!1;
    for(let[k,ov]of Object.entries(parsed)){
      if(!ov||typeof ov!=="object"){dirty=!0;continue}
      let next={...ov},
          ket=String(next.keterangan||next.nama_barang||"").trim(),
          jns=String(next.jenis||next.jenis_barang||"").trim(),
          sat=String(next.satuan||"").trim(),
          hasAnimal=ANIMAL_KEYWORDS_RE.test(ket)||(ket===""&&ANIMAL_KEYWORDS_RE.test(jns)&&!/^hewan\s*&?\s*ternak$/i.test(jns));
      if(/^hewan\s*&?\s*ternak$/i.test(jns)&&!hasAnimal){
        delete next.jenis;
        delete next.jenis_barang;
        dirty=!0;
      }
      if(/^ekor$/i.test(sat)&&!hasAnimal){
        delete next.satuan;
        dirty=!0;
      }
      let meaningfulKeys=Object.keys(next).filter(x=>x!=="updatedAt"&&next[x]!==undefined&&next[x]!=="");
      if(meaningfulKeys.length>0){
        cleaned[k]=next;
      }else{
        dirty=!0;
      }
    }
    if(dirty){
      try{localStorage.setItem(BB_LOCAL_OVERRIDES_KEY,JSON.stringify(cleaned))}catch{}
    }
    return cleaned;
  }catch{
    return{};
  }
}

function loadBbOverrides(){
  return readLocalBbOverrides();
}

function saveBbOverride(key,data){
  if(typeof window==="undefined"||!key)return;
  try{
    let cur=readLocalBbOverrides();
    cur[String(key)]={...(cur[String(key)]||{}),...data,updatedAt:Date.now()};
    localStorage.setItem(BB_LOCAL_OVERRIDES_KEY,JSON.stringify(cur));
  }catch{}
}

function getRowOverrideKey(row){
  if(!row||typeof row!=="object")return"";
  if(row.row_id!=null&&String(row.row_id).trim()!=="")return String(row.row_id).trim();
  if(row.id!=null&&String(row.id).trim()!=="")return String(row.sumber||"ROW").toUpperCase()+"-"+String(row.id).trim();
  return `${row.sumber||"ROW"}:${row.lp_id||0}:${String(row.jenis||"").slice(0,30)}:${String(row.keterangan||"").slice(0,40)}`;
}

function matchSatuanIndonesia(rawUnit){
  let u=String(rawUnit||"").trim();
  if(!u)return"";
  let low=u.toLowerCase();
  let exact=SATUAN_BARANG_INDONESIA.find(s=>s.toLowerCase()===low);
  if(exact)return exact;
  let map={
    "bh":"Buah","buah":"Buah","pcs":"Buah","biji":"Buah",
    "unit":"Unit",
    "btr":"Butir","butir":"Butir","tablet":"Butir","pil":"Butir","kapsul":"Butir",
    "btg":"Batang","batang":"Batang",
    "bilah":"Bilah",
    "pucuk":"Pucuk",
    "lbr":"Lembar","lembar":"Lembar",
    "helai":"Helai","potong":"Helai","ptg":"Helai",
    "berkas":"Berkas / Bundel","bundel":"Berkas / Bundel","bundle":"Berkas / Bundel","buku":"Berkas / Bundel",
    "pasang":"Pasang","psg":"Pasang",
    "set":"Set",
    "paket":"Paket",
    "keping":"Keping",
    "kotak":"Kotak / Box","box":"Kotak / Box","dus":"Kotak / Box","kardus":"Kotak / Box",
    "bungkus":"Bungkus","bks":"Bungkus","slop":"Bungkus","pak":"Bungkus","pack":"Bungkus","sachet":"Bungkus","klip":"Bungkus","poket":"Bungkus",
    "botol":"Botol","btl":"Botol",
    "kaleng":"Kaleng","klg":"Kaleng",
    "tabung":"Tabung","tbg":"Tabung",
    "jerigen":"Jerigen","jrgn":"Jerigen","jergen":"Jerigen",
    "galon":"Galon",
    "karung":"Karung","krg":"Karung",
    "sak":"Sak","zak":"Sak",
    "roll":"Roll / Gulung","gulung":"Roll / Gulung",
    "ekor":"Ekor",
    "g":"Gram (g)","gr":"Gram (g)","gram":"Gram (g)",
    "kg":"Kilogram (Kg)","kilogram":"Kilogram (Kg)","kilo":"Kilogram (Kg)",
    "kuintal":"Kuintal","kwintal":"Kuintal","kw":"Kuintal",
    "ton":"Ton",
    "ml":"Mililiter (mL)","mililiter":"Mililiter (mL)",
    "l":"Liter (L)","ltr":"Liter (L)","liter":"Liter (L)",
    "m":"Meter (m)","mtr":"Meter (m)","meter":"Meter (m)",
    "cm":"Sentimeter (cm)","sentimeter":"Sentimeter (cm)","centimeter":"Sentimeter (cm)",
    "m2":"Meter Persegi (m²)","m²":"Meter Persegi (m²)","meter persegi":"Meter Persegi (m²)",
    "ha":"Hektare (Ha)","hektar":"Hektare (Ha)","hektare":"Hektare (Ha)",
    "m3":"Meter Kubik (m³)","m³":"Meter Kubik (m³)","kubik":"Meter Kubik (m³)","meter kubik":"Meter Kubik (m³)",
    "rp":"Rupiah (Rp)","rupiah":"Rupiah (Rp)","idr":"Rupiah (Rp)"
  };
  return map[low]||u;
}

function inferUnitFromNamaAndJenis(rawNama,jenisMaster,numStr,rawJmlStr){
  let txt=String(rawNama||"").toLowerCase(),
      jMaster=String(jenisMaster||""),
      isDec=/^-?\d+\.\d+$/.test(String(numStr||""))||String(rawJmlStr||"").includes(",");
  if(jMaster==="Narkotika, Psikotropika & Obat"||NARKOTIKA_KEYWORDS_RE.test(txt)){
    if(/\b(kilogram|kg\b|kilo)\b/i.test(txt))return"Kilogram (Kg)";
    if(/\b(gram|gr\b|berat|brutto|netto)\b/i.test(txt)||isDec)return"Gram (g)";
    if(/\b(butir|btr|tablet|pil|kapsul)\b/i.test(txt))return"Butir";
    if(/\b(sachet|paket|bungkus|bks|klip|poket|pak|pack|slop)\b/i.test(txt))return"Bungkus";
    if(/\b(botol|btl)\b/i.test(txt))return"Botol";
    if(/\b(batang|btg|linting)\b/i.test(txt))return"Batang";
    return"";
  }
  if(/\b(gram|gr\b)\b/i.test(txt))return"Gram (g)";
  if(/\b(kilogram|kg\b)\b/i.test(txt))return"Kilogram (Kg)";
  if(/\b(butir|tablet|kapsul)\b/i.test(txt))return"Butir";
  if(/\b(sachet|bungkus|klip|poket)\b/i.test(txt))return"Bungkus";
  if(/\b(bilah)\b/i.test(txt))return"Bilah";
  if(/\b(pucuk)\b/i.test(txt))return"Pucuk";
  if(/\b(lembar|lbr)\b/i.test(txt))return"Lembar";
  if(/\b(berkas|bundel)\b/i.test(txt))return"Berkas / Bundel";
  if(/\b(botol|btl)\b/i.test(txt))return"Botol";
  if(/\b(karung|krg)\b/i.test(txt))return"Karung";
  if(/\b(unit)\b/i.test(txt))return"Unit";
  return"";
}

function parseJumlahSatuan(arg1,arg2,arg3,arg4){
  let rawJml="",rawSat="",rawNama="",jenisMaster="";
  if(arg1&&typeof arg1==="object"){
    let row=arg1,
        overridesMap=arg2,
        key=getRowOverrideKey(row),
        ov=overridesMap&&key?overridesMap[key]:null;
    rawJml=ov?.jumlah!==undefined?ov.jumlah:(row.jumlah_angka!==undefined?row.jumlah_angka:row.jumlah);
    rawSat=ov?.satuan!==undefined?ov.satuan:(row.satuan||"");
    let rJenis=ov?.jenis??row.jenis_barang??row.jenis??"",
        rKet=ov?.keterangan??row.nama_barang??row.keterangan??"";
    let cls=classifyJenisBarang(rJenis,rKet);
    jenisMaster=cls.jenis;
    rawNama=(String(rKet)+" "+String(cls.detail||"")+" "+String(row.jenis_barang||row.jenis||"")).trim();
  }else{
    rawJml=arg1;
    rawSat=arg2;
    rawNama=String(arg3??"");
    jenisMaster=String(arg4??"")||(rawNama?classifyJenisBarang("",rawNama).jenis:"");
  }

  let sJml=String(rawJml??"").trim(),
      sSat=matchSatuanIndonesia(rawSat),
      numOut="";

  if(sJml&&sJml!=="-"&&sJml!=="—"&&sJml.toLowerCase()!=="null"){
    if(/^-?\d+(?:[.,]\d+)?$/.test(sJml)){
      numOut=sJml.replace(",",".");
    }else{
      let m=sJml.match(/^(-?\d+(?:[.,]\d+)?)\s+(.+)$/);
      if(m){
        numOut=m[1].replace(",",".");
        let unitPart=matchSatuanIndonesia(m[2]);
        if(!sSat)sSat=unitPart;
      }else{
        let numExtract=sJml.match(/-?\d+(?:[.,]\d+)?/);
        if(numExtract){
          numOut=numExtract[0].replace(",",".");
          let rest=sJml.replace(numExtract[0],"").replace(/[()]/g,"").trim();
          if(!sSat&&rest)sSat=matchSatuanIndonesia(rest);
        }else{
          numOut=sJml;
        }
      }
    }
  }

  if(/^ekor$/i.test(String(sSat||"").trim())){
    if(jenisMaster!=="Hewan & Ternak"||(rawNama&&!ANIMAL_KEYWORDS_RE.test(rawNama))){
      sSat="";
    }
  }

  if(!sSat){
    sSat=inferUnitFromNamaAndJenis(rawNama,jenisMaster,numOut,sJml);
  }

  return{jumlah:numOut,satuan:sSat};
}

function normalizeSatkerNameForRbac(s){
  return String(s||"")
    .toUpperCase()
    .replace(/\bDIT\s*RESKRIMUM\b/g,"DITKRIMUM")
    .replace(/\bDIT\s*KRIMUM\b/g,"DITKRIMUM")
    .replace(/\bDIT\s*RESKRIMSUS\b/g,"DITKRIMSUS")
    .replace(/\bDIT\s*KRIMSUS\b/g,"DITKRIMSUS")
    .replace(/\bDIT\s*RESNARKOBA\b/g,"DITNARKOBA")
    .replace(/\bDIT\s*NARKOBA\b/g,"DITNARKOBA")
    .replace(/\bDIT\s*RESSIBER\b/g,"DITSIBER")
    .replace(/\bDIT\s*SIBER\b/g,"DITSIBER")
    .replace(/\bSAT\s*RESKRIM\b/g,"SATRESKRIM")
    .replace(/\bSAT\s*RESNARKOBA\b/g,"SATNARKOBA")
    .replace(/\bSAT\s*NARKOBA\b/g,"SATNARKOBA")
    .replace(/[^A-Z0-9]+/g," ")
    .trim();
}

function getUserInfo(){
  try{
    let u=(0,authBB.getUser)();
    if(!u&&typeof window!=="undefined"){
      let raw=localStorage.getItem("cas_auth_session")||localStorage.getItem("cas_user")||localStorage.getItem("user");
      if(raw){
        let parsed=JSON.parse(raw);
        u=parsed?.user||parsed;
      }
    }
    if(!u||typeof u!=="object")return null;
    let roles=(0,authBB.deriveRoles)(u)||{};
    let roleStr=String(u.role||u.role_name||u.level||roles.role||roles.label||"").trim().toLowerCase();
    let isSuperadmin=Boolean(
      roles.isSuperadmin||
      roles.isSuperAdmin||
      u.is_superadmin||
      u.isSuperAdmin||
      roleStr==="superadmin"||
      roleStr==="super_admin"||
      roleStr==="super admin"
    );
    let isViewer=Boolean(roles.isViewer||roleStr==="viewer");
    return{
      ...u,
      role:roleStr,
      isSuperadmin,
      isSuperAdmin:isSuperadmin,
      isViewer,
      satker_id:u.satker_id??u.satkerId??u.satker?.id??null,
      unit_satker_id:u.unit_satker_id??u.unitSatkerId??u.unit_id??u.unitId??null,
      satker_nama:u.satker_nama??u.satkerNama??u.satker?.nama??u.satker?.deskripsi??"",
      unit_satker_nama:u.unit_satker_nama??u.unitSatkerNama??u.unit_nama??""
    };
  }catch{
    return null;
  }
}

function canUserModifyBbItem(item,currentUser){
  if(!item||typeof item!=="object")return!1;
  let u=currentUser!==undefined?currentUser:getUserInfo();
  if(!u||typeof u!=="object")return!1;
  if(u.isViewer)return!1;
  let roleStr=String(u.role||u.role_name||"").trim().toLowerCase();
  if(u.isSuperadmin||u.isSuperAdmin||roleStr==="superadmin"||roleStr==="super_admin")return!0;
  if(item.can_edit===!1||item.is_read_only===!0)return!1;

  let userSatkerIds=[u.satker_id,u.satkerId,u.unit_satker_id,u.unitSatkerId]
    .map(v=>v==null||v===""?NaN:Number(v))
    .filter(n=>Number.isFinite(n)&&n>0);
  let itemSatkerIds=[item.satker_id,item.satkerId,item.unit_satker_id,item.unitSatkerId,item.lp_satker_id]
    .map(v=>v==null||v===""?NaN:Number(v))
    .filter(n=>Number.isFinite(n)&&n>0);

  if(userSatkerIds.length>0&&itemSatkerIds.length>0){
    return itemSatkerIds.some(id=>userSatkerIds.includes(id));
  }

  let userNames=[u.satker_nama,u.satkerNama,u.unit_satker_nama,u.unitSatkerNama]
    .map(normalizeSatkerNameForRbac)
    .filter(Boolean);
  let itemNames=[item.satker_nama,item.satkerNama,item.unit_satker_nama,item.unitSatkerNama]
    .map(normalizeSatkerNameForRbac)
    .filter(Boolean);

  if(userNames.length>0&&itemNames.length>0){
    return itemNames.some(inm=>userNames.includes(inm));
  }

  return!1;
}

function bbCacheIdentity(){
  try{
    let e=(0,authBB.getUser)();
    if(!e)return null;
    let a=String(e?.id??"").trim(),
        l=String(e?.email||"").trim();
    if(!a&&!l)return null;
    let t=(0,authBB.deriveRoles)(e);
    return{user:String(a)+"|"+String(l),role:String(t?.label||"")};
  }catch{
    return null;
  }
}

function bbListCacheKey(e,a,l){
  try{
    let t=bbCacheIdentity();
    if(!t||!e)return null;
    return BB_LIST_CACHE_PREFIX+JSON.stringify({
      user:t.user,
      role:t.role,
      page:Number(a||1),
      row:Number(l||25),
      filter:{
        search:e.search||"",
        status:e.status||"ALL",
        sumber:e.sumber||"ALL",
        from:e.from||"",
        to:e.to||"",
        satker_id:e.satker_id??null
      }
    });
  }catch{
    return null;
  }
}

function bbSummaryCacheKey(e){
  try{
    let a=bbCacheIdentity();
    if(!a||!e)return null;
    return BB_SUMMARY_CACHE_PREFIX+JSON.stringify({
      user:a.user,
      role:a.role,
      filter:{
        search:e.search||"",
        from:e.from||"",
        to:e.to||"",
        satker_id:e.satker_id??null
      }
    });
  }catch{
    return null;
  }
}

function clearBbSessionCaches(){
  if(typeof window==="undefined")return;
  try{
    let keys=[];
    for(let idx=0;idx<sessionStorage.length;idx++){
      let k=sessionStorage.key(idx);
      if(k&&(k.startsWith("bdb-bb-list-")||k.startsWith("bdb-bb-summary-")))keys.push(k);
    }
    keys.forEach(k=>sessionStorage.removeItem(k));
  }catch{}
}

function bbMonthRange(e,a){
  let l=Number(e)||new Date().getFullYear(),
      t=Math.min(12,Math.max(1,Number(a)||1)),
      s=String(t).padStart(2,"0"),
      n=new Date(l,t,0),
      i=String(n.getDate()).padStart(2,"0"),
      lbl=`${s}/${l}`;
  try{
    lbl=new Date(l,t-1,1).toLocaleDateString("id-ID",{month:"long",year:"numeric"});
  }catch{}
  return{from:`${l}-${s}-01`,to:`${l}-${s}-${i}`,label:lbl,month:t,year:l};
}

function bbDefaultPeriod(){
  let y=new Date().getFullYear();
  return{from:y+"-01-01",to:y+"-12-31",label:"Tahun "+y,month:1,year:y};
}

function bbMonthOptions(){
  return Array.from({length:12},(e,a)=>{
    let lbl="Bulan "+(a+1);
    try{lbl=new Date(2000,a,1).toLocaleDateString("id-ID",{month:"long"})}catch{}
    return{label:lbl,value:a+1};
  });
}

function bbYearOptions(){
  let e=new Date().getFullYear(),a=[];
  for(let l=e;l>=2000;l--)a.push({label:String(l),value:l});
  return a;
}

function bbDateLabel(e){
  if(!e)return"";
  try{
    let a=new Date(String(e).slice(0,10)+"T00:00:00Z");
    return isNaN(a.getTime())?String(e):a.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"});
  }catch{
    return String(e);
  }
}

function normalizeScopeOptions(rawList){
  if(!Array.isArray(rawList))return[];
  let out=[],seen=new Set();
  for(let item of rawList){
    if(!item||typeof item!=="object")continue;
    let rawVal=item.value!==undefined?item.value:item.id;
    if(rawVal===undefined||rawVal===null||rawVal==="")continue;
    let numVal=Number(rawVal);
    if(!Number.isFinite(numVal)||numVal<=0||seen.has(numVal))continue;
    let lbl=String(item.label??item.nama??item.name??item.satker_nama??`Satker #${numVal}`).trim();
    if(!lbl)continue;
    seen.add(numVal);
    out.push({label:lbl,value:numVal});
  }
  return out;
}

function bbResolveTotal(summary,statusFilter,sourceFilter,metaTotal,page,row,dataLen,hasNext){
  if(metaTotal!=null&&Number.isFinite(Number(metaTotal))&&Number(metaTotal)>=0){
    return Number(metaTotal);
  }
  if(summary&&typeof summary==="object"){
    let st=String(statusFilter||"ALL").toUpperCase(),
        sb=String(sourceFilter||"ALL").toUpperCase(),
        val=null;
    if(sb==="DORS"&&st==="ALL")val=summary.dors;
    else if(sb==="MANUAL"&&st==="ALL")val=summary.manual;
    else if(st==="MASUK"&&sb==="ALL")val=summary.masuk;
    else if(st==="KELUAR"&&sb==="ALL")val=summary.keluar;
    else if(st==="ALL"&&sb==="ALL")val=summary.semua;
    if(val!=null&&Number.isFinite(Number(val))&&Number(val)>=0){
      return Math.max(Number(val),(Number(page||1)-1)*Number(row||25)+(Number(dataLen)||0));
    }
  }
  return Math.max(0,(Number(page||1)-1)*Number(row||25)+(Number(dataLen)||0)+(hasNext?1:0));
}

function renderSatkerCell(e){
  if(!e||typeof e!=="object")return"—";
  let n=e.unit_satker_nama;
  if(!n){
    let un=String(e.unit_nama||"").trim(),
        sn=String(e.satker_nama||"").trim();
    if(!un)n=sn;
    else if(!sn)n=un;
    else{
      let nu=un.toLowerCase().replace(/[^a-z0-9]/g,""),
          ns=sn.toLowerCase().replace(/[^a-z0-9]/g,"");
      n=nu.includes(ns)?un:ns.includes(nu)?sn:`${un} ${sn}`;
    }
  }
  let fullN=String(n||"").trim();
  if(n){
    if(typeof window!=="undefined"&&typeof window.casCompactSatker==="function"){
      try{n=window.casCompactSatker(n)}catch{}
    }else{
      n=String(n)
        .replace(/\bSAT\s+RESKRIM\b/gi,"SATRESKRIM")
        .replace(/\bSAT\s+RESNARKOBA\b/gi,"SATNARKOBA")
        .replace(/\bSAT\s+NARKOBA\b/gi,"SATNARKOBA")
        .replace(/\bDIT\s+RESKRIMUM\b/gi,"DITKRIMUM")
        .replace(/\bDIT\s+KRIMUM\b/gi,"DITKRIMUM")
        .replace(/\bDIT\s+RESKRIMSUS\b/gi,"DITKRIMSUS")
        .replace(/\bDIT\s+KRIMSUS\b/gi,"DITKRIMSUS")
        .replace(/\bDIT\s+RESNARKOBA\b/gi,"DITNARKOBA")
        .replace(/\bDIT\s+NARKOBA\b/gi,"DITNARKOBA")
        .replace(/\bDIT\s+RESSIBER\b/gi,"DITSIBER")
        .replace(/\bDIT\s+SIBER\b/gi,"DITSIBER")
        .replace(/\b(?:POLRESTRO|(?:POLRES|RES)\s+METRO(?=\s+(?:JAKARTA|JAKPUS|JAKBAR|JAKTIM|JAKSEL|JAKUT|BEKASI|DEPOK|TANGERANG|BANDARA|SOETTA|SOEKARNO|PELABUHAN|TANJUNG|TJ\b|KEPULAUAN|KEP\b)))\b/gi,"RESTRO")
        .replace(/\bPOLRESTABES\b/gi,"RESTABES")
        .replace(/\bPOLRESTA\b/gi,"RESTA")
        .replace(/\bPOLRES\b/gi,"RES")
        .replace(/\bPOLSEKTA\b/gi,"SEKTA")
        .replace(/\bPOLSEK\b/gi,"SEK");
    }
  }
  return(0,a.jsxs)("div",{
    title:fullN||void 0,
    style:{
      display:"flex",
      alignItems:"flex-start",
      gap:"0.3rem",
      fontWeight:600,
      fontSize:"0.73rem",
      lineHeight:1.3,
      color:"var(--cas-text-primary, #0f172a)",
      width:"100%",
      minWidth:0
    },
    children:[
      (0,a.jsx)(SafeLandmark,{size:12,style:{color:"#f87171",flex:"0 0 auto",marginTop:"0.12rem"}}),
      (0,a.jsx)("span",{
        style:{
          display:"-webkit-box",
          WebkitLineClamp:2,
          WebkitBoxOrient:"vertical",
          overflow:"hidden",
          textOverflow:"ellipsis",
          wordBreak:"break-word",
          minWidth:0,
          flex:"1 1 auto"
        },
        children:n||"—"
      })
    ]
  });
}

function renderTindakPidanaCell(e){
  if(!e||typeof e!=="object"||!e.dugaan_tindak_pidana){
    return(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)"},children:"—"});
  }
  let parts=String(e.dugaan_tindak_pidana).split("; ").map(x=>x.trim()).filter(Boolean),
      crimes=[],
      pasals=[],
      seenC=new Set(),
      seenP=new Set();
  for(let item of parts){
    let[t,s]=item.split(" — "),
        c=String(t||"").trim(),
        p=String(s||"").trim();
    if(c){
      let ck=c.toLowerCase();
      if(!seenC.has(ck)){seenC.add(ck);crimes.push(c)}
    }
    if(p){
      let cleanP=p.replace(/^Pasal\s+/i,"").trim(),
          pk=cleanP.toLowerCase();
      if(cleanP&&!seenP.has(pk)){seenP.add(pk);pasals.push("Pasal "+cleanP)}
    }
  }
  let crimeFull=crimes.join(", ")||"—",
      pasalFull=pasals.join(", ");
  return(0,a.jsxs)("div",{
    title:crimeFull+(pasalFull?" — "+pasalFull:""),
    style:{
      display:"flex",
      flexDirection:"column",
      gap:"0.14rem",
      lineHeight:1.25,
      minWidth:0,
      width:"100%",
      overflow:"hidden"
    },
    children:[
      (0,a.jsxs)("div",{
        style:{display:"flex",alignItems:"center",gap:"0.28rem",minWidth:0,width:"100%"},
        children:[
          (0,a.jsx)(SafeGavel,{size:12,style:{color:"#b45309",flex:"0 0 auto"}}),
          (0,a.jsx)("span",{
            style:{
              fontWeight:600,
              fontSize:"0.73rem",
              overflow:"hidden",
              textOverflow:"ellipsis",
              whiteSpace:"nowrap",
              display:"block",
              minWidth:0,
              flex:"1 1 auto"
            },
            children:crimeFull
          })
        ]
      }),
      pasalFull&&(0,a.jsx)("div",{
        style:{paddingLeft:"0.95rem",minWidth:0,width:"100%"},
        children:(0,a.jsx)("span",{
          style:{
            display:"block",
            maxWidth:"100%",
            fontSize:"0.67rem",
            color:"#b45309",
            background:"#fffbeb",
            border:"1px solid #fde68a",
            borderRadius:4,
            padding:"0.02rem 0.35rem",
            overflow:"hidden",
            textOverflow:"ellipsis",
            whiteSpace:"nowrap"
          },
          children:pasalFull
        })
      })
    ]
  });
}

let statusFilterOptions=[
  {label:"Semua Status",value:"ALL"},
  {label:"Masuk",value:"MASUK"},
  {label:"Keluar",value:"KELUAR"}
],
sumberFilterOptions=[
  {label:"Semua Sumber",value:"ALL"},
  {label:"Sinkronisasi DORS",value:"DORS"},
  {label:"Entri Manual",value:"MANUAL"}
],
bbCards=[
  {key:"semua",label:"Semua",status:"ALL",sumber:"ALL"},
  {key:"masuk",label:"Masuk",status:"MASUK",sumber:"ALL"},
  {key:"keluar",label:"Keluar",status:"KELUAR",sumber:"ALL"},
  {key:"dors",label:"Sinkron DORS",status:"ALL",sumber:"DORS"},
  {key:"manual",label:"Entri Manual",status:"ALL",sumber:"MANUAL"}
];

const clamp2Style={
  display:"-webkit-box",
  WebkitLineClamp:2,
  WebkitBoxOrient:"vertical",
  overflow:"hidden",
  textOverflow:"ellipsis",
  wordBreak:"break-word",
  lineHeight:1.32,
  width:"100%"
};

function RekapBarangBuktiInner(){
  let bbInit=(0,l.useMemo)(()=>bbDefaultPeriod(),[]),
      [rows,setRows]=(0,l.useState)([]),
      [totalCount,setTotalCount]=(0,l.useState)(0),
      [hasNextPage,setHasNextPage]=(0,l.useState)(!1),
      [loading,setLoading]=(0,l.useState)(!0),
      [page,setPage]=(0,l.useState)(1),
      [rowsPerPage,setRowsPerPage]=(0,l.useState)(25),
      [searchApplied,setSearchApplied]=(0,l.useState)(""),
      [searchDraft,setSearchDraft]=(0,l.useState)(""),
      [statusDraft,setStatusDraft]=(0,l.useState)("ALL"),
      [sourceDraft,setSourceDraft]=(0,l.useState)("ALL"),
      [bbStatusApplied,setBbStatusApplied]=(0,l.useState)("ALL"),
      [bbSourceApplied,setBbSourceApplied]=(0,l.useState)("ALL"),
      [bbScopeOpts,setBbScopeOpts]=(0,l.useState)([]),
      [bbSatkerDraft,setBbSatkerDraft]=(0,l.useState)(null),
      [bbSatkerApplied,setBbSatkerApplied]=(0,l.useState)(null),
      [bbSummary,setBbSummary]=(0,l.useState)({}),
      [bbFrom,setBbFrom]=(0,l.useState)(bbInit.from),
      [bbTo,setBbTo]=(0,l.useState)(bbInit.to),
      [bbFromApplied,setBbFromApplied]=(0,l.useState)(bbInit.from),
      [bbToApplied,setBbToApplied]=(0,l.useState)(bbInit.to),
      [bbPeriodOpen,setBbPeriodOpen]=(0,l.useState)(!1),
      [bbPeriodMode,setBbPeriodMode]=(0,l.useState)("year"),
      [bbPeriodMonth,setBbPeriodMonth]=(0,l.useState)(bbInit.month),
      [bbPeriodYear,setBbPeriodYear]=(0,l.useState)(bbInit.year),
      [bbCustomFrom,setBbCustomFrom]=(0,l.useState)(bbInit.from),
      [bbCustomTo,setBbCustomTo]=(0,l.useState)(()=>{
        let td=safeTodayWib();
        return bbInit.to>td?td:bbInit.to;
      }),
      [bbPeriodLabel,setBbPeriodLabel]=(0,l.useState)(bbInit.label),
      [bbPeriodError,setBbPeriodError]=(0,l.useState)(""),
      [masterJenisOptions,setMasterJenisOptions]=(0,l.useState)(()=>MASTER_JENIS_BARANG_INDONESIA.map(k=>({label:k,value:k}))),
      [overridesMap,setOverridesMap]=(0,l.useState)(()=>readLocalBbOverrides()),
      [editModalOpen,setEditModalOpen]=(0,l.useState)(!1),
      [editModalMax,setEditModalMax]=(0,l.useState)(!1),
      [editSaving,setEditSaving]=(0,l.useState)(!1),
      [editError,setEditError]=(0,l.useState)(""),
      [editToast,setEditToast]=(0,l.useState)(""),
      [editToastType,setEditToastType]=(0,l.useState)("success"),
      [editForm,setEditForm]=(0,l.useState)({
        rowKey:"",
        rawId:"",
        lpId:null,
        isDorsRow:!1,
        targetRow:null,
        no_laporan:"",
        jenis:"Kendaraan Bermotor",
        keterangan:"",
        jumlah:"",
        satuan:"Buah",
        nomor_register:"",
        kepemilikan:"",
        status:"MASUK"
      });

  let currentUser=(0,l.useMemo)(()=>getUserInfo(),[]);
  let[satuanDropdownOptions,setSatuanDropdownOptions]=(0,l.useState)(()=>SATUAN_BARANG_INDONESIA.map(s=>({label:s,value:s})));

  function showToastMessage(msg,type="success"){
    setEditToastType(type);
    setEditToast(msg);
    setTimeout(()=>setEditToast(""),4500);
  }

  // Fetch scope satker options & master jenis/satuan barang with safe guards
  (0,l.useEffect)(()=>{
    let mounted=!0;
    o.apiAuth.get("/bdb/kinerja-perkara/meta/scope-options").then(res=>{
      if(!mounted)return;
      let d=res?.data?.data||{},
          opts=normalizeScopeOptions(Array.isArray(d.options)?d.options:[]);
      setBbScopeOpts(opts);
    }).catch(()=>{
      o.apiAuth.get("/bdb/laporan-polisi/scope-options").then(res=>{
        if(!mounted)return;
        let d=res?.data?.data||res?.data||{},
            raw=Array.isArray(d.options)?d.options:(Array.isArray(d)?d:[]);
        setBbScopeOpts(normalizeScopeOptions(raw));
      }).catch(()=>{
        if(mounted)setBbScopeOpts([]);
      });
    });

    // Fetch Master Jenis Barang if available & merge with canonical Indonesian classification
    const mergeMasterJenis=(items)=>{
      if(!mounted||!Array.isArray(items))return;
      let merged=[...MASTER_JENIS_BARANG_INDONESIA],
          seen=new Set(MASTER_JENIS_BARANG_INDONESIA.map(x=>x.toUpperCase()));
      for(let it of items){
        let rawLbl=String(typeof it==="string"?it:(it?.nama||it?.jenis||it?.label||it?.value||"")).trim();
        if(!rawLbl)continue;
        let mapped=classifyJenisBarang(rawLbl,"").jenis;
        if(mapped&&!seen.has(mapped.toUpperCase())){
          seen.add(mapped.toUpperCase());
          merged.push(mapped);
        }
      }
      setMasterJenisOptions(merged.map(k=>({label:k,value:k})));
    };

    o.apiAuth.get("/master/jenis-barang").then(res=>{
      let list=res?.data?.data||res?.data||[];
      mergeMasterJenis(Array.isArray(list)?list:[]);
    }).catch(()=>{
      o.apiAuth.get("/bdb/barang-bukti/master-jenis").then(res=>{
        let list=res?.data?.data||res?.data||[];
        mergeMasterJenis(Array.isArray(list)?list:[]);
      }).catch(()=>{});
    });

    // Fetch Master Satuan Barang (Standar + Input Wilayah) & deduplicate via matchSatuanIndonesia
    const mergeMasterSatuan=(items)=>{
      if(!mounted||!Array.isArray(items))return;
      let merged=[...SATUAN_BARANG_INDONESIA],
          seen=new Set(SATUAN_BARANG_INDONESIA.map(x=>x.toUpperCase()));
      for(let it of items){
        let rawLbl=String(typeof it==="string"?it:(it?.nama_satuan||it?.satuan||it?.label||it?.value||it?.nama||"")).trim();
        if(!rawLbl)continue;
        let mapped=matchSatuanIndonesia(rawLbl);
        if(mapped&&!seen.has(mapped.toUpperCase())){
          seen.add(mapped.toUpperCase());
          merged.push(mapped);
        }
      }
      setSatuanDropdownOptions(merged.map(k=>({label:k,value:k})));
    };

    o.apiAuth.get("/bdb/barang-bukti/master-satuan").then(res=>{
      let list=res?.data?.data||res?.data||[];
      mergeMasterSatuan(Array.isArray(list)?list:[]);
    }).catch(()=>{
      o.apiAuth.get("/master/satuan-barang").then(res=>{
        let list=res?.data?.data||res?.data||[];
        mergeMasterSatuan(Array.isArray(list)?list:[]);
      }).catch(()=>{});
    });

    return()=>{mounted=!1};
  },[]);

  let fetchList=(0,l.useCallback)(async(isRetry=!1)=>{
    setLoading(!0);
    let bbFilter={
      search:searchApplied,
      status:bbStatusApplied,
      sumber:bbSourceApplied,
      from:bbFromApplied,
      to:bbToApplied,
      satker_id:bbSatkerApplied
    },
    bbKey=bbListCacheKey(bbFilter,page,rowsPerPage);

    if(bbKey&&!isRetry){
      try{
        let cachedRaw=sessionStorage.getItem(bbKey);
        if(cachedRaw){
          let parsed=JSON.parse(cachedRaw);
          if(parsed&&Number(parsed.expiresAt)>Date.now()&&Array.isArray(parsed.data)){
            setRows(parsed.data.filter(Boolean));
            setTotalCount(Number.isFinite(Number(parsed.total))?Number(parsed.total):parsed.data.length);
            setHasNextPage(Boolean(parsed.hasNext));
            setLoading(!1);
            return;
          }
          sessionStorage.removeItem(bbKey);
        }
      }catch{}
    }

    try{
      let resp=(await o.apiAuth.get("/bdb/barang-bukti",{
        params:{
          page:page,
          row:rowsPerPage,
          ...searchApplied?{search:searchApplied}:{},
          ..."ALL"!==bbStatusApplied?{status:bbStatusApplied}:{},
          ..."ALL"!==bbSourceApplied?{sumber:bbSourceApplied}:{},
          ...bbFromApplied?{from:bbFromApplied}:{},
          ...bbToApplied?{to:bbToApplied}:{},
          ...bbSatkerApplied?{satker_id:bbSatkerApplied}:{}
        }
      }))?.data||{},
      bbRows=Array.isArray(resp.data)?resp.data.filter(Boolean):[],
      bbMeta=resp.meta||{},
      hasNext=Boolean(bbMeta.hasNext),
      bbTotal=bbMeta.total!=null&&Number.isFinite(Number(bbMeta.total))
        ?Number(bbMeta.total)
        :(page-1)*rowsPerPage+bbRows.length+(hasNext?1:0);

      setRows(bbRows);
      setTotalCount(bbTotal);
      setHasNextPage(hasNext);
      setLoading(!1);

      if(bbKey){
        try{
          sessionStorage.setItem(bbKey,JSON.stringify({
            expiresAt:Date.now()+BB_LIST_TTL,
            data:bbRows,
            total:bbTotal,
            hasNext:hasNext
          }));
        }catch{}
      }
    }catch(err){
      if(!isRetry){
        setTimeout(()=>{fetchList(!0)},350);
        return;
      }
      setRows([]);
      setTotalCount(0);
      setHasNextPage(!1);
      setLoading(!1);
    }
  },[page,rowsPerPage,searchApplied,bbStatusApplied,bbSourceApplied,bbFromApplied,bbToApplied,bbSatkerApplied]);

  (0,l.useEffect)(()=>{
    fetchList(!1);
  },[fetchList]);

  (0,l.useEffect)(()=>{
    let bbCancelled=!1,
        bbKey=bbSummaryCacheKey({
          search:searchApplied,
          from:bbFromApplied,
          to:bbToApplied,
          satker_id:bbSatkerApplied
        });
    if(bbKey){
      try{
        let cached=sessionStorage.getItem(bbKey);
        if(cached){
          let parsed=JSON.parse(cached);
          if(parsed&&Number(parsed.expiresAt)>Date.now()&&parsed.data&&"object"==typeof parsed.data){
            setBbSummary(parsed.data);
            return()=>{bbCancelled=!0};
          }
          sessionStorage.removeItem(bbKey);
        }
      }catch{}
    }
    (async()=>{
      try{
        let resp=(await o.apiAuth.get("/bdb/barang-bukti",{
          params:{
            summary_only:1,
            ...searchApplied?{search:searchApplied}:{},
            ...bbFromApplied?{from:bbFromApplied}:{},
            ...bbToApplied?{to:bbToApplied}:{},
            ...bbSatkerApplied?{satker_id:bbSatkerApplied}:{}
          }
        }))?.data||{},
        bbData=resp?.meta?.summary||{};
        if(!bbCancelled){
          setBbSummary(bbData&&typeof bbData==="object"?bbData:{});
          if(bbKey){
            try{
              sessionStorage.setItem(bbKey,JSON.stringify({
                expiresAt:Date.now()+BB_SUMMARY_TTL,
                data:bbData
              }));
            }catch{}
          }
        }
      }catch{
        if(!bbCancelled)setBbSummary({});
      }
    })();
    return()=>{bbCancelled=!0};
  },[searchApplied,bbFromApplied,bbToApplied,bbSatkerApplied]);

  let resolvedTotalRecords=(0,l.useMemo)(()=>bbResolveTotal(
    bbSummary,
    bbStatusApplied,
    bbSourceApplied,
    null,
    page,
    rowsPerPage,
    Array.isArray(rows)?rows.length:0,
    hasNextPage
  )||totalCount,[bbSummary,bbStatusApplied,bbSourceApplied,page,rowsPerPage,rows,hasNextPage,totalCount]);

  let bbApply=()=>{
    setPage(1);
    setSearchApplied(String(searchDraft||"").trim());
    setBbStatusApplied(statusDraft||"ALL");
    setBbSourceApplied(sourceDraft||"ALL");
    setBbFromApplied(bbFrom);
    setBbToApplied(bbTo);
    setBbSatkerApplied(bbSatkerDraft);
  };

  let bbReset=()=>{
    let e=bbDefaultPeriod(),
        td=safeTodayWib();
    setSearchDraft("");
    setStatusDraft("ALL");
    setSourceDraft("ALL");
    setBbSatkerDraft(null);
    setBbSatkerApplied(null);
    setBbFrom(e.from);
    setBbTo(e.to);
    setBbPeriodMode("year");
    setBbPeriodMonth(e.month);
    setBbPeriodYear(e.year);
    setBbCustomFrom(e.from);
    setBbCustomTo(e.to>td?td:e.to);
    setBbPeriodLabel(e.label);
    setBbPeriodError("");
    setBbPeriodOpen(!1);
    setPage(1);
    setSearchApplied("");
    setBbStatusApplied("ALL");
    setBbSourceApplied("ALL");
    setBbFromApplied(e.from);
    setBbToApplied(e.to);
  };

  function bbTogglePeriod(){
    setBbPeriodOpen(e=>!e);
  }

  function bbApplyPeriod(){
    let e,a,t;
    if("year"===bbPeriodMode){
      e=bbPeriodYear+"-01-01";
      a=bbPeriodYear+"-12-31";
      t="Tahun "+bbPeriodYear;
    }else if("month"===bbPeriodMode){
      let mRange=bbMonthRange(bbPeriodYear,bbPeriodMonth);
      e=mRange.from;
      a=mRange.to;
      t=mRange.label;
    }else{
      e=bbCustomFrom;
      a=bbCustomTo;
      if(!e||!a){
        setBbPeriodError("Tanggal awal dan akhir wajib dipilih.");
        return;
      }
      if(e>a){
        setBbPeriodError("Tanggal awal tidak boleh melewati tanggal akhir.");
        return;
      }
      let lDate=new Date(e+"T00:00:00Z"),
          rDate=new Date(a+"T00:00:00Z"),
          diffDays=Math.floor((rDate.getTime()-lDate.getTime())/86400000)+1;
      if(!Number.isFinite(diffDays)||diffDays<1){
        setBbPeriodError("Periode tidak valid.");
        return;
      }
      t=bbDateLabel(e)+" s.d. "+bbDateLabel(a);
    }
    setBbFrom(e);
    setBbTo(a);
    setBbCustomFrom(e);
    setBbCustomTo(a);
    setBbPeriodLabel(t);
    setBbPeriodError("");
    setBbPeriodOpen(!1);
    setPage(1);
    setBbFromApplied(e);
    setBbToApplied(a);
  }

  function bbResetPeriod(){
    let e=bbDefaultPeriod();
    setBbFrom(e.from);
    setBbTo(e.to);
    setBbPeriodMode("year");
    setBbPeriodMonth(e.month);
    setBbPeriodYear(e.year);
    setBbCustomFrom(e.from);
    setBbCustomTo(e.to);
    setBbPeriodLabel(e.label);
    setBbPeriodError("");
    setBbPeriodOpen(!1);
    setPage(1);
    setBbFromApplied(e.from);
    setBbToApplied(e.to);
  }

  function openEditModal(row){
    if(!row||typeof row!=="object")return;
    let liveUser=getUserInfo()||currentUser;
    if(!canUserModifyBbItem(row,liveUser)){
      showToastMessage("Akses Ditolak (RBAC): Anda hanya dapat mengubah Barang Bukti milik Satker Anda sendiri.","error");
      return;
    }
    let key=getRowOverrideKey(row),
        ov=overridesMap?.[key]||{},
        isDors=String(row.sumber||"").toUpperCase()==="DORS"||String(row.row_id||"").startsWith("dors-"),
        classified=classifyJenisBarang(ov.jenis??row.jenis_barang??row.jenis,ov.keterangan??row.nama_barang??row.keterangan),
        parsedJS=parseJumlahSatuan(row,overridesMap);

    setEditError("");
    setEditForm({
      rowKey:key,
      rawId:String(row.row_id??row.id??""),
      lpId:row.lp_id??null,
      isDorsRow:isDors,
      targetRow:row,
      no_laporan:String(row.no_laporan||"—"),
      jenis:classified.jenis||"Kendaraan Bermotor",
      keterangan:classified.detail==="—"?"":classified.detail,
      jumlah:parsedJS.jumlah||"",
      satuan:parsedJS.satuan||"Buah",
      nomor_register:String(ov.nomor_register??row.nomor_register??""),
      kepemilikan:String(ov.kepemilikan??row.kepemilikan??""),
      status:String(ov.status??row.status??"MASUK").toUpperCase()==="KELUAR"?"KELUAR":"MASUK"
    });
    setEditModalMax(!1);
    setEditModalOpen(!0);
  }

  async function handleDelete(row){
    if(!row||typeof row!=="object")return;
    let liveUser=getUserInfo()||currentUser;
    if(!canUserModifyBbItem(row,liveUser)){
      showToastMessage("Akses Ditolak (RBAC): Anda hanya dapat mengubah Barang Bukti milik Satker Anda sendiri.","error");
      return;
    }
    let isDors=String(row.sumber||"").toUpperCase()==="DORS"||String(row.row_id||"").startsWith("dors-");
    if(isDors){
      showToastMessage("Data Barang Bukti dari sinkronisasi DORS tidak dapat dihapus.","error");
      return;
    }
    if(typeof window!=="undefined"&&!window.confirm(`Hapus barang bukti "${row.nama_barang||row.keterangan||row.jenis||"ini"}"?`))return;
    let rawId=String(row.row_id??row.id??"").trim(),
        realId=rawId.replace(/^manual-/i,"")||rawId;
    try{
      await o.apiAuth.delete(`/bdb/barang-bukti/${encodeURIComponent(realId)}`);
      clearBbSessionCaches();
      setRows(prev=>(Array.isArray(prev)?prev:[]).filter(r=>r&&getRowOverrideKey(r)!==getRowOverrideKey(row)));
      showToastMessage("Data barang bukti berhasil dihapus.","success");
    }catch(err){
      let status=err?.response?.status,
          msg=err?.response?.data?.message||(status===403?"Akses Ditolak (RBAC): Anda hanya dapat menghapus Barang Bukti milik Satker Anda sendiri.":"Gagal menghapus barang bukti.");
      showToastMessage(msg,"error");
    }
  }

  async function handleSaveEdit(ev){
    if(ev&&typeof ev.preventDefault==="function")ev.preventDefault();
    let liveUser=getUserInfo()||currentUser;
    if(editForm.targetRow&&!canUserModifyBbItem(editForm.targetRow,liveUser)){
      let rbacMsg="Akses Ditolak (RBAC): Anda hanya dapat mengubah Barang Bukti milik Satker Anda sendiri.";
      setEditError(rbacMsg);
      showToastMessage(rbacMsg,"error");
      return;
    }
    let isDors=Boolean(editForm.isDorsRow),
        rawSatuanInput=String(editForm.satuan||"").trim(),
        cleanSatuan=matchSatuanIndonesia(rawSatuanInput),
        cleanJumlah=String(editForm.jumlah??"").trim(),
        cleanJenis=String(editForm.jenis||"").trim(),
        cleanKet=String(editForm.keterangan||"").trim();

    if(!cleanSatuan){
      setEditError("Satuan barang wajib dipilih (contoh: Buah, Unit, Kilogram (Kg), Meter (m)).");
      return;
    }
    setSatuanDropdownOptions(prev=>{
      let arr=Array.isArray(prev)?prev:[];
      if(arr.some(o=>String(o.value||"").toUpperCase()===cleanSatuan.toUpperCase()))return arr;
      return[...arr,{label:cleanSatuan,value:cleanSatuan}];
    });
    if(!isDors&&!cleanJenis){
      setEditError("Jenis Barang wajib dipilih dari daftar Master Kategori.");
      return;
    }
    if(!isDors&&cleanJumlah!==""&&(isNaN(Number(cleanJumlah))||Number(cleanJumlah)<0)){
      setEditError("Jumlah barang harus berupa angka numerik >= 0.");
      return;
    }

    setEditSaving(!0);
    setEditError("");

    let combinedJumlah=cleanJumlah!==""?`${cleanJumlah} ${cleanSatuan}`.trim():cleanSatuan;
    let payload=isDors
      ?{
          satuan:cleanSatuan,
          jumlah_angka:cleanJumlah!==""?Number(cleanJumlah):null,
          jumlah:combinedJumlah
        }
      :{
          jenis:cleanJenis,
          keterangan:cleanKet||cleanJenis,
          jumlah_angka:cleanJumlah!==""?Number(cleanJumlah):null,
          satuan:cleanSatuan,
          jumlah:combinedJumlah,
          nomor_register:String(editForm.nomor_register||"").trim()||null,
          kepemilikan:String(editForm.kepemilikan||"").trim()||null,
          status:editForm.status||"MASUK"
        };

    let targetId=String(editForm.rawId||editForm.rowKey||"").trim();
    try{
      if(isDors){
        let realId=targetId.replace(/^dors-/i,"")||targetId;
        try{
          await o.apiAuth.patch(`/bdb/barang-bukti/dors/${encodeURIComponent(realId)}`,payload);
        }catch(err1){
          if(err1?.response?.status===403||err1?.response?.status===401)throw err1;
          await o.apiAuth.patch(`/bdb/barang-bukti/dors/${encodeURIComponent(targetId)}`,payload);
        }
      }else{
        let realId=targetId.replace(/^manual-/i,"")||targetId;
        try{
          await o.apiAuth.patch(`/bdb/barang-bukti/${encodeURIComponent(realId)}`,payload);
        }catch(err1){
          if(err1?.response?.status===403||err1?.response?.status===401)throw err1;
          await o.apiAuth.patch(`/bdb/barang-bukti/manual/${encodeURIComponent(realId)}`,payload);
        }
      }
    }catch(err){
      let status=err?.response?.status;
      if(status===403||status===401){
        let msg=err?.response?.data?.message||"Akses Ditolak (403 Forbidden): Anda hanya dapat mengubah Barang Bukti milik Satker Anda sendiri.";
        setEditSaving(!1);
        setEditError(msg);
        showToastMessage(msg,"error");
        return;
      }
      if(err?.response?.data?.message){
        let msg=Array.isArray(err.response.data.message)?err.response.data.message.join(", "):String(err.response.data.message);
        setEditSaving(!1);
        setEditError(msg);
        showToastMessage(msg,"error");
        return;
      }
    }

    // Persist in localStorage overrides & update React state immediately
    let overrideData=isDors
      ?{satuan:cleanSatuan,jumlah:cleanJumlah,jenis:cleanJenis,keterangan:cleanKet}
      :{
          jenis:cleanJenis,
          keterangan:cleanKet,
          jumlah:cleanJumlah,
          satuan:cleanSatuan,
          nomor_register:String(editForm.nomor_register||"").trim(),
          kepemilikan:String(editForm.kepemilikan||"").trim(),
          status:editForm.status||"MASUK"
        };

    saveBbOverride(editForm.rowKey,overrideData);
    let nextOverrides=readLocalBbOverrides();
    setOverridesMap(nextOverrides);
    clearBbSessionCaches();

    setRows(prev=>(Array.isArray(prev)?prev:[]).map(r=>{
      if(!r||getRowOverrideKey(r)!==editForm.rowKey)return r;
      if(isDors){
        return{
          ...r,
          satuan:cleanSatuan,
          jumlah_angka:cleanJumlah,
          jumlah:combinedJumlah
        };
      }
      return{
        ...r,
        jenis:cleanJenis,
        keterangan:cleanKet||r.keterangan,
        jumlah_angka:cleanJumlah,
        satuan:cleanSatuan,
        jumlah:combinedJumlah,
        nomor_register:String(editForm.nomor_register||"").trim()||null,
        kepemilikan:String(editForm.kepemilikan||"").trim()||null,
        status:editForm.status||"MASUK"
      };
    }));

    setEditSaving(!1);
    setEditModalOpen(!1);
    showToastMessage(isDors?`Satuan "${cleanSatuan}" berhasil disimpan untuk data DORS.`:`Data barang bukti berhasil diperbarui.`,"success");
  }

  let satkerOptionsMemo=(0,l.useMemo)(()=>[
    {label:"Semua Satker",value:null},
    ...(Array.isArray(bbScopeOpts)?bbScopeOpts:[])
  ],[bbScopeOpts]);

  let safeRows=Array.isArray(rows)?rows.filter(Boolean):[];

  return(0,a.jsxs)("div",{
    style:{width:"100%",maxWidth:"100%",boxSizing:"border-box"},
    children:[
      (0,a.jsx)("style",{
        children:`
          .cas-rekap-bb-table .p-datatable-wrapper { overflow-x: hidden !important; width: 100% !important; }
          .cas-rekap-bb-table table { width: 100% !important; table-layout: fixed !important; border-collapse: collapse; }
          .cas-rekap-bb-table .p-datatable-thead > tr > th,
          .cas-rekap-bb-table .p-datatable-tbody > tr > td {
            box-sizing: border-box !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            vertical-align: middle !important;
            padding: 0.48rem 0.5rem !important;
          }
          .cas-bb-modal-backdrop .p-dropdown-panel { z-index: 4500 !important; }
          .cas-rekap-bb-table .p-tag, .p-tag { border-radius: 6px !important; }
        `
      }),
      (0,a.jsx)("h1",{className:"cms-page-title",children:"Rekap Barang Bukti"}),
      (0,a.jsx)("p",{
        className:"cms-page-sub",
        children:"Gabungan data barang bukti hasil sinkronisasi DORS dan entri manual pada detail Laporan Polisi di seluruh Satker dalam cakupan Anda."
      }),
      editToast&&(0,a.jsxs)("div",{
        role:editToastType==="error"?"alert":"status",
        style:{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          gap:"0.75rem",
          marginBottom:"0.75rem",
          padding:"0.55rem 0.85rem",
          borderRadius:8,
          background:editToastType==="error"?"#fef2f2":"#ecfdf5",
          border:editToastType==="error"?"1px solid #fecaca":"1px solid #6ee7b7",
          color:editToastType==="error"?"#b91c1c":"#065f46",
          fontSize:"0.78rem",
          fontWeight:600
        },
        children:[
          (0,a.jsxs)("span",{
            style:{display:"inline-flex",alignItems:"center",gap:"0.45rem"},
            children:[
              (0,a.jsx)("i",{className:editToastType==="error"?"pi pi-ban":"pi pi-check-circle",style:{fontSize:"0.9rem",color:editToastType==="error"?"#dc2626":"#059669"}}),
              editToast
            ]
          }),
          (0,a.jsx)("button",{
            type:"button",
            onClick:()=>setEditToast(""),
            style:{background:"none",border:"none",color:editToastType==="error"?"#b91c1c":"#047857",cursor:"pointer",fontSize:"1rem",lineHeight:1},
            children:"×"
          })
        ]
      }),
      (0,a.jsx)("div",{
        className:"lp-status-cards",
        style:{margin:"0 0 0.85rem",gridTemplateColumns:"repeat(auto-fit,minmax(7.5rem,1fr))"},
        children:bbCards.map(card=>{
          let bbActive=bbStatusApplied===card.status&&bbSourceApplied===card.sumber,
              bbValue=bbSummary?.[card.key];
          return(0,a.jsxs)("button",{
            type:"button",
            onClick:()=>{
              setStatusDraft(card.status);
              setSourceDraft(card.sumber);
              setPage(1);
              setBbStatusApplied(card.status);
              setBbSourceApplied(card.sumber);
            },
            className:"lp-stat "+("semua"===card.key?"total":"ct")+(bbActive?" active":""),
            children:[
              (0,a.jsx)("div",{
                className:"n",
                children:null==bbValue||!Number.isFinite(Number(bbValue))?"—":Number(bbValue).toLocaleString("id-ID")
              }),
              (0,a.jsx)("div",{className:"l",children:card.label})
            ]
          },card.key);
        })
      }),
      (0,a.jsxs)("div",{
        className:"cms-card",
        style:{padding:0,overflow:"visible",width:"100%",maxWidth:"100%",boxSizing:"border-box"},
        children:[
          (0,a.jsxs)("div",{
            className:"cas-unified-filter-bar",
            style:{
              display:"flex",
              alignItems:"center",
              gap:"0.55rem",
              flexWrap:"wrap",
              padding:"0.85rem 1rem",
              marginBottom:"0.45rem",
              borderBottom:"1px solid var(--cas-border, #e2e8f0)",
              width:"100%",
              boxSizing:"border-box"
            },
            children:[
              (0,a.jsx)(i.InputText,{
                id:"bb-search-filter",
                name:"search_bb",
                value:searchDraft,
                onChange:ev=>setSearchDraft(ev?.target?.value??""),
                onKeyDown:ev=>{"Enter"===ev?.key&&bbApply()},
                placeholder:"Cari jenis / nama barang / no. register / nomor LP…",
                style:{flex:"1.2 1 13.5rem",minWidth:"11.5rem",height:"38px",minHeight:"38px",boxSizing:"border-box"}
              }),
              (0,a.jsxs)("div",{
                style:{position:"relative",flex:"0 1 12.5rem",minWidth:"11rem",height:"38px"},
                children:[
                  (0,a.jsxs)("button",{
                    type:"button",
                    className:"att-btn",
                    onClick:bbTogglePeriod,
                    title:"Pilih periode",
                    style:{
                      width:"100%",
                      height:"38px",
                      minHeight:"38px",
                      boxSizing:"border-box",
                      display:"inline-flex",
                      alignItems:"center",
                      gap:"0.35rem",
                      justifyContent:"flex-start",
                      whiteSpace:"nowrap",
                      overflow:"hidden"
                    },
                    children:[
                      (0,a.jsx)("i",{className:"pi pi-calendar",style:{fontSize:"0.82rem",flexShrink:0}}),
                      (0,a.jsx)("span",{style:{fontSize:"0.7rem",color:"var(--cas-text-secondary, #64748b)",flexShrink:0},children:"Periode"}),
                      (0,a.jsx)("strong",{style:{overflow:"hidden",textOverflow:"ellipsis",minWidth:0,flex:"1 1 auto",textAlign:"left"},children:bbPeriodLabel}),
                      (0,a.jsx)("i",{className:"pi pi-chevron-down",style:{fontSize:"0.65rem",marginLeft:"auto"}})
                    ]
                  }),
                  bbPeriodOpen&&(0,a.jsx)("div",{style:{position:"fixed",inset:0,zIndex:2499},onClick:()=>setBbPeriodOpen(!1)}),
                  bbPeriodOpen&&(0,a.jsxs)("div",{
                    className:"bb-period-popover cas-filter-popover",
                    style:{
                      position:"absolute",
                      left:0,
                      top:"calc(100% + 0.45rem)",
                      zIndex:2500,
                      width:"30rem",
                      maxWidth:"calc(100vw - 2rem)",
                      maxHeight:"min(27.5rem, calc(100vh - 14.5rem))",
                      display:"flex",
                      flexDirection:"column",
                      background:"var(--cas-bg-surface, #fff)",
                      border:"1px solid var(--cas-border-card, #dbe3ee)",
                      borderRadius:10,
                      boxShadow:"0 14px 36px rgba(15,23,42,.24)",
                      padding:"0.75rem 0.85rem"
                    },
                    children:[
                      (0,a.jsxs)("div",{
                        style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.55rem",flexShrink:0},
                        children:[
                          (0,a.jsxs)("div",{
                            children:[
                              (0,a.jsx)("div",{style:{fontWeight:800,color:"var(--cas-text-primary, #0f172a)",fontSize:"0.92rem"},children:"Pilih Periode Laporan"}),
                              (0,a.jsx)("div",{style:{fontSize:"0.71rem",color:"var(--cas-text-secondary, #64748b)",marginTop:"0.08rem"},children:bbPeriodLabel})
                            ]
                          }),
                          (0,a.jsx)("button",{
                            type:"button",
                            onClick:()=>setBbPeriodOpen(!1),
                            style:{background:"none",border:"none",color:"var(--cas-text-secondary, #64748b)",fontSize:"1.1rem",cursor:"pointer",padding:"0 0.25rem",lineHeight:1},
                            children:"×"
                          })
                        ]
                      }),
                      (0,a.jsxs)("div",{
                        style:{flex:"1 1 auto",minHeight:0,overflowY:"auto",paddingRight:"0.15rem"},
                        children:[
                          (0,a.jsxs)("div",{
                            style:{background:"var(--cas-bg-subtle, #f8fafc)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:8,padding:"0.45rem 0.55rem",marginBottom:"0.48rem"},
                            children:[
                              (0,a.jsx)("div",{style:{fontSize:"0.68rem",fontWeight:700,color:"var(--cas-text-secondary, #475569)",marginBottom:"0.32rem",textTransform:"uppercase"},children:"1. Mode Periode"}),
                              (0,a.jsx)("div",{
                                style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.35rem"},
                                children:[
                                  {id:"year",label:"Per Tahun"},
                                  {id:"month",label:"Per Bulan"},
                                  {id:"custom",label:"Rentang Tanggal"}
                                ].map(mMode=>{
                                  let act=bbPeriodMode===mMode.id;
                                  return(0,a.jsx)("button",{
                                    type:"button",
                                    onClick:()=>{setBbPeriodMode(mMode.id);setBbPeriodError("")},
                                    style:{
                                      borderRadius:6,
                                      padding:"0.34rem 0.35rem",
                                      fontSize:"0.72rem",
                                      fontWeight:700,
                                      cursor:"pointer",
                                      border:act?"1.5px solid #ef4444":"1px solid var(--cas-border, #cbd5e1)",
                                      background:act?"rgba(239, 68, 68, 0.18)":"var(--cas-bg-surface, #fff)",
                                      color:act?"#ef4444":"var(--cas-text-primary, #334155)",
                                      textAlign:"center",
                                      transition:"all 0.15s ease"
                                    },
                                    children:mMode.label
                                  },mMode.id);
                                })
                              })
                            ]
                          }),
                          (0,a.jsxs)("div",{
                            style:{background:"var(--cas-bg-subtle, #f8fafc)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:8,padding:"0.55rem"},
                            children:[
                              (0,a.jsx)("div",{style:{fontSize:"0.68rem",fontWeight:700,color:"var(--cas-text-secondary, #475569)",marginBottom:"0.38rem",textTransform:"uppercase"},children:"2. Pengaturan Rentang Waktu"}),
                              "year"===bbPeriodMode&&(0,a.jsx)("div",{
                                children:(0,a.jsx)(r.Dropdown,{
                                  id:"bb-period-year-single",
                                  inputId:"bb-period-year-single-select",
                                  name:"period_year_single",
                                  value:bbPeriodYear,
                                  options:bbYearOptions(),
                                  onChange:ev=>setBbPeriodYear(ev.value),
                                  placeholder:"Pilih Tahun",
                                  style:{width:"100%"}
                                })
                              }),
                              "month"===bbPeriodMode&&(0,a.jsxs)("div",{
                                style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"},
                                children:[
                                  (0,a.jsx)(r.Dropdown,{
                                    id:"bb-period-month",
                                    inputId:"bb-period-month-select",
                                    name:"period_month",
                                    value:bbPeriodMonth,
                                    options:bbMonthOptions(),
                                    onChange:ev=>setBbPeriodMonth(ev.value),
                                    placeholder:"Bulan",
                                    style:{width:"100%"}
                                  }),
                                  (0,a.jsx)(r.Dropdown,{
                                    id:"bb-period-year",
                                    inputId:"bb-period-year-select",
                                    name:"period_year",
                                    value:bbPeriodYear,
                                    options:bbYearOptions(),
                                    onChange:ev=>setBbPeriodYear(ev.value),
                                    placeholder:"Tahun",
                                    style:{width:"100%"}
                                  })
                                ]
                              }),
                              "custom"===bbPeriodMode&&(0,a.jsxs)("div",{
                                style:{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:"0.45rem"},
                                children:[
                                  (0,a.jsx)(i.InputText,{
                                    id:"bb-custom-from",
                                    name:"date_from",
                                    type:"date",
                                    max:safeTodayWib(),
                                    value:bbCustomFrom,
                                    onChange:ev=>{
                                      let td=safeTodayWib(),
                                          val=ev?.target?.value||"";
                                      setBbCustomFrom(val&&val>td?td:val);
                                    },
                                    style:{width:"100%"}
                                  }),
                                  (0,a.jsx)("span",{style:{color:"#94a3b8"},children:"–"}),
                                  (0,a.jsx)(i.InputText,{
                                    id:"bb-custom-to",
                                    name:"date_to",
                                    type:"date",
                                    max:safeTodayWib(),
                                    value:bbCustomTo,
                                    onChange:ev=>{
                                      let td=safeTodayWib(),
                                          val=ev?.target?.value||"";
                                      setBbCustomTo(val&&val>td?td:val);
                                    },
                                    style:{width:"100%"}
                                  })
                                ]
                              }),
                              bbPeriodError&&(0,a.jsx)("div",{
                                role:"alert",
                                style:{marginTop:"0.55rem",color:"#b91c1c",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"0.45rem 0.6rem",fontSize:"0.72rem",fontWeight:600},
                                children:bbPeriodError
                              })
                            ]
                          })
                        ]
                      }),
                      (0,a.jsxs)("div",{
                        style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.55rem",paddingTop:"0.55rem",borderTop:"1px solid var(--cas-border, #e2e8f0)",flexShrink:0},
                        children:[
                          (0,a.jsx)("button",{
                            type:"button",
                            onClick:bbResetPeriod,
                            style:{background:"none",border:"none",color:"var(--cas-text-secondary, #64748b)",fontSize:"0.76rem",fontWeight:600,cursor:"pointer",padding:"0.25rem 0.4rem"},
                            children:"Reset"
                          }),
                          (0,a.jsxs)("div",{
                            style:{display:"flex",alignItems:"center",gap:"0.6rem"},
                            children:[
                              (0,a.jsx)("span",{style:{fontSize:"0.73rem",color:"var(--cas-text-secondary, #475569)",fontWeight:600},children:bbPeriodLabel}),
                              (0,a.jsx)("button",{
                                type:"button",
                                onClick:bbApplyPeriod,
                                style:{background:"#ef4444",color:"#fff",border:"1px solid #ef4444",borderRadius:6,padding:"0.38rem 1.05rem",fontSize:"0.76rem",fontWeight:700,cursor:"pointer"},
                                children:"Terapkan"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              (0,a.jsx)(r.Dropdown,{
                id:"bb-filter-satker",
                inputId:"bb-filter-satker-select",
                name:"filter_satker",
                value:bbSatkerDraft,
                options:satkerOptionsMemo,
                optionLabel:"label",
                optionValue:"value",
                onChange:ev=>setBbSatkerDraft(ev.value==null?null:Number(ev.value)),
                placeholder:"Semua Satker…",
                filter:!0,
                style:{flex:"1.1 1 12.5rem",minWidth:"11rem",height:"38px",minHeight:"38px",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}
              }),
              (0,a.jsx)(r.Dropdown,{
                id:"bb-filter-status",
                inputId:"bb-filter-status-select",
                name:"filter_status",
                value:statusDraft,
                options:statusFilterOptions,
                optionLabel:"label",
                optionValue:"value",
                onChange:ev=>setStatusDraft(ev.value||"ALL"),
                placeholder:"Status",
                style:{flex:"0.7 1 9rem",minWidth:"8rem",height:"38px",minHeight:"38px",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}
              }),
              (0,a.jsx)(r.Dropdown,{
                id:"bb-filter-sumber",
                inputId:"bb-filter-sumber-select",
                name:"filter_sumber",
                value:sourceDraft,
                options:sumberFilterOptions,
                optionLabel:"label",
                optionValue:"value",
                onChange:ev=>setSourceDraft(ev.value||"ALL"),
                placeholder:"Sumber",
                style:{flex:"0.7 1 9rem",minWidth:"8rem",height:"38px",minHeight:"38px",boxSizing:"border-box",display:"inline-flex",alignItems:"center"}
              }),
              (0,a.jsxs)("div",{
                style:{display:"flex",gap:"0.5rem",flex:"0 0 auto",marginLeft:"auto"},
                children:[
                  (0,a.jsx)("button",{
                    type:"button",
                    onClick:bbApply,
                    className:"att-btn primary",
                    style:{height:"38px",minHeight:"38px",padding:"0 1rem",display:"inline-flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box"},
                    children:"Terapkan"
                  }),
                  (0,a.jsx)("button",{
                    type:"button",
                    onClick:bbReset,
                    className:"att-btn",
                    style:{height:"38px",minHeight:"38px",padding:"0 1rem",display:"inline-flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box"},
                    children:"Reset"
                  })
                ]
              })
            ]
          }),
          (0,a.jsxs)(t.DataTable,{
            className:"cas-rekap-bb-table",
            value:safeRows,
            loading:loading,
            lazy:!0,
            paginator:!0,
            first:Math.max(0,(Number(page||1)-1)*Number(rowsPerPage||25)),
            rows:Number(rowsPerPage||25),
            rowsPerPageOptions:[25,50,100],
            paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
            currentPageReportTemplate:"Menampilkan {first} s.d. {last} dari {totalRecords} barang bukti",
            totalRecords:Math.max(0,Number(resolvedTotalRecords)||0),
            onPage:function(ev){
              let nextRows=Number(ev?.rows)||rowsPerPage||25,
                  nextFirst=Number(ev?.first)||0;
              setPage(Math.floor(nextFirst/nextRows)+1);
              setRowsPerPage(nextRows);
            },
            stripedRows:!0,
            size:"small",
            tableStyle:{width:"100%",tableLayout:"fixed"},
            style:{width:"100%",overflowX:"hidden"},
            emptyMessage:"Tidak ada data barang bukti pada filter ini.",
            children:[
              (0,a.jsx)(s.Column,{
                header:"NO",
                body:(row,meta)=>((Number(page)||1)-1)*(Number(rowsPerPage)||25)+(Number(meta?.rowIndex)||0)+1,
                headerStyle:{width:"3.5%",textAlign:"center",fontSize:"0.71rem",fontWeight:700},
                style:{width:"3.5%",textAlign:"center",fontSize:"0.74rem",color:"var(--cas-text-secondary, #64748b)"}
              }),
              (0,a.jsx)(s.Column,{
                field:"jenis",
                header:"JENIS & NAMA / DETAIL BARANG",
                headerStyle:{width:"21%",fontSize:"0.71rem",fontWeight:700},
                style:{width:"21%",maxWidth:"21%",overflow:"hidden"},
                body:row=>{
                  if(!row||typeof row!=="object")return"—";
                  let key=getRowOverrideKey(row),
                      ov=overridesMap?.[key]||{},
                      classified=classifyJenisBarang(ov.jenis??row.jenis_barang??row.jenis,ov.keterangan??row.nama_barang??row.keterangan),
                      jenis=classified.jenis||"Barang Bukti Lainnya",
                      detail=classified.detail||"—";
                  return(0,a.jsxs)("div",{
                    style:{width:"100%",minWidth:0,overflow:"hidden",lineHeight:1.3},
                    children:[
                      (0,a.jsx)("span",{
                        title:jenis,
                        style:{
                          fontWeight:700,
                          fontSize:"0.77rem",
                          color:"var(--cas-text-primary, #0f172a)",
                          whiteSpace:"nowrap",
                          overflow:"hidden",
                          textOverflow:"ellipsis",
                          display:"block",
                          width:"100%"
                        },
                        children:jenis
                      }),
                      (0,a.jsx)("span",{
                        title:detail!=="—"?detail:jenis,
                        style:{
                          fontSize:"0.76rem",
                          color:"var(--cas-text-secondary, #64748b)",
                          whiteSpace:"nowrap",
                          overflow:"hidden",
                          textOverflow:"ellipsis",
                          display:"block",
                          width:"100%",
                          marginTop:"0.12rem"
                        },
                        children:detail
                      })
                    ]
                  });
                }
              }),
              (0,a.jsx)(s.Column,{
                field:"nomor_register",
                header:"NO. REGISTER BB",
                headerStyle:{width:"10%",fontSize:"0.71rem",fontWeight:700},
                style:{width:"10%",maxWidth:"10%",overflow:"hidden"},
                body:row=>{
                  if(!row||typeof row!=="object")return"—";
                  let key=getRowOverrideKey(row),
                      ov=overridesMap?.[key]||{},
                      val=String(ov.nomor_register??row.nomor_register??"").trim()||"—";
                  return(0,a.jsx)("div",{
                    title:val!=="—"?val:void 0,
                    style:{...clamp2Style,fontSize:"0.74rem",color:val!=="—"?"var(--cas-text-primary, #0f172a)":"var(--cas-text-muted, #64748b)"},
                    children:val
                  });
                }
              }),
              (0,a.jsx)(s.Column,{
                field:"jumlah",
                header:"JUMLAH & SATUAN",
                headerStyle:{width:"10.5%",fontSize:"0.71rem",fontWeight:700},
                style:{width:"10.5%",maxWidth:"10.5%",overflow:"hidden"},
                body:row=>{
                  if(!row||typeof row!=="object")return"—";
                  let parsed=parseJumlahSatuan(row,overridesMap),
                      jml=parsed.jumlah,
                      sat=parsed.satuan,
                      isDors=String(row.sumber||"").toUpperCase()==="DORS"||String(row.row_id||"").startsWith("dors-");
                  if(!jml&&!sat){
                    return(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)",fontSize:"0.74rem"},children:"—"});
                  }
                  let formattedNum=jml;
                  if(jml&&/^-?\d+(?:\.\d+)?$/.test(jml)){
                    let nVal=Number(jml);
                    if(Number.isFinite(nVal))formattedNum=nVal.toLocaleString("id-ID");
                  }
                  return(0,a.jsxs)("div",{
                    title:`${formattedNum||""} ${sat||"(Satuan belum dilengkapi)"}`.trim(),
                    style:{...clamp2Style,display:"flex",flexWrap:"wrap",alignItems:"center",gap:"0.28rem",fontSize:"0.75rem"},
                    children:[
                      formattedNum&&(0,a.jsx)("strong",{
                        style:{fontWeight:700,color:"var(--cas-text-primary, #0f172a)"},
                        children:formattedNum
                      }),
                      sat?(0,a.jsx)("span",{
                        style:{
                          fontSize:"0.69rem",
                          fontWeight:600,
                          color:"#0369a1",
                          background:"#f0f9ff",
                          border:"1px solid #bae6fd",
                          borderRadius:4,
                          padding:"0.04rem 0.36rem",
                          whiteSpace:"nowrap",
                          maxWidth:"100%",
                          overflow:"hidden",
                          textOverflow:"ellipsis"
                        },
                        children:sat
                      }):isDors&&canUserModifyBbItem(row,currentUser)&&(0,a.jsx)("button",{
                        type:"button",
                        onClick:()=>openEditModal(row),
                        title:"Klik untuk melengkapi Satuan Barang DORS",
                        style:{
                          fontSize:"0.66rem",
                          fontWeight:600,
                          color:"#b45309",
                          background:"#fffbeb",
                          border:"1px dashed #fcd34d",
                          borderRadius:4,
                          padding:"0.04rem 0.34rem",
                          cursor:"pointer",
                          whiteSpace:"nowrap"
                        },
                        children:"+ Satuan"
                      })
                    ]
                  });
                }
              }),
              (0,a.jsx)(s.Column,{
                field:"kepemilikan",
                header:"KEPEMILIKAN",
                headerStyle:{width:"9%",fontSize:"0.71rem",fontWeight:700},
                style:{width:"9%",maxWidth:"9%",overflow:"hidden"},
                body:row=>{
                  if(!row||typeof row!=="object")return"—";
                  let key=getRowOverrideKey(row),
                      ov=overridesMap?.[key]||{},
                      val=String(ov.kepemilikan??row.kepemilikan??"").trim()||"—";
                  return(0,a.jsx)("div",{
                    title:val!=="—"?val:void 0,
                    style:{...clamp2Style,fontSize:"0.74rem",color:val!=="—"?"var(--cas-text-primary, #0f172a)":"var(--cas-text-muted, #64748b)"},
                    children:val
                  });
                }
              }),
              (0,a.jsx)(s.Column,{
                field:"no_laporan",
                header:"NO. LAPORAN",
                headerStyle:{width:"13%",fontSize:"0.71rem",fontWeight:700},
                style:{width:"13%",maxWidth:"13%",overflow:"hidden"},
                body:row=>{
                  if(!row||typeof row!=="object")return"—";
                  let lpNo=String(row.no_laporan||"").trim()||"—";
                  return(0,a.jsx)("div",{
                    title:lpNo!=="—"?lpNo:void 0,
                    style:{
                      ...clamp2Style,
                      fontWeight:700,
                      fontSize:"0.73rem",
                      color:"var(--cas-text-primary, #0f172a)",
                      wordBreak:"break-all"
                    },
                    children:lpNo
                  });
                }
              }),
              (0,a.jsx)(s.Column,{
                header:"SATKER PENANGANAN",
                headerStyle:{width:"11.5%",fontSize:"0.71rem",fontWeight:700},
                style:{width:"11.5%",maxWidth:"11.5%",overflow:"hidden"},
                body:renderSatkerCell
              }),
              (0,a.jsx)(s.Column,{
                header:"TINDAK PIDANA",
                headerStyle:{width:"11.5%",fontSize:"0.71rem",fontWeight:700},
                style:{width:"11.5%",maxWidth:"11.5%",overflow:"hidden"},
                body:renderTindakPidanaCell
              }),
              (0,a.jsx)(s.Column,{
                header:"SUMBER",
                headerStyle:{width:"5.5%",textAlign:"center",fontSize:"0.71rem",fontWeight:700},
                style:{width:"5.5%",maxWidth:"5.5%",textAlign:"center",overflow:"hidden"},
                body:row=>{
                  if(!row||typeof row!=="object")return"—";
                  let isDors="DORS"===String(row.sumber||"").toUpperCase();
                  return(0,a.jsx)(n.Tag,{
                    value:isDors?"DORS":"Manual",
                    severity:isDors?void 0:"success",
                    style:{fontSize:"0.68rem",padding:"0.12rem 0.42rem",fontWeight:700,borderRadius:"6px"}
                  });
                }
              }),
              (0,a.jsx)(s.Column,{
                header:"AKSI",
                headerStyle:{width:"4.5%",textAlign:"center",fontSize:"0.71rem",fontWeight:700},
                style:{width:"4.5%",maxWidth:"4.5%",textAlign:"center",overflow:"hidden"},
                body:row=>{
                  if(!row||typeof row!=="object")return null;
                  let canModify=canUserModifyBbItem(row,currentUser);
                  if(!canModify){
                    return(0,a.jsx)("span",{
                      title:"Hanya Satker pemilik LP atau Superadmin yang dapat mengubah data ini",
                      "aria-label":"Terkunci (Hanya Satker pemilik LP atau Superadmin)",
                      style:{
                        width:"28px",
                        height:"28px",
                        minHeight:"28px",
                        display:"inline-flex",
                        alignItems:"center",
                        justifyContent:"center",
                        borderRadius:6,
                        border:"1px solid var(--cas-border, #e2e8f0)",
                        background:"var(--cas-bg-subtle, #f1f5f9)",
                        color:"#94a3b8",
                        cursor:"not-allowed",
                        fontSize:"0.78rem",
                        userSelect:"none"
                      },
                      children:"🔒"
                    });
                  }
                  let isDors="DORS"===String(row.sumber||"").toUpperCase()||String(row.row_id||"").startsWith("dors-"),
                      canDeleteManual=!isDors&&row.can_delete!==!1;
                  return(0,a.jsxs)("div",{
                    style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"0.2rem"},
                    children:[
                      (0,a.jsx)("button",{
                        type:"button",
                        onClick:()=>openEditModal(row),
                        title:isDors?"Lengkapi Satuan Barang Bukti DORS":"Edit Barang Bukti Manual",
                        className:"att-btn",
                        style:{
                          width:"26px",
                          height:"26px",
                          minHeight:"26px",
                          padding:0,
                          display:"inline-flex",
                          alignItems:"center",
                          justifyContent:"center",
                          borderRadius:6,
                          border:isDors?"1px solid #93c5fd":"1px solid var(--cas-border, #cbd5e1)",
                          background:isDors?"#eff6ff":"var(--cas-bg-surface, #fff)",
                          color:isDors?"#1d4ed8":"var(--cas-text-primary, #0f172a)",
                          cursor:"pointer"
                        },
                        children:(0,a.jsx)("i",{className:"pi pi-pencil",style:{fontSize:"0.74rem"}})
                      }),
                      canDeleteManual&&(0,a.jsx)("button",{
                        type:"button",
                        onClick:()=>handleDelete(row),
                        title:"Hapus Barang Bukti Manual",
                        className:"att-btn",
                        style:{
                          width:"26px",
                          height:"26px",
                          minHeight:"26px",
                          padding:0,
                          display:"inline-flex",
                          alignItems:"center",
                          justifyContent:"center",
                          borderRadius:6,
                          border:"1px solid #fecaca",
                          background:"#fef2f2",
                          color:"#dc2626",
                          cursor:"pointer"
                        },
                        children:(0,a.jsx)("i",{className:"pi pi-trash",style:{fontSize:"0.74rem"}})
                      })
                    ]
                  });
                }
              })
            ]
          })
        ]
      }),
      editModalOpen&&(0,a.jsx)("div",{
        className:"cas-bb-modal-backdrop",
        onClick:()=>{if(!editSaving){setEditModalOpen(!1);setEditModalMax(!1)}},
        style:{
          position:"fixed",
          inset:0,
          zIndex:3200,
          background:"rgba(15, 23, 42, 0.55)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          padding:editModalMax?"0":"1rem"
        },
        children:(0,a.jsxs)("div",{
          onClick:ev=>ev.stopPropagation(),
          style:{
            width:"100%",
            maxWidth:editModalMax?"100vw":"34rem",
            height:editModalMax?"100vh":"auto",
            maxHeight:editModalMax?"100vh":"90vh",
            display:"flex",
            flexDirection:"column",
            background:"var(--cas-bg-surface, #ffffff)",
            border:editModalMax?"none":"1px solid var(--cas-border-card, #dbe3ee)",
            borderRadius:editModalMax?0:12,
            boxShadow:"0 20px 48px rgba(15, 23, 42, 0.28)",
            overflow:"hidden",
            transition:"max-width 0.18s ease, max-height 0.18s ease"
          },
          children:[
            (0,a.jsxs)("div",{
              style:{
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                gap:"0.75rem",
                padding:"0.9rem 1.15rem",
                borderBottom:"1px solid var(--cas-border, #e2e8f0)",
                flexShrink:0
              },
              children:[
                (0,a.jsxs)("div",{
                  style:{minWidth:0,flex:"1 1 auto"},
                  children:[
                    (0,a.jsx)("div",{
                      style:{fontWeight:800,fontSize:"0.96rem",color:"var(--cas-text-primary, #0f172a)"},
                      children:editForm.isDorsRow?"Mode Lengkapi Satuan (Data DORS)":"Edit Data Barang Bukti"
                    }),
                    (0,a.jsx)("div",{
                      style:{fontSize:"0.73rem",color:"var(--cas-text-secondary, #64748b)",marginTop:"0.12rem"},
                      children:editForm.isDorsRow
                        ?"Lengkapi satuan standar barang bukti DORS agar dapat direkapitulasi dan dihitung."
                        :"Perbarui klasifikasi jenis, detail, jumlah numerik, dan satuan barang bukti."
                    })
                  ]
                }),
                (0,a.jsxs)("div",{
                  style:{display:"flex",alignItems:"center",gap:"0.4rem",flexShrink:0},
                  children:[
                    (0,a.jsx)("button",{
                      type:"button",
                      onClick:()=>setEditModalMax(m=>!m),
                      title:editModalMax?"Perkecil Ukuran Modal":"Perbesar Ukuran Modal",
                      className:"p-dialog-header-icon p-dialog-header-maximize p-link",
                      style:{
                        background:"var(--cas-bg-subtle, #f1f5f9)",
                        border:"1px solid var(--cas-border, #cbd5e1)",
                        borderRadius:6,
                        width:"30px",
                        height:"30px",
                        display:"inline-flex",
                        alignItems:"center",
                        justifyContent:"center",
                        color:"var(--cas-text-secondary, #475569)",
                        cursor:"pointer",
                        padding:0
                      },
                      children:(0,a.jsx)("i",{className:editModalMax?"pi pi-window-minimize":"pi pi-window-maximize",style:{fontSize:"0.78rem"}})
                    }),
                    (0,a.jsx)("button",{
                      type:"button",
                      onClick:()=>{if(!editSaving){setEditModalOpen(!1);setEditModalMax(!1)}},
                      title:"Tutup",
                      style:{
                        background:"var(--cas-bg-subtle, #f1f5f9)",
                        border:"1px solid var(--cas-border, #cbd5e1)",
                        borderRadius:6,
                        width:"30px",
                        height:"30px",
                        display:"inline-flex",
                        alignItems:"center",
                        justifyContent:"center",
                        fontSize:"1.15rem",
                        color:"var(--cas-text-secondary, #475569)",
                        cursor:"pointer",
                        lineHeight:1,
                        padding:0
                      },
                      children:"×"
                    })
                  ]
                })
              ]
            }),
            (0,a.jsxs)("form",{
              className:"p-dialog-content cas-std-modal-body",
              onSubmit:handleSaveEdit,
              style:{padding:"1rem 1.15rem",display:"flex",flexDirection:"column",gap:"0.75rem",overflowY:"auto",WebkitOverflowScrolling:"touch",flex:"1 1 auto",minHeight:0},
              children:[
                editForm.isDorsRow&&(0,a.jsxs)("div",{
                  style:{
                    background:"#eff6ff",
                    border:"1px solid #bfdbfe",
                    borderRadius:8,
                    padding:"0.55rem 0.75rem",
                    fontSize:"0.74rem",
                    color:"#1e40af",
                    lineHeight:1.4
                  },
                  children:[
                    (0,a.jsx)("strong",{children:"Informasi Data DORS: "}),
                    "Data Nomor LP, Jenis, Nama/Detail Barang, dan Jumlah asli dari DORS dikunci (read-only). Hanya bagian ",
                    (0,a.jsx)("strong",{children:"Satuan Barang"}),
                    " yang dapat dilengkapi."
                  ]
                }),
                editError&&(0,a.jsx)("div",{
                  role:"alert",
                  style:{
                    background:"#fef2f2",
                    border:"1px solid #fecaca",
                    borderRadius:8,
                    padding:"0.5rem 0.75rem",
                    fontSize:"0.74rem",
                    fontWeight:600,
                    color:"#b91c1c"
                  },
                  children:editError
                }),
                (0,a.jsxs)("div",{
                  children:[
                    (0,a.jsx)("label",{
                      htmlFor:"bb-edit-nolp",
                      style:{display:"block",fontSize:"0.73rem",fontWeight:700,color:"var(--cas-text-secondary, #475569)",marginBottom:"0.25rem"},
                      children:"Nomor Laporan Polisi (LP)"
                    }),
                    (0,a.jsx)(i.InputText,{
                      id:"bb-edit-nolp",
                      name:"no_laporan",
                      value:editForm.no_laporan,
                      disabled:!0,
                      readOnly:!0,
                      style:{width:"100%",background:"var(--cas-bg-subtle, #f1f5f9)",opacity:0.85}
                    })
                  ]
                }),
                (0,a.jsxs)("div",{
                  children:[
                    (0,a.jsx)("label",{
                      htmlFor:"bb-edit-jenis",
                      style:{display:"block",fontSize:"0.73rem",fontWeight:700,color:"var(--cas-text-secondary, #475569)",marginBottom:"0.25rem"},
                      children:"Jenis Barang (Master Klasifikasi Indonesia)"
                    }),
                    (0,a.jsx)(r.Dropdown,{
                      id:"bb-edit-jenis",
                      inputId:"bb-edit-jenis-select",
                      name:"jenis_barang",
                      value:editForm.jenis,
                      options:masterJenisOptions,
                      optionLabel:"label",
                      optionValue:"value",
                      disabled:editForm.isDorsRow,
                      filter:!0,
                      onChange:ev=>setEditForm(prev=>({...prev,jenis:ev.value})),
                      placeholder:"Pilih Kategori Jenis Barang…",
                      style:{width:"100%",background:editForm.isDorsRow?"var(--cas-bg-subtle, #f1f5f9)":void 0}
                    })
                  ]
                }),
                (0,a.jsxs)("div",{
                  children:[
                    (0,a.jsx)("label",{
                      htmlFor:"bb-edit-detail",
                      style:{display:"block",fontSize:"0.73rem",fontWeight:700,color:"var(--cas-text-secondary, #475569)",marginBottom:"0.25rem"},
                      children:"Nama / Detail Barang"
                    }),
                    (0,a.jsx)(i.InputText,{
                      id:"bb-edit-detail",
                      name:"nama_detail_barang",
                      value:editForm.keterangan,
                      disabled:editForm.isDorsRow,
                      readOnly:editForm.isDorsRow,
                      onChange:ev=>setEditForm(prev=>({...prev,keterangan:ev?.target?.value??""})),
                      placeholder:"Contoh: Senter Warna Kuning Hitam / Ayam Bangkok / Honda Beat…",
                      style:{width:"100%",background:editForm.isDorsRow?"var(--cas-bg-subtle, #f1f5f9)":void 0}
                    })
                  ]
                }),
                (0,a.jsxs)("div",{
                  style:{display:"grid",gridTemplateColumns:"1fr 1.25fr",gap:"0.65rem"},
                  children:[
                    (0,a.jsxs)("div",{
                      children:[
                        (0,a.jsx)("label",{
                          htmlFor:"bb-edit-jumlah",
                          style:{display:"block",fontSize:"0.73rem",fontWeight:700,color:"var(--cas-text-secondary, #475569)",marginBottom:"0.25rem"},
                          children:"Jumlah (Numerik)"
                        }),
                        (0,a.jsx)(i.InputText,{
                          id:"bb-edit-jumlah",
                          name:"jumlah_numeric",
                          type:"number",
                          min:"0",
                          step:"any",
                          value:editForm.jumlah,
                          disabled:editForm.isDorsRow,
                          readOnly:editForm.isDorsRow,
                          onChange:ev=>setEditForm(prev=>({...prev,jumlah:ev?.target?.value??""})),
                          placeholder:"0",
                          style:{width:"100%",background:editForm.isDorsRow?"var(--cas-bg-subtle, #f1f5f9)":void 0}
                        })
                      ]
                    }),
                    (0,a.jsxs)("div",{
                      children:[
                        (0,a.jsxs)("label",{
                          htmlFor:"bb-edit-satuan",
                          style:{display:"block",fontSize:"0.73rem",fontWeight:700,color:"#0369a1",marginBottom:"0.25rem"},
                          children:[
                            "Satuan Barang (Standar & Input Wilayah) ",
                            (0,a.jsx)("span",{style:{color:"#ef4444"},children:"*"})
                          ]
                        }),
                        (0,a.jsx)(r.Dropdown,{
                          id:"bb-edit-satuan",
                          inputId:"bb-edit-satuan-select",
                          name:"satuan_barang",
                          value:editForm.satuan,
                          options:satuanDropdownOptions,
                          optionLabel:"label",
                          optionValue:"value",
                          filter:!0,
                          editable:!0,
                          onChange:ev=>setEditForm(prev=>({...prev,satuan:ev.value||""})),
                          onBlur:()=>setEditForm(prev=>({...prev,satuan:matchSatuanIndonesia(prev.satuan)||prev.satuan||""})),
                          placeholder:"Pilih atau ketik Satuan (Buah, Unit, Kg, Meter…)",
                          style:{width:"100%",border:"1.5px solid #38bdf8"}
                        })
                      ]
                    })
                  ]
                }),
                !editForm.isDorsRow&&(0,a.jsxs)("div",{
                  style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"},
                  children:[
                    (0,a.jsxs)("div",{
                      children:[
                        (0,a.jsx)("label",{
                          htmlFor:"bb-edit-noreg",
                          style:{display:"block",fontSize:"0.73rem",fontWeight:700,color:"var(--cas-text-secondary, #475569)",marginBottom:"0.25rem"},
                          children:"Nomor Register BB"
                        }),
                        (0,a.jsx)(i.InputText,{
                          id:"bb-edit-noreg",
                          name:"nomor_register",
                          value:editForm.nomor_register,
                          onChange:ev=>setEditForm(prev=>({...prev,nomor_register:ev?.target?.value??""})),
                          placeholder:"Nomor Register BB…",
                          style:{width:"100%"}
                        })
                      ]
                    }),
                    (0,a.jsxs)("div",{
                      children:[
                        (0,a.jsx)("label",{
                          htmlFor:"bb-edit-pemilik",
                          style:{display:"block",fontSize:"0.73rem",fontWeight:700,color:"var(--cas-text-secondary, #475569)",marginBottom:"0.25rem"},
                          children:"Kepemilikan"
                        }),
                        (0,a.jsx)(i.InputText,{
                          id:"bb-edit-pemilik",
                          name:"kepemilikan",
                          value:editForm.kepemilikan,
                          onChange:ev=>setEditForm(prev=>({...prev,kepemilikan:ev?.target?.value??""})),
                          placeholder:"Nama pemilik / pihak…",
                          style:{width:"100%"}
                        })
                      ]
                    })
                  ]
                }),
                (0,a.jsxs)("div",{
                  style:{
                    display:"flex",
                    justifyContent:"flex-end",
                    alignItems:"center",
                    gap:"0.55rem",
                    marginTop:"0.35rem",
                    paddingTop:"0.75rem",
                    borderTop:"1px solid var(--cas-border, #e2e8f0)"
                  },
                  children:[
                    (0,a.jsx)("button",{
                      type:"button",
                      disabled:editSaving,
                      onClick:()=>setEditModalOpen(!1),
                      className:"att-btn",
                      style:{height:"36px",padding:"0 0.95rem"},
                      children:"Batal"
                    }),
                    (0,a.jsx)("button",{
                      type:"submit",
                      disabled:editSaving,
                      className:"att-btn primary",
                      style:{height:"36px",padding:"0 1.1rem",fontWeight:700},
                      children:editSaving?"Menyimpan…":(editForm.isDorsRow?"Simpan Satuan":"Simpan Perubahan")
                    })
                  ]
                })
              ]
            })
          ]
        })
      })
    ]
  });
}

function RekapBarangBuktiFallbackView(){
  let[rows,setRows]=(0,l.useState)([]),
     [loading,setLoading]=(0,l.useState)(!0),
     [overrides,setOverrides]=(0,l.useState)(()=>loadBbOverrides());
  (0,l.useEffect)(()=>{
    let active=!0;
    o.apiAuth.get("/bdb/barang-bukti",{params:{page:1,row:25}}).then(res=>{
      if(!active)return;
      let d=res?.data?.data||[];
      setRows(Array.isArray(d)?d.filter(Boolean):[]);
      setLoading(!1);
      setOverrides(loadBbOverrides());
    }).catch(()=>{
      if(active){setRows([]);setLoading(!1)}
    });
    return()=>{active=!1};
  },[]);
  return(0,a.jsxs)("div",{
    style:{width:"100%",maxWidth:"100%",boxSizing:"border-box"},
    children:[
      (0,a.jsx)("h1",{className:"cms-page-title",children:"Rekap Barang Bukti"}),
      (0,a.jsx)("p",{className:"cms-page-sub",children:"Gabungan data barang bukti hasil sinkronisasi DORS dan entri manual pada detail Laporan Polisi di seluruh Satker dalam cakupan Anda."}),
      (0,a.jsx)("div",{
        className:"cms-card",
        style:{padding:"0.75rem",overflowX:"hidden"},
        children:(0,a.jsxs)("table",{
          style:{width:"100%",tableLayout:"fixed",borderCollapse:"collapse",fontSize:"0.76rem"},
          children:[
            (0,a.jsx)("thead",{
              children:(0,a.jsxs)("tr",{
                style:{borderBottom:"2px solid var(--cas-border, #e2e8f0)",textAlign:"left"},
                children:[
                  (0,a.jsx)("th",{style:{width:"4%",padding:"0.5rem"},children:"NO"}),
                  (0,a.jsx)("th",{style:{width:"25%",padding:"0.5rem"},children:"JENIS & NAMA / DETAIL BARANG"}),
                  (0,a.jsx)("th",{style:{width:"13%",padding:"0.5rem"},children:"JUMLAH & SATUAN"}),
                  (0,a.jsx)("th",{style:{width:"18%",padding:"0.5rem"},children:"NO. LAPORAN"}),
                  (0,a.jsx)("th",{style:{width:"20%",padding:"0.5rem"},children:"SATKER PENANGANAN"}),
                  (0,a.jsx)("th",{style:{width:"12%",padding:"0.5rem"},children:"TINDAK PIDANA"}),
                  (0,a.jsx)("th",{style:{width:"8%",padding:"0.5rem",textAlign:"center"},children:"SUMBER"})
                ]
              })
            }),
            (0,a.jsx)("tbody",{
              children:loading
                ?(0,a.jsx)("tr",{children:(0,a.jsx)("td",{colSpan:7,style:{padding:"1.5rem",textAlign:"center"},children:"Memuat data barang bukti…"})})
                :rows.length===0
                ?(0,a.jsx)("tr",{children:(0,a.jsx)("td",{colSpan:7,style:{padding:"1.5rem",textAlign:"center"},children:"Tidak ada data barang bukti."})})
                :rows.map((r,idx)=>{
                  let key=getRowOverrideKey(r),
                      ov=overrides?.[key]||{},
                      cls=classifyJenisBarang(ov.jenis??r.jenis_barang??r.jenis,ov.keterangan??r.nama_barang??r.keterangan),
                      js=parseJumlahSatuan(r,overrides),
                      isDors="DORS"===String(r.sumber||"").toUpperCase();
                  return(0,a.jsxs)("tr",{
                    style:{borderBottom:"1px solid var(--cas-border, #e2e8f0)"},
                    children:[
                      (0,a.jsx)("td",{style:{padding:"0.45rem 0.5rem"},children:idx+1}),
                      (0,a.jsxs)("td",{
                        style:{padding:"0.45rem 0.5rem",overflow:"hidden"},
                        children:[
                          (0,a.jsx)("div",{style:{fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:cls.jenis}),
                          (0,a.jsx)("div",{style:{color:"#64748b",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:cls.detail})
                        ]
                      }),
                      (0,a.jsx)("td",{style:{padding:"0.45rem 0.5rem"},children:`${js.jumlah||""} ${js.satuan||""}`.trim()||"—"}),
                      (0,a.jsx)("td",{style:{padding:"0.45rem 0.5rem",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:r.no_laporan||"—"}),
                      (0,a.jsx)("td",{style:{padding:"0.45rem 0.5rem"},children:renderSatkerCell(r)}),
                      (0,a.jsx)("td",{style:{padding:"0.45rem 0.5rem"},children:renderTindakPidanaCell(r)}),
                      (0,a.jsx)("td",{style:{padding:"0.45rem 0.5rem",textAlign:"center"},children:isDors?"DORS":"Manual"})
                    ]
                  },key||idx);
                })
            })
          ]
        })
      })
    ]
  });
}

class RekapBarangBuktiSafeBoundary extends (l.Component||class{}){
  constructor(props){
    super(props);
    this.state={hasError:!1,retryKey:0};
  }
  static getDerivedStateFromError(){
    return{hasError:!0};
  }
  componentDidCatch(err,info){
    try{console.error("[RekapBarangBukti] Caught error:",err,info)}catch{}
    clearBbSessionCaches();
    if(this.state.retryKey<2){
      setTimeout(()=>{
        try{this.setState(s=>({hasError:!1,retryKey:s.retryKey+1}))}catch{}
      },50);
    }
  }
  render(){
    if(this.state.hasError&&this.state.retryKey>=2){
      return(0,a.jsx)(RekapBarangBuktiFallbackView,{});
    }
    return(0,a.jsx)(RekapBarangBuktiInner,{},String(this.state.retryKey));
  }
}

e.s(["default",0,function RekapBarangBuktiPage(){
  if(l.Component){
    return(0,a.jsx)(RekapBarangBuktiSafeBoundary,{});
  }
  return(0,a.jsx)(RekapBarangBuktiInner,{});
}])}]);
