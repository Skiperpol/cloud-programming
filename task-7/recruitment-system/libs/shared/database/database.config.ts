import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  gateway: {
    provider: 'amazon-rds-postgresql',
    url: process.env.GATEWAY_DB_URL,
  },
  candidate: {
    provider: 'amazon-rds-postgresql',
    url: process.env.CANDIDATE_DB_URL,
  },
  parser: {
    provider: 'amazon-rds-postgresql',
    url: process.env.PARSER_DB_URL,
  },
  verification: {
    provider: 'amazon-rds-postgresql',
    url: process.env.BLACKLIST_DB_URL,
  },
  qualification: {
    provider: 'amazon-rds-postgresql',
    url: process.env.QUALIFICATION_DB_URL,
  },
  notification: {
    provider: 'amazon-rds-postgresql',
    url: process.env.NOTIFICATION_DB_URL,
  },
  qualificationJoinStore: {
    provider: 'amazon-elasticache-redis',
    url: process.env.QUALIFICATION_REDIS_URL,
  },
}));
