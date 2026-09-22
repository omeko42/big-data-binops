import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppCoreModule } from './app_core/app_core.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
// somewhere in your initialization file
import { ErrorExceptionFilter } from '@app_core/helper/service/errorException.helper.service';
import { CoreLogger } from '@app_core/helper/service/loger.service';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { runPendingMigrations } from './run-pending-migrations';
async function bootstrap() {
    // dotenv duluan di sini (bukan cuma nunggu baris dotenv.config() di bawah, atau
    // DatabaseModule punya sendiri) -- runPendingMigrations() butuh process.env.DB_* SEBELUM
    // NestFactory.create(AppModule) (yg baru trigger DatabaseModule-nya sendiri) supaya migration
    // pending selesai lebih dulu drpd ada service manapun sempat query tabel yg belum ada.
    dotenv.config();
    await runPendingMigrations();
    const app = await NestFactory.create(AppModule);
    const logger = new CoreLogger();
    app.useLogger(logger);
    const globalPrefix = process.env.GLOBAL_PREFIX || '';
    app.setGlobalPrefix(globalPrefix);
    const appCoreModule = app.get(AppCoreModule);
    appCoreModule.setApplication(app);
    dotenv.config();

    app.use(cookieParser());
    app.useGlobalFilters(new ErrorExceptionFilter());
    app.use(compression());
    // Enable CORS (Cross-Origin Resource Sharing)
    app.enableCors({
        origin: '*',
        // origin: process.env.FRONTEND,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Authorization,Content-Type, Accept',
        credentials: true
    });
    await app.listen(process.env.PORT);
}
bootstrap();
