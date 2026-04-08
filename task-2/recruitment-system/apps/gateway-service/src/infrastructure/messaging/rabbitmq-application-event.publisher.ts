import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { APPLICATION_SUBMITTED } from '../../../../../libs/shared/events';
import { ApplicationEventPublisherPort } from '../../application/ports/application-event.publisher.port';
import { ApplicationSubmittedEvent } from '../../domain/application-submitted.event';

@Injectable()
export class RabbitMqApplicationEventPublisher implements ApplicationEventPublisherPort {
  constructor(
    @Inject('CANDIDATE_BUS') private readonly candidateClient: ClientProxy,
    @Inject('PARSER_BUS') private readonly parserClient: ClientProxy,
    @Inject('VERIFICATION_BUS')
    private readonly verificationClient: ClientProxy,
    @Inject('QUALIFICATION_BUS')
    private readonly qualificationClient: ClientProxy,
  ) {}

  publishApplicationSubmitted(event: ApplicationSubmittedEvent): void {
    this.candidateClient.emit(APPLICATION_SUBMITTED, event);
    this.parserClient.emit(APPLICATION_SUBMITTED, event);
    this.verificationClient.emit(APPLICATION_SUBMITTED, event);
    this.qualificationClient.emit(APPLICATION_SUBMITTED, event);
  }
}
