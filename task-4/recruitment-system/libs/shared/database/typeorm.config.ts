import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export function createTypeOrmConfig(
  serviceName: string,
  configKey: string,
): TypeOrmModuleAsyncOptions {
  return {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dbLogger = new Logger(`${serviceName}:database`);
      dbLogger.log('Starting database connection');
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
        return dataSource;
      } catch (error) {
        dbLogger.error('Database connection failed', error);
        throw error;
      }
    },
  };
}
