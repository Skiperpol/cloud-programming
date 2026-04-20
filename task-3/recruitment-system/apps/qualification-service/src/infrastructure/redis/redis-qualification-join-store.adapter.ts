import { Inject, Injectable } from '@nestjs/common';
import type {
  QualificationAggregate,
  QualificationJoinStorePort,
} from '../../application/ports/qualification-join-store.port';
import { QUALIFICATION_REDIS } from './qualification-redis.token';

interface QualificationRedisClientPort {
  hset(key: string, data: Record<string, string>): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  set(
    key: string,
    value: string,
    mode: 'EX',
    seconds: number,
    strategy: 'NX',
  ): Promise<'OK' | null>;
  hgetall(key: string): Promise<Record<string, string>>;
  del(...keys: string[]): Promise<number>;
}

@Injectable()
export class RedisQualificationJoinStoreAdapter implements QualificationJoinStorePort {
  private static readonly PENDING_TTL_SECONDS = 60 * 30;
  private static readonly EVALUATION_LOCK_TTL_SECONDS = 10;

  constructor(
    @Inject(QUALIFICATION_REDIS)
    private readonly redis: QualificationRedisClientPort,
  ) {}

  async upsertSkills(
    applicationId: string,
    email: string,
    skills: string[],
  ): Promise<void> {
    await this.redis.hset(this.buildAggregateKey(applicationId), {
      email,
      skills: JSON.stringify(skills),
    });
    await this.redis.expire(
      this.buildAggregateKey(applicationId),
      RedisQualificationJoinStoreAdapter.PENDING_TTL_SECONDS,
    );
  }

  async upsertSafety(
    applicationId: string,
    email: string,
    isBlacklisted: boolean,
  ): Promise<void> {
    await this.redis.hset(this.buildAggregateKey(applicationId), {
      email,
      isBlacklisted: String(isBlacklisted),
    });
    await this.redis.expire(
      this.buildAggregateKey(applicationId),
      RedisQualificationJoinStoreAdapter.PENDING_TTL_SECONDS,
    );
  }

  async acquireEvaluationLock(applicationId: string): Promise<boolean> {
    const lockAcquired = await this.redis.set(
      this.buildEvaluationLockKey(applicationId),
      '1',
      'EX',
      RedisQualificationJoinStoreAdapter.EVALUATION_LOCK_TTL_SECONDS,
      'NX',
    );
    return lockAcquired === 'OK';
  }

  async getAggregate(
    applicationId: string,
  ): Promise<QualificationAggregate | null> {
    const values = await this.redis.hgetall(
      this.buildAggregateKey(applicationId),
    );
    if (!values || Object.keys(values).length === 0) {
      return null;
    }

    return {
      email: values.email,
      skills: values.skills
        ? (JSON.parse(values.skills) as string[])
        : undefined,
      isBlacklisted:
        values.isBlacklisted === undefined
          ? undefined
          : values.isBlacklisted === 'true',
      processed: values.processed === 'true',
    };
  }

  async markProcessed(applicationId: string): Promise<void> {
    await this.redis.hset(this.buildAggregateKey(applicationId), {
      processed: 'true',
    });
    await this.redis.expire(
      this.buildAggregateKey(applicationId),
      RedisQualificationJoinStoreAdapter.PENDING_TTL_SECONDS,
    );
  }

  async releaseEvaluationLock(applicationId: string): Promise<void> {
    await this.redis.del(this.buildEvaluationLockKey(applicationId));
  }

  private buildAggregateKey(applicationId: string): string {
    return `qualification:pending:${applicationId}`;
  }

  private buildEvaluationLockKey(applicationId: string): string {
    return `qualification:pending:lock:${applicationId}`;
  }
}
