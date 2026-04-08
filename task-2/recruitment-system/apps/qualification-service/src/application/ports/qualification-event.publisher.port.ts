import { DecisionMadeEvent } from '../../domain/qualification-decided.event';

export const QUALIFICATION_EVENT_PUBLISHER = 'QUALIFICATION_EVENT_PUBLISHER';

export interface QualificationEventPublisherPort {
  publishDecisionMade(event: DecisionMadeEvent): void;
}
