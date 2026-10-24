
import { DpoController } from './dpo/dpo.controller';
import { DpoService } from './dpo/dpo.service';
import { BdbSnapshotOrchestratorController } from './common/snapshot-orchestrator.controller';
import { BdbJobQueueService } from './common/job-queue.service';
import { BdbSnapshotOrchestratorService } from './common/snapshot-orchestrator.service';
import { Module } from '@nestjs/common';
import { BdbMasterController } from './master/bdb-master.controller';
import { BdbRekapLpController } from './rekap-lp/bdb-rekap-lp.controller';
import { BdbMasterService } from './master/bdb-master.service';
import { BdbRekapLpService } from './rekap-lp/bdb-rekap-lp.service';
import { AuthModule } from '@app_core/auth/auth.module';
import { ExternalModule } from 'src/external/external.module';
import { BdbKermaController } from './kerma/bdb-kerma.controller';
import { BdbKermaService } from './kerma/bdb-kerma.service';
import { MinioService } from './kerma/minio.service';
import { DorsController } from './dors/dors.controller';
import { DorsService } from './dors/dors.service';
import { SatkerController } from './satker/satker.controller';
import { SatkerService } from './satker/satker.service';
import { SatkerLegacyReconciliationController } from './satker/satker-legacy-reconciliation.controller';
import { SatkerLegacyReconciliationService } from './satker/satker-legacy-reconciliation.service';
import { LaporanPolisiController } from './laporan-polisi/laporan-polisi.controller';
import { LaporanPolisiService } from './laporan-polisi/laporan-polisi.service';
import { MasterDataGapController } from './laporan-polisi/master-data-gap.controller';
import { MasterDataGapService } from './laporan-polisi/master-data-gap.service';
import { LpPelimpahanController } from './lp-pelimpahan/lp-pelimpahan.controller';
import { LpPelimpahanService } from './lp-pelimpahan/lp-pelimpahan.service';
import { WorkflowController } from './workflow/workflow.controller';
import { WorkflowService } from './workflow/workflow.service';
import { SatkerEksternalController } from './satker-eksternal/satker-eksternal.controller';
import { SatkerEksternalService } from './satker-eksternal/satker-eksternal.service';
import { JukrahController } from './jukrah/jukrah.controller';
import { JukrahService } from './jukrah/jukrah.service';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';
import { MenuAccessController } from './menu-access/menu-access.controller';
import { MenuAccessService } from './menu-access/menu-access.service';
import { AnevController } from './anev/anev.controller';
import { AnevService } from './anev/anev.service';
import { IntegrationClientController } from './integration-client/integration-client.controller';
import { IntegrationClientService } from './integration-client/integration-client.service';
import { PanduanController } from './panduan/panduan.controller';
import { PanduanService } from './panduan/panduan.service';
import { SystemSettingController } from './system-setting/system-setting.controller';
import { SystemSettingService } from './system-setting/system-setting.service';
import { PihakTerlibatController } from './pihak-terlibat/pihak-terlibat.controller';
import { PihakTerlibatService } from './pihak-terlibat/pihak-terlibat.service';
import { BdbOperasiSatgasController } from './operasi-satgas/bdb-operasi-satgas.controller';
import { BdbOperasiSatgasService } from './operasi-satgas/bdb-operasi-satgas.service';
import { BdbKasusMenonjolController } from './kasus-menonjol/bdb-kasus-menonjol.controller';
import { BdbKasusMenonjolService } from './kasus-menonjol/bdb-kasus-menonjol.service';
import { BdbKasusAtensiController } from './kasus-atensi/bdb-kasus-atensi.controller';
import { BdbKasusAtensiService } from './kasus-atensi/bdb-kasus-atensi.service';
import { KinerjaPerkaraController } from './kinerja-perkara/kinerja-perkara.controller';
import { KinerjaPerkaraService } from './kinerja-perkara/kinerja-perkara.service';
import { BarangBuktiController } from './barang-bukti/barang-bukti.controller';
import { BarangBuktiService } from './barang-bukti/barang-bukti.service';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { LoadTestController } from './load-test/load-test.controller';
import { LoadTestService } from './load-test/load-test.service';
import { LpMonitoringAccessService } from './common/lp-monitoring-access.service';

@Module({
    imports: [AuthModule, ExternalModule],
    controllers: [DpoController, BdbMasterController, BdbRekapLpController, BdbKermaController, DorsController, SatkerController, SatkerLegacyReconciliationController, LaporanPolisiController, MasterDataGapController, LpPelimpahanController, WorkflowController, SatkerEksternalController, JukrahController, AuditController, MenuAccessController, AnevController, IntegrationClientController, PanduanController, SystemSettingController, PihakTerlibatController, BdbOperasiSatgasController, BdbKasusMenonjolController, BdbKasusAtensiController, KinerjaPerkaraController, BarangBuktiController, NotificationsController, LoadTestController, BdbSnapshotOrchestratorController],
    providers: [DpoService, BdbMasterService, BdbRekapLpService, BdbKermaService, MinioService, DorsService, SatkerService, SatkerLegacyReconciliationService, LaporanPolisiService, MasterDataGapService, LpPelimpahanService, WorkflowService, SatkerEksternalService, JukrahService, AuditService, MenuAccessService, AnevService, IntegrationClientService, PanduanService, SystemSettingService, PihakTerlibatService, BdbOperasiSatgasService, BdbKasusMenonjolService, BdbKasusAtensiService, KinerjaPerkaraService, BarangBuktiService, NotificationsService, LoadTestService, LpMonitoringAccessService, BdbJobQueueService, BdbSnapshotOrchestratorService],
    exports: [BdbJobQueueService, BdbSnapshotOrchestratorService]
})
export class BdbModule {}




