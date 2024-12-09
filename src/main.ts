import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
dayjs.locale('ru');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: console,
    });

    app.setGlobalPrefix('api');

    app.use(cookieParser());

    app.enableCors({
        origin: '*',
        credentials: false,
        exposedHeaders: 'set-cookie',
    });

    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('swagger test')
        .setDescription('this is the test of swagger api')
        .build();
    const doc = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, doc);

    // Обеспечение статического доступа к папке uploads
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
    await app.listen(4200);
}
bootstrap();
