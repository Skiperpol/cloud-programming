export const SAFETY_EVENT_PUBLISHER = 'SAFETY_EVENT_PUBLISHER';

export interface SafetyVerifiedPayload {
  applicationId: string;
  email: string;
  isBlacklisted: boolean;
}

export interface SafetyEventPublisherPort {
  publishSafetyVerified(payload: SafetyVerifiedPayload): void;
}
