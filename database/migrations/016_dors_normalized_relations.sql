-- 016_dors_normalized_relations.sql
-- Tabel normalisasi relasi LP DORS (dibuat otomatis oleh DorsService.ensureNormalizedTables()).
-- Tiap relasi objek/array dipecah ke tabel sendiri (prefiks bdb_dors_lp_*); tak ada obj/array tersisa.
-- Idempotent lewat kode; file untuk referensi/deploy. CREATE TABLE -> tambah IF NOT EXISTS saat pakai manual.

--
--






--
-- Name: bdb_dors_lp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp (
    id bigint NOT NULL,
    raw_id bigint,
    dors_lp_id bigint NOT NULL,
    model_lp text NOT NULL,
    data_scope text,
    import_batch text,
    source_created_at text,
    source_updated_at text,
    synced_at timestamp without time zone DEFAULT now() NOT NULL,
    apa_terjadi text,
    bagaimana_terjadi text,
    dilimpahkan text,
    id_emp_modus_operandi text,
    id_emp_motif_kejahatan text,
    id_emp_sasaran_kejahatan text,
    id_hubungan_korban_pelaku text,
    id_kategori_lokasi text,
    id_operasi text,
    id_pasal_kamtibmas text,
    id_polda text,
    id_polres text,
    id_polsek text,
    id_satuan text,
    id_unit_terusan text,
    kategori text,
    kerugian text,
    nama_mengetahui text,
    nama_pembuat text,
    no_laporan text,
    no_sttlp text,
    nrp_mengetahui text,
    nrp_pembuat text,
    nrp_penerima text,
    pangkat_mengetahui text,
    pangkat_pembuat text,
    pelimpahan text,
    perhatian_publik text,
    redaksional_mengetahui_spkt text,
    status_aktif text,
    tempat_kejadian text,
    tgl_laporan text,
    tkp_id_desa text,
    tkp_id_kecamatan text,
    tkp_id_kota text,
    tkp_id_provinsi text,
    uraian_kejadian text,
    uraian_singkat_kejadian text,
    waktu_kejadian text,
    waktu_kejadian_faktual text,
    zona_waktu text
);


--
-- Name: bdb_dors_lp_barang_bukti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_barang_bukti (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    id_laporan text,
    kode_bb text,
    jenis_bb text,
    jumlah text,
    keterangan text,
    ran_jenis text,
    ran_merk text,
    ran_model text,
    ran_type text,
    ran_warna text,
    ran_warna_tnkb text,
    ran_no_registrasi text,
    ran_no_rangka text,
    ran_no_mesin text,
    ran_no_bpkb text,
    ran_nama_pemilik text,
    ran_alamat text,
    ran_thn_pembuatan text,
    ran_thn_registrasi text,
    ran_isi_silinder text,
    ran_bahan_bakar text,
    source_created_at text,
    source_updated_at text
);


--
-- Name: bdb_dors_lp_barang_bukti_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_barang_bukti_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_barang_bukti_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_barang_bukti_id_seq OWNED BY public.bdb_dors_lp_barang_bukti.id;


--
-- Name: bdb_dors_lp_hubungan_korban_pelaku; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_hubungan_korban_pelaku (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    nama text
);


--
-- Name: bdb_dors_lp_hubungan_korban_pelaku_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_hubungan_korban_pelaku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_hubungan_korban_pelaku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_hubungan_korban_pelaku_id_seq OWNED BY public.bdb_dors_lp_hubungan_korban_pelaku.id;


--
-- Name: bdb_dors_lp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_id_seq OWNED BY public.bdb_dors_lp.id;


--
-- Name: bdb_dors_lp_kategori_gk; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_kategori_gk (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    id_emp text,
    id_sub_golongan text,
    id_uu text,
    pasal text,
    pasal_mapping text,
    keterangan text,
    kasus_menonjol text,
    atensi_pimpinan text
);


--
-- Name: bdb_dors_lp_kategori_gk_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_kategori_gk_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_kategori_gk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_kategori_gk_id_seq OWNED BY public.bdb_dors_lp_kategori_gk.id;


--
-- Name: bdb_dors_lp_kategori_lokasi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_kategori_lokasi (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    id_emp text,
    lokasi text
);


--
-- Name: bdb_dors_lp_kategori_lokasi_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_kategori_lokasi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_kategori_lokasi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_kategori_lokasi_id_seq OWNED BY public.bdb_dors_lp_kategori_lokasi.id;


--
-- Name: bdb_dors_lp_petugas_penerima; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_petugas_penerima (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    nrp_admin text,
    username text,
    nama text,
    pangkat text,
    email text,
    no_telpon text
);


--
-- Name: bdb_dors_lp_petugas_penerima_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_petugas_penerima_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_petugas_penerima_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_petugas_penerima_id_seq OWNED BY public.bdb_dors_lp_petugas_penerima.id;


--
-- Name: bdb_dors_lp_polda; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_polda (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    kode text,
    nama text,
    alamat text,
    kode_pusiknas text,
    jml_desa text,
    jml_kel text,
    jml_penduduk text,
    jml_pers_dsp text,
    jml_pers_riil text,
    luas_wilayah text
);


--
-- Name: bdb_dors_lp_polda_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_polda_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_polda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_polda_id_seq OWNED BY public.bdb_dors_lp_polda.id;


--
-- Name: bdb_dors_lp_polres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_polres (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    kode text,
    nama text,
    alamat text,
    kode_polda text,
    kode_pusiknas text,
    jml_desa text,
    jml_kel text,
    jml_penduduk text,
    jml_pers_dsp text,
    jml_pers_riil text,
    luas_wilayah text
);


--
-- Name: bdb_dors_lp_polres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_polres_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_polres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_polres_id_seq OWNED BY public.bdb_dors_lp_polres.id;


--
-- Name: bdb_dors_lp_polsek; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_polsek (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    kode text,
    nama text,
    alamat text,
    alamat_web text,
    kode_polda text,
    kode_polres text,
    kode_pusiknas text,
    jml_desa text,
    jml_kel text,
    jml_penduduk text,
    jml_pers_dsp text,
    jml_pers_riil text,
    luas_wilayah text
);


--
-- Name: bdb_dors_lp_polsek_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_polsek_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_polsek_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_polsek_id_seq OWNED BY public.bdb_dors_lp_polsek.id;


--
-- Name: bdb_dors_lp_terlibat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_terlibat (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    id_laporan text,
    nama text,
    nik text,
    jenis_identitas text,
    jenis_kelamin text,
    gender text,
    tempat_lahir text,
    tgl_lahir text,
    umur text,
    agama text,
    suku text,
    kewarganegaraan text,
    pekerjaan text,
    pendidikan_terakhir text,
    alamat text,
    alamat_non_nkri text,
    no_hp text,
    telphone text,
    email text,
    sosmed text,
    keterlibatan text,
    jenis_korban text,
    status_korban text,
    nomor_visum text,
    source_created_at text,
    source_updated_at text
);


--
-- Name: bdb_dors_lp_terlibat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_terlibat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_terlibat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_terlibat_id_seq OWNED BY public.bdb_dors_lp_terlibat.id;


--
-- Name: bdb_dors_lp_tindak_pidana; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_tindak_pidana (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    id_lp text,
    id_kategori_kejahatan text,
    nama_kategori_kejahatan text,
    id_uu text,
    nama_uu text,
    pasal text,
    pasal_tambahan text,
    pasal_mapping text,
    juncto text,
    subsider text,
    source_updated_at text
);


--
-- Name: bdb_dors_lp_tindak_pidana_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_tindak_pidana_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_tindak_pidana_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_tindak_pidana_id_seq OWNED BY public.bdb_dors_lp_tindak_pidana.id;


--
-- Name: bdb_dors_lp_tkp_desa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_tkp_desa (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    kode_provinsi text,
    kode_kabupaten text,
    kode_kecamatan text,
    kode_desa text,
    desa text,
    singkatan text
);


--
-- Name: bdb_dors_lp_tkp_desa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_tkp_desa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_tkp_desa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_tkp_desa_id_seq OWNED BY public.bdb_dors_lp_tkp_desa.id;


--
-- Name: bdb_dors_lp_tkp_kecamatan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_tkp_kecamatan (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    kode_provinsi text,
    kode_kabupaten text,
    kode_kecamatan text,
    kecamatan text,
    singkatan text
);


--
-- Name: bdb_dors_lp_tkp_kecamatan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_tkp_kecamatan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_tkp_kecamatan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_tkp_kecamatan_id_seq OWNED BY public.bdb_dors_lp_tkp_kecamatan.id;


--
-- Name: bdb_dors_lp_tkp_kota; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_tkp_kota (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    kode_provinsi text,
    kode_kabupaten text,
    kabupaten text,
    ibukota text,
    singkatan text
);


--
-- Name: bdb_dors_lp_tkp_kota_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_tkp_kota_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_tkp_kota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_tkp_kota_id_seq OWNED BY public.bdb_dors_lp_tkp_kota.id;


--
-- Name: bdb_dors_lp_tkp_provinsi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_tkp_provinsi (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    kode_provinsi text,
    provinsi text,
    singkatan text
);


--
-- Name: bdb_dors_lp_tkp_provinsi_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_tkp_provinsi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_tkp_provinsi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_tkp_provinsi_id_seq OWNED BY public.bdb_dors_lp_tkp_provinsi.id;


--
-- Name: bdb_dors_lp_unit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bdb_dors_lp_unit (
    id bigint NOT NULL,
    lp_id bigint NOT NULL,
    dors_lp_id bigint,
    model_lp text,
    dors_ref_id text,
    unit text,
    level text,
    id_emp text
);


--
-- Name: bdb_dors_lp_unit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bdb_dors_lp_unit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bdb_dors_lp_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bdb_dors_lp_unit_id_seq OWNED BY public.bdb_dors_lp_unit.id;


--
-- Name: bdb_dors_lp id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_id_seq'::regclass);


--
-- Name: bdb_dors_lp_barang_bukti id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_barang_bukti ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_barang_bukti_id_seq'::regclass);


--
-- Name: bdb_dors_lp_hubungan_korban_pelaku id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_hubungan_korban_pelaku ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_hubungan_korban_pelaku_id_seq'::regclass);


--
-- Name: bdb_dors_lp_kategori_gk id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_kategori_gk ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_kategori_gk_id_seq'::regclass);


--
-- Name: bdb_dors_lp_kategori_lokasi id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_kategori_lokasi ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_kategori_lokasi_id_seq'::regclass);


--
-- Name: bdb_dors_lp_petugas_penerima id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_petugas_penerima ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_petugas_penerima_id_seq'::regclass);


--
-- Name: bdb_dors_lp_polda id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polda ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_polda_id_seq'::regclass);


--
-- Name: bdb_dors_lp_polres id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polres ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_polres_id_seq'::regclass);


--
-- Name: bdb_dors_lp_polsek id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polsek ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_polsek_id_seq'::regclass);


--
-- Name: bdb_dors_lp_terlibat id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_terlibat ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_terlibat_id_seq'::regclass);


--
-- Name: bdb_dors_lp_tindak_pidana id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tindak_pidana ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_tindak_pidana_id_seq'::regclass);


--
-- Name: bdb_dors_lp_tkp_desa id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_desa ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_tkp_desa_id_seq'::regclass);


--
-- Name: bdb_dors_lp_tkp_kecamatan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_kecamatan ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_tkp_kecamatan_id_seq'::regclass);


--
-- Name: bdb_dors_lp_tkp_kota id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_kota ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_tkp_kota_id_seq'::regclass);


--
-- Name: bdb_dors_lp_tkp_provinsi id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_provinsi ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_tkp_provinsi_id_seq'::regclass);


--
-- Name: bdb_dors_lp_unit id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_unit ALTER COLUMN id SET DEFAULT nextval('public.bdb_dors_lp_unit_id_seq'::regclass);


--
-- Name: bdb_dors_lp_barang_bukti bdb_dors_lp_barang_bukti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_barang_bukti
    ADD CONSTRAINT bdb_dors_lp_barang_bukti_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp bdb_dors_lp_dors_lp_id_model_lp_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp
    ADD CONSTRAINT bdb_dors_lp_dors_lp_id_model_lp_key UNIQUE (dors_lp_id, model_lp);


--
-- Name: bdb_dors_lp_hubungan_korban_pelaku bdb_dors_lp_hubungan_korban_pelaku_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_hubungan_korban_pelaku
    ADD CONSTRAINT bdb_dors_lp_hubungan_korban_pelaku_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_hubungan_korban_pelaku bdb_dors_lp_hubungan_korban_pelaku_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_hubungan_korban_pelaku
    ADD CONSTRAINT bdb_dors_lp_hubungan_korban_pelaku_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_kategori_gk bdb_dors_lp_kategori_gk_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_kategori_gk
    ADD CONSTRAINT bdb_dors_lp_kategori_gk_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_kategori_gk bdb_dors_lp_kategori_gk_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_kategori_gk
    ADD CONSTRAINT bdb_dors_lp_kategori_gk_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_kategori_lokasi bdb_dors_lp_kategori_lokasi_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_kategori_lokasi
    ADD CONSTRAINT bdb_dors_lp_kategori_lokasi_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_kategori_lokasi bdb_dors_lp_kategori_lokasi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_kategori_lokasi
    ADD CONSTRAINT bdb_dors_lp_kategori_lokasi_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_petugas_penerima bdb_dors_lp_petugas_penerima_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_petugas_penerima
    ADD CONSTRAINT bdb_dors_lp_petugas_penerima_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_petugas_penerima bdb_dors_lp_petugas_penerima_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_petugas_penerima
    ADD CONSTRAINT bdb_dors_lp_petugas_penerima_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp bdb_dors_lp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp
    ADD CONSTRAINT bdb_dors_lp_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_polda bdb_dors_lp_polda_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polda
    ADD CONSTRAINT bdb_dors_lp_polda_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_polda bdb_dors_lp_polda_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polda
    ADD CONSTRAINT bdb_dors_lp_polda_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_polres bdb_dors_lp_polres_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polres
    ADD CONSTRAINT bdb_dors_lp_polres_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_polres bdb_dors_lp_polres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polres
    ADD CONSTRAINT bdb_dors_lp_polres_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_polsek bdb_dors_lp_polsek_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polsek
    ADD CONSTRAINT bdb_dors_lp_polsek_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_polsek bdb_dors_lp_polsek_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polsek
    ADD CONSTRAINT bdb_dors_lp_polsek_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_terlibat bdb_dors_lp_terlibat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_terlibat
    ADD CONSTRAINT bdb_dors_lp_terlibat_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_tindak_pidana bdb_dors_lp_tindak_pidana_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tindak_pidana
    ADD CONSTRAINT bdb_dors_lp_tindak_pidana_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_tkp_desa bdb_dors_lp_tkp_desa_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_desa
    ADD CONSTRAINT bdb_dors_lp_tkp_desa_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_tkp_desa bdb_dors_lp_tkp_desa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_desa
    ADD CONSTRAINT bdb_dors_lp_tkp_desa_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_tkp_kecamatan bdb_dors_lp_tkp_kecamatan_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_kecamatan
    ADD CONSTRAINT bdb_dors_lp_tkp_kecamatan_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_tkp_kecamatan bdb_dors_lp_tkp_kecamatan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_kecamatan
    ADD CONSTRAINT bdb_dors_lp_tkp_kecamatan_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_tkp_kota bdb_dors_lp_tkp_kota_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_kota
    ADD CONSTRAINT bdb_dors_lp_tkp_kota_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_tkp_kota bdb_dors_lp_tkp_kota_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_kota
    ADD CONSTRAINT bdb_dors_lp_tkp_kota_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_tkp_provinsi bdb_dors_lp_tkp_provinsi_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_provinsi
    ADD CONSTRAINT bdb_dors_lp_tkp_provinsi_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_tkp_provinsi bdb_dors_lp_tkp_provinsi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_provinsi
    ADD CONSTRAINT bdb_dors_lp_tkp_provinsi_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_unit bdb_dors_lp_unit_lp_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_unit
    ADD CONSTRAINT bdb_dors_lp_unit_lp_id_key UNIQUE (lp_id);


--
-- Name: bdb_dors_lp_unit bdb_dors_lp_unit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_unit
    ADD CONSTRAINT bdb_dors_lp_unit_pkey PRIMARY KEY (id);


--
-- Name: bdb_dors_lp_barang_bukti_lp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bdb_dors_lp_barang_bukti_lp_idx ON public.bdb_dors_lp_barang_bukti USING btree (lp_id);


--
-- Name: bdb_dors_lp_terlibat_lp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bdb_dors_lp_terlibat_lp_idx ON public.bdb_dors_lp_terlibat USING btree (lp_id);


--
-- Name: bdb_dors_lp_tindak_pidana_lp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bdb_dors_lp_tindak_pidana_lp_idx ON public.bdb_dors_lp_tindak_pidana USING btree (lp_id);


--
-- Name: bdb_dors_lp_barang_bukti bdb_dors_lp_barang_bukti_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_barang_bukti
    ADD CONSTRAINT bdb_dors_lp_barang_bukti_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_hubungan_korban_pelaku bdb_dors_lp_hubungan_korban_pelaku_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_hubungan_korban_pelaku
    ADD CONSTRAINT bdb_dors_lp_hubungan_korban_pelaku_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_kategori_gk bdb_dors_lp_kategori_gk_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_kategori_gk
    ADD CONSTRAINT bdb_dors_lp_kategori_gk_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_kategori_lokasi bdb_dors_lp_kategori_lokasi_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_kategori_lokasi
    ADD CONSTRAINT bdb_dors_lp_kategori_lokasi_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_petugas_penerima bdb_dors_lp_petugas_penerima_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_petugas_penerima
    ADD CONSTRAINT bdb_dors_lp_petugas_penerima_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_polda bdb_dors_lp_polda_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polda
    ADD CONSTRAINT bdb_dors_lp_polda_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_polres bdb_dors_lp_polres_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polres
    ADD CONSTRAINT bdb_dors_lp_polres_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_polsek bdb_dors_lp_polsek_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_polsek
    ADD CONSTRAINT bdb_dors_lp_polsek_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp bdb_dors_lp_raw_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp
    ADD CONSTRAINT bdb_dors_lp_raw_id_fkey FOREIGN KEY (raw_id) REFERENCES public.bdb_dors_raw_lp(id) ON DELETE SET NULL;


--
-- Name: bdb_dors_lp_terlibat bdb_dors_lp_terlibat_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_terlibat
    ADD CONSTRAINT bdb_dors_lp_terlibat_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_tindak_pidana bdb_dors_lp_tindak_pidana_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tindak_pidana
    ADD CONSTRAINT bdb_dors_lp_tindak_pidana_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_tkp_desa bdb_dors_lp_tkp_desa_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_desa
    ADD CONSTRAINT bdb_dors_lp_tkp_desa_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_tkp_kecamatan bdb_dors_lp_tkp_kecamatan_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_kecamatan
    ADD CONSTRAINT bdb_dors_lp_tkp_kecamatan_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_tkp_kota bdb_dors_lp_tkp_kota_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_kota
    ADD CONSTRAINT bdb_dors_lp_tkp_kota_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_tkp_provinsi bdb_dors_lp_tkp_provinsi_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_tkp_provinsi
    ADD CONSTRAINT bdb_dors_lp_tkp_provinsi_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
-- Name: bdb_dors_lp_unit bdb_dors_lp_unit_lp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bdb_dors_lp_unit
    ADD CONSTRAINT bdb_dors_lp_unit_lp_id_fkey FOREIGN KEY (lp_id) REFERENCES public.bdb_dors_lp(id) ON DELETE CASCADE;


--
--


