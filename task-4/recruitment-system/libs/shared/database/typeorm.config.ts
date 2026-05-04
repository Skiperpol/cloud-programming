import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { appendDbBootLog } from './db-boot-log';

export function createTypeOrmConfig(
  serviceName: string,
  configKey: string,
): TypeOrmModuleAsyncOptions {
  return {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const dbLogger = new Logger(`${serviceName}:database`);
      dbLogger.log('Starting database connection');
      appendDbBootLog(serviceName, 'postgres', 'connecting');
      const url = configService.getOrThrow<string>(`database.${configKey}.url`);

      try {
        return {
          type: 'postgres',
          url,
          autoLoadEntities: true,
          synchronize: true,
          ssl: { rejectUnauthorized: false },
        };
      } catch (error) {
        dbLogger.error('Database connection failed at config stage', error);
        appendDbBootLog(
          serviceName,
          'postgres',
          'failed',
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    },
    dataSourceFactory: async (options) => {
      if (!options) {
        throw new Error('TypeORM options are not defined');
      }
      const dbLogger = new Logger(`${serviceName}:database`);
      try {
        const { DataSource } = await import('typeorm');
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        dbLogger.log('Database connection established');
        appendDbBootLog(serviceName, 'postgres', 'connected');
        return dataSource;
      } catch (error) {
        dbLogger.error('Database connection failed', error);
        appendDbBootLog(
          serviceName,
          'postgres',
          'failed',
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    },
  };
}
