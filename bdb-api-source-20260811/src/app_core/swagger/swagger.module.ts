import { Module, Global } from '@nestjs/common';
import { setupSwagger } from './swagger.config';

@Global()
@Module({
    providers: [
        {
            provide: 'SWAGGER_SETUP',
            useFactory: () => setupSwagger
        }
    ],
    exports: ['SWAGGER_SETUP']
})
export class SwaggerModule {}
