import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DECISION_MADE } from '../../../../../libs/shared/events';
import { DecisionMadeEvent } from '../../domain/qualification-decided.event';
import { QualificationEventPublisherPort } from '../../application/ports/qualification-event.publisher.port';

@Injectable()
export class RabbitMqQualificationEventPublisher implements QualificationEventPublisherPort {
  constructor(
    @Inject('NOTIFICATION_BUS') private readonly client: ClientProxy,
  ) {}

  publishDecisionMade(event: DecisionMadeEvent): void {
    this.client.emit(DECISION_MADE, event);
  }
}
