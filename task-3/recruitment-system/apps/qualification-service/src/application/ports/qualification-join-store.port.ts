export const QUALIFICATION_JOIN_STORE_PORT = 'QUALIFICATION_JOIN_STORE_PORT';

export interface QualificationAggregate {
  email?: string;
  skills?: string[];
  isBlacklisted?: boolean;
  processed: boolean;
}

export interface QualificationJoinStorePort {
  upsertSkills(
    applicationId: string,
    email: string,
    skills: string[],
  ): Promise<void>;
  upsertSafety(
    applicationId: string,
    email: string,
    isBlacklisted: boolean,
  ): Promise<void>;
  acquireEvaluationLock(applicationId: string): Promise<boolean>;
  releaseEvaluationLock(applicationId: string): Promise<void>;
  getAggregate(applicationId: string): Promise<QualificationAggregate | null>;
  markProcessed(applicationId: string): Promise<void>;
}
