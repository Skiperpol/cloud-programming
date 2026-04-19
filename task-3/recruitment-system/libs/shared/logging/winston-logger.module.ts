import { DynamicModule, Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggingInterceptor } from './logging.interceptor';

@Global()
@Module({})
export class WinstonLoggerModule {
  static forService(serviceName: string): DynamicModule {
    return {
      module: WinstonLoggerModule,
      imports: [
        WinstonModule.forRoot({
          level: process.env.LOG_LEVEL ?? 'info',
          defaultMeta: {
            service: serviceName,
          },
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.ms(),
                winston.format.colorize(),
                winston.format.simple(),
              ),
            }),
            new winston.transports.File({
              filename: 'logs/combined.log',
            }),
          ],
        }),
      ],
      providers: [LoggingInterceptor],
      exports: [WinstonModule, LoggingInterceptor],
      global: true,
    };
  }
}
