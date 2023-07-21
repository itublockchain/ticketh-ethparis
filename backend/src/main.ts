import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CONFIG } from 'src/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.APP_CORS,
  });
  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: process.env.API_VERSION,
  });

  const config = new DocumentBuilder()
    .setTitle(CONFIG.APP_NAME)
    .setDescription('Docs')
    .setVersion(process.env.APP_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(CONFIG.PORT);
}
bootstrap();
