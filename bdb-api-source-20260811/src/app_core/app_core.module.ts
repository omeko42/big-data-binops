import { Module, OnModuleInit, INestApplication } from '@nestjs/common';
import { SwaggerModule } from './swagger/swagger.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RouteModule } from './auth/route/route.module';
import { HelperModule } from './helper/helper.module';
import { NetworkController } from './network/network.controller';

@Module({
    controllers: [NetworkController],
    imports: [HelperModule, SwaggerModule, DatabaseModule, AuthModule, RouteModule]
})
export class AppCoreModule implements OnModuleInit {
    private app: INestApplication;

    async onModuleInit() {
        if (this.app) {
            const swaggerSetup = this.app.get('SWAGGER_SETUP');
            swaggerSetup(this.app);
        }
    }

    setApplication(app: INestApplication) {
        this.app = app;
        this.onModuleInit(); // Ensure Swagger is set up when app is provided
    }
}
