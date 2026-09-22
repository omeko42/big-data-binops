import { Module } from '@nestjs/common';
import { AgamaService } from './service/keterlibatan/agama.service';
import { AgamaController } from './controller/keterlibatan/agama.controller';
import { DesaController } from './controller/lokasi/desa.controller';
import { KabupatenController } from './controller/lokasi/kabupaten.controller';
import { KecamatanController } from './controller/lokasi/kecamatan.controller';
import { KewarganegaraanController } from './controller/keterlibatan/kewarganegaraan.controller';
import { PekerjaanController } from './controller/keterlibatan/pekerjaan.controller';
import { PendidikanController } from './controller/keterlibatan/pemdidikan.controller';
import { ProvinsiController } from './controller/lokasi/provinsi.controller';
import { DesaService } from './service/lokasi/desa.service';
import { KabupatenService } from './service/lokasi/kabupaten.service';
import { KecamatanService } from './service/lokasi/kecamatan.service';
import { KewarganegaraanService } from './service/keterlibatan/kewarganegaraan.service';
import { PekerjaanService } from './service/keterlibatan/pekerjaan.service';
import { PendidikanService } from './service/keterlibatan/pendidikan.service';
import { ProvinsiService } from './service/lokasi/provinsi.service';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { Auth } from '@app_core/helper/service/auth.helper.service';
import { SukuService } from './service/keterlibatan/suku.service';
import { SukuController } from './controller/keterlibatan/suku.controller';
import { UndangUndangController } from './controller/laporan/undang-undang.controller';
import { JenisKejahatanService } from './service/laporan/jenis-kejahatan.service';
import { UndangUndangService } from './service/laporan/undang-undang.service';
import { JenisKejahatanController } from './controller/laporan/jenis-kejahatan.controller';
import { IccsKategoriController } from './controller/laporan/iccs-kategori.controller';
import { IccsKategoriService } from './service/laporan/iccs-kategori.service';
import { SubGolonganKamtibmasController } from './controller/laporan/sub-golongan-kamtibmas.controller';
import { SubGolonganKamtibmasService } from './service/laporan/sub-golongan-kamtibmas.service';
import { GolonganKamtibmasController } from './controller/laporan/golongan-kamtibmas.controller';
import { GolonganKamtibmasService } from './service/laporan/golongan-kamtibmas.service';
import { KategoriLokasiController } from './controller/laporan/kategori-lokasi.controller';
import { KategoriLokasiService } from './service/laporan/kategori-lokasi.service';
import { ModusOperandiController } from './controller/laporan/modus-operandi.controller';
import { ModusOperandiService } from './service/laporan/modus-operandi.service';
import { MotifKejahatanController } from './controller/laporan/motif-kejahatan.controller';
import { MotifKejahatanService } from './service/laporan/motif-kejahatan.service';
import { GolonganKejahatanController } from './controller/laporan/golongan-kejahatan.controller';
import { GolonganKejahatanService } from './service/laporan/golongan-kejahatan.service';

@Module({
    controllers: [AgamaController, KewarganegaraanController, PekerjaanController, PendidikanController, ProvinsiController, KabupatenController, KecamatanController, DesaController, SukuController, UndangUndangController, JenisKejahatanController, IccsKategoriController, SubGolonganKamtibmasController, GolonganKamtibmasController, KategoriLokasiController, ModusOperandiController, MotifKejahatanController, GolonganKejahatanController],
    providers: [Auth, TableHelperService, AgamaService, KewarganegaraanService, PekerjaanService, PendidikanService, ProvinsiService, KabupatenService, KecamatanService, DesaService, SukuService, JenisKejahatanService, UndangUndangService, IccsKategoriService, SubGolonganKamtibmasService, GolonganKamtibmasService, KategoriLokasiService, ModusOperandiService, MotifKejahatanService, GolonganKejahatanService],
    exports: [Auth, TableHelperService, AgamaService, KewarganegaraanService, PekerjaanService, PendidikanService, ProvinsiService, KabupatenService, KecamatanService, DesaService, SukuService, JenisKejahatanService, UndangUndangService, IccsKategoriService, SubGolonganKamtibmasService, GolonganKamtibmasService, KategoriLokasiService, ModusOperandiService, MotifKejahatanService, GolonganKejahatanService],
    imports: []
})
export class DataMasterModule {}
