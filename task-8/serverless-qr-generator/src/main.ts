import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
  Handler,
} from 'aws-lambda';
import type { RequestListener } from 'node:http';
import { ValidationPipe, INestApplication } from '@nestjs/common';

type WarmupOrApiGatewayEvent = APIGatewayProxyEvent & {
  readonly source?: string;
};

function isWarmupInvocation(event: WarmupOrApiGatewayEvent): boolean {
  return event.source === 'serverless-plugin-warmup';
}

let cachedServer:
  | Handler<APIGatewayProxyEvent, APIGatewayProxyResult>
  | undefined;

function setupApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

async function resolveExpressLambdaCall(
  forwarded: void | Promise<APIGatewayProxyResult>,
): Promise<APIGatewayProxyResult> {
  const resolved = await Promise.resolve(forwarded);
  if (resolved === undefined) {
    return { statusCode: 502, body: '' };
  }
  return resolved;
}

async function bootstrap(): Promise<
  Handler<APIGatewayProxyEvent, APIGatewayProxyResult>
> {
  if (cachedServer === undefined) {
    const app = await NestFactory.create(AppModule);
    setupApp(app);
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance() as RequestListener;

    cachedServer = serverlessExpress<
      APIGatewayProxyEvent,
      APIGatewayProxyResult
    >({
      app: expressApp,
    });
  }
  return cachedServer;
}

export const handler: Handler<
  WarmupOrApiGatewayEvent,
  APIGatewayProxyResult | string
> = async (
  event: WarmupOrApiGatewayEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult | string>,
) => {
  if (isWarmupInvocation(event)) {
    return 'noop';
  }

  const server = await bootstrap();
  return resolveExpressLambdaCall(server(event, context, callback));
};

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  void (async () => {
    const app = await NestFactory.create(AppModule);
    setupApp(app);
    await app.listen(3000);
    console.log('Local server: http://localhost:3000');
  })();
}
