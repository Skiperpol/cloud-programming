export const SKILLS_EVENT_PUBLISHER = 'SKILLS_EVENT_PUBLISHER';

export interface SkillsReadyPayload {
  applicationId: string;
  email: string;
  skills: string[];
}

export interface SkillsEventPublisherPort {
  publishSkillsReady(payload: SkillsReadyPayload): void;
}
