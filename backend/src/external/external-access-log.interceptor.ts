import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { AuditService } from '../bdb/audit/audit.service';

/** Catat setiap pemanggilan /external/v1/* yang BERHASIL (lolos guard & handler). Gagal dicatat oleh ExternalHttpExceptionFilter. */
@Injectable()
export class ExternalAccessLogInterceptor implements NestInterceptor {
    constructor(private readonly audit: AuditService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest<Request>();
        return next.handle().pipe(
            tap(() => {
                const client = (request as any).integrationClient;
                void this.audit.log({
                    userId: client?.id,
                    userName: client?.username,
                    action: 'EXTERNAL_API_CALL',
                    entity: 'external_api',
                    entityId: client?.id,
                    meta: { method: request.method, path: request.originalUrl, query: request.query, outcome: 'SUCCESS' },
                    ip: request.ip
                });
            })
        );
    }
}
