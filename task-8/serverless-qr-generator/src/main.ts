import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Callback, Context, Handler, APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationPipe, INestApplication } from '@nestjs/common';

let cachedServer: Handler;

function setupApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

async function bootstrap(): Promise<Handler> {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    setupApp(app);
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressApp }) as Handler;
  }
  return cachedServer;
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  if (event.source === 'serverless-plugin-warmup') return 'noop';

  const server = await bootstrap();
  return server(event, context, callback);
};

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  void (async () => {
    const app = await NestFactory.create(AppModule);
    setupApp(app);
    await app.listen(3000);
    console.log('Local server: http://localhost:3000');
  })();
}
