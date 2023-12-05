import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { APP_PORT } from './commun/constants/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  //swagger
  const config = new DocumentBuilder()
    .setTitle('Panda Auth')
    .setDescription('The Panda Auth API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(APP_PORT);
}
bootstrap();
