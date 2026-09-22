import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';

export function setupSwaggerGroup(
    app: INestApplication,
    options: {
        path: string;
        title: string;
        description: string;
        modules?: any[];
        authUsers: Record<string, string>;
    }
) {
    const config = new DocumentBuilder()
        .setTitle(options.title)
        .setDescription(options.description)
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
            'access-token'
        )
        .build();

    app.use(
        `/${options.path}`,
        basicAuth({
            users: options.authUsers,
            challenge: true,
            realm: 'Swagger UI'
        })
    );

    const document = SwaggerModule.createDocument(app, config, {
        include: options.modules
    });

    SwaggerModule.setup(options.path, app, document);
}
