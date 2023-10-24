import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { name, description, version } from '../package.json';
import helmet from 'helmet';
import { logger } from './logger/logger';
// somewhere in your initialization file
async function bootstrap() {
  const port = process.env.port || 3000;
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  //TODO Config Helmet
  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
}
bootstrap();
