import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { APPLICATION_READ_PORT } from '../ports/application-read.port';
import type { ApplicationReadPort } from '../ports/application-read.port';
import {
  ListApplicationsQuery,
  ListApplicationsQueryResult,
} from '../queries/list-applications.query';

@QueryHandler(ListApplicationsQuery)
export class ListApplicationsHandler implements IQueryHandler<
  ListApplicationsQuery,
  ListApplicationsQueryResult
> {
  constructor(
    @Inject(APPLICATION_READ_PORT)
    private readonly applicationReadPort: ApplicationReadPort,
  ) {}

  async execute(): Promise<ListApplicationsQueryResult> {
    const applications = await this.applicationReadPort.findAll();
    return { applications };
  }
}
