import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

export class CoreLogger implements LoggerService {
    private logger: winston.Logger;

    constructor() {
        const logDir = path.join(process.cwd(), 'logs');
        const logFile = path.join(logDir, 'application.log');

        // Buat folder 'public/logs' jika belum ada (rekursif)
        fs.mkdirSync(logDir, { recursive: true });

        this.logger = winston.createLogger({
            level: 'info', // Ubah ke 'debug' jika ingin semua level tercatat
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.File({
                    filename: logFile,
                    level: 'info' // Ubah ke 'debug' jika ingin menangkap semua
                }),
                new winston.transports.Console() // opsional, untuk debug di terminal juga
            ]
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace?: string) {
        this.logger.error(`${message} ${trace ? '- ' + trace : ''}`);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug?(message: string) {
        this.logger.debug?.(message);
    }

    verbose?(message: string) {
        this.logger.verbose?.(message);
    }
}
