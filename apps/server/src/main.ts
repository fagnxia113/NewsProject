import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcRouter } from '@server/trpc/trpc.router';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigurationType } from './configuration';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, '..', './package.json'), 'utf-8'),
);

const appVersion = packageJson.version;
console.log('appVersion: v' + appVersion);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const { host, isProd, port } =
    configService.get<ConfigurationType['server']>('server')!;

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.useStaticAssets(join(__dirname, '..', 'client', 'assets'), {
    prefix: '/dash/assets/',
  });
  app.setBaseViewsDir(join(__dirname, '..', 'client'));
  app.setViewEngine('hbs');

  if (isProd) {
    app.enable('trust proxy');
  }

  app.enableCors({
    origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:5175'],
    credentials: true,
    exposedHeaders: ['authorization'],
  });

  // 设置响应头以确保正确的字符编码
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app);

  await app.listen(port, host);

  console.log(`Server is running at http://${host}:${port}`);
}
bootstrap();
