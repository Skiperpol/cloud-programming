export interface SkillsReadyPayload {
  applicationId: string;
  email: string;
  skills: string[];
}

export interface SafetyVerifiedPayload {
  applicationId: string;
  email: string;
  isBlacklisted: boolean;
}
