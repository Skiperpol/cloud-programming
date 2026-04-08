import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as applicationEventPublisherPort from '../ports/application-event.publisher.port';
import { ApplicationSubmittedEvent } from '../../domain/application-submitted.event';
import { GatewayApplicationEntity } from '../../infrastructure/persistence/gateway-application.entity';
import { Repository } from 'typeorm';

export interface SubmitApplicationCommand {
  email: string;
  originalName: string;
}

export interface SubmitApplicationResult {
  applicationId: string;
  fileName: string;
  extension: string;
}

@Injectable()
export class SubmitApplicationUseCase {
  constructor(
    @InjectRepository(GatewayApplicationEntity)
    private readonly gatewayApplicationRepository: Repository<GatewayApplicationEntity>,
    @Inject(applicationEventPublisherPort.APPLICATION_EVENT_PUBLISHER)
    private readonly eventPublisher: applicationEventPublisherPort.ApplicationEventPublisherPort,
  ) {}

  async execute(
    command: SubmitApplicationCommand,
  ): Promise<SubmitApplicationResult> {
    const applicationId = crypto.randomUUID();
    const parts = command.originalName.split('.');
    const extension =
      parts.length > 1 ? (parts.at(-1)?.toLowerCase() ?? '') : '';
    const fileName =
      parts.length > 1 ? parts.slice(0, -1).join('.') : command.originalName;

    await this.gatewayApplicationRepository.save({
      applicationId,
      email: command.email,
      fileName,
      extension,
    });

    this.eventPublisher.publishApplicationSubmitted(
      new ApplicationSubmittedEvent(command.email, applicationId),
    );

    return {
      applicationId,
      fileName,
      extension,
    };
  }
}
