import { ApplicationSubmittedEvent } from '../../domain/application-submitted.event';

export const APPLICATION_EVENT_PUBLISHER = 'APPLICATION_EVENT_PUBLISHER';

export interface ApplicationEventPublisherPort {
  publishApplicationSubmitted(event: ApplicationSubmittedEvent): void;
}
