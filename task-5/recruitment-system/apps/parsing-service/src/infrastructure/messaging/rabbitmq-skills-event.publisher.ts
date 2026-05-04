import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SKILLS_READY } from '../../../../../libs/shared/events';
import {
  SkillsEventPublisherPort,
  SkillsReadyPayload,
} from '../../application/ports/skills-event.publisher.port';

@Injectable()
export class RabbitMqSkillsEventPublisher implements SkillsEventPublisherPort {
  constructor(
    @Inject('QUALIFICATION_BUS') private readonly client: ClientProxy,
  ) {}

  publishSkillsReady(payload: SkillsReadyPayload): void {
    this.client.emit(SKILLS_READY, payload);
  }
}
