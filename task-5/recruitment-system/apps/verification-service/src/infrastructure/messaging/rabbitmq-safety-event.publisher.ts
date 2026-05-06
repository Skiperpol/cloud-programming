import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SAFETY_VERIFIED } from '../../../../../libs/shared/events';
import {
  SafetyEventPublisherPort,
  SafetyVerifiedPayload,
} from '../../application/ports/safety-event.publisher.port';

@Injectable()
export class RabbitMqSafetyEventPublisher implements SafetyEventPublisherPort {
  constructor(@Inject('QUALIFICATION_BUS') private readonly client: ClientProxy) {}

  publishSafetyVerified(payload: SafetyVerifiedPayload): void {
    this.client.emit(SAFETY_VERIFIED, payload);
  }
}
