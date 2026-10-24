-- Klasifikasi ICCS (International Classification of Crime for Statistical Purposes) Level 1,
-- dikaitkan ke cm_jenis_kejahatan sbg pelengkap klasifikasi golongan/sub-golongan kamtibmas yg sudah ada.
-- Kolom created_by/updated_by/deleted_by/created_at/updated_at/deleted_at mengikuti pola embedded
-- `Timestamps` yg dipakai semua entity cm_* legacy lain (mis. cm_undang_undang) -- wajib ada persis
-- spt ini krn TypeORM synchronize:false, jadi kolom fisik harus sudah cocok dgn deklarasi entity.
create table if not exists cm_iccs_kategori (
    id bigserial primary key,
    kode int not null unique,
    nama text not null,
    keterangan text,
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp
);
alter table cm_iccs_kategori add column if not exists created_by bigint;
alter table cm_iccs_kategori add column if not exists updated_by bigint;
alter table cm_iccs_kategori add column if not exists deleted_by bigint;
alter table cm_iccs_kategori add column if not exists created_at timestamp not null default now();
alter table cm_iccs_kategori add column if not exists updated_at timestamp not null default now();
alter table cm_iccs_kategori add column if not exists deleted_at timestamp;

insert into cm_iccs_kategori (kode, nama, keterangan) values
(1, 'Tindakan yang Menyebabkan Kematian atau Berniat Menyebabkan Kematian', 'Pembunuhan, pembunuhan berencana, dan serangan mematikan.'),
(2, 'Tindakan yang Menyebabkan atau Berniat Menyebabkan Cedera Fisik', 'Penganiayaan, kekerasan fisik, dan pemukulan.'),
(3, 'Tindakan Melanggar Hukum yang Bersifat Seksual', 'Pemerkosaan, pelecehan seksual, dan eksploitasi seksual.'),
(4, 'Kejahatan terhadap Properti yang Melibatkan Kekerasan atau Ancaman', 'Perampokan dan pemerasan dengan kekerasan.'),
(5, 'Kejahatan terhadap Properti Saja (Tanpa Kekerasan)', 'Pencurian, pencurian rumah, dan perusakan barang.'),
(6, 'Kejahatan Terkait Narkoba atau Zat Psikoaktif', 'Peredaran, kepemilikan, dan produksi obat terlarang.'),
(7, 'Kejahatan Penipuan, Kecurangan, atau Korupsi', 'Suap, penggelapan, dan manipulasi keuangan.'),
(8, 'Tindakan Melanggar Ketertiban Umum dan Otoritas Negara', 'Perlawanan terhadap petugas dan pelanggaran aturan administratif.'),
(9, 'Kejahatan terhadap Keselamatan Publik dan Keamanan Negara', 'Terorisme, sabotase, dan kepemilikan senjata ilegal.'),
(10, 'Kejahatan terhadap Lingkungan Alam', 'Perusakan lingkungan hidup dan perdagangan satwa liar dilindungi.'),
(11, 'Tindakan Kriminal Lain yang Belum Diklasifikasikan di Atas', 'Segala bentuk pelanggaran hukum sisa yang tidak masuk dalam 10 kategori sebelumnya.')
on conflict (kode) do nothing;

-- FK di cm_jenis_kejahatan -- nama kolom ikuti konvensi penamaan default TypeORM utk relasi ManyToOne
-- tanpa @JoinColumn eksplisit (samakan dgn "subGolonganKamtibmasId" yg sudah ada di tabel ini).
alter table cm_jenis_kejahatan add column if not exists "iccsKategoriId" bigint references cm_iccs_kategori(id);
