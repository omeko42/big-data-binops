import { Module } from '@nestjs/common';
import { DpoController } from './dpo.controller';
import { DpoService } from './dpo.service';
import { MinioService } from '../kerma/minio.service';
import { AuditService } from '../audit/audit.service';

@Module({
    controllers: [DpoController],
    providers: [DpoService, MinioService, AuditService],
    exports: [DpoService]
})
export class DpoModule {}
