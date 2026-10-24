import { Device } from '@app_core/auth/device/entities/device.entity';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource, Repository } from 'typeorm';

declare global {
    namespace Express {
        interface Response {
            sendSuccess(data: any): void;
        }
    }
}

@Injectable()
export class ResponseFormatService implements NestMiddleware {
    private readonly deviceRepository: Repository<Device>;
    constructor(private readonly dataSource: DataSource) {
        this.deviceRepository = this.dataSource.getRepository(Device);
    }
    async use(req: Request, res: Response, next: NextFunction) {
        res.sendSuccess = (data: any) => {
            res.status(res.statusCode || 200).json({
                status: 1,
                statusCode: res.statusCode || 200,
                timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
                path: req.originalUrl,
                routeName: (req as any).routeName,
                message: 'Success',
                system_message: [],
                errors: {},
                data: data
            });
        };
        next();
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
