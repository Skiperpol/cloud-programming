import { IQuery } from '@nestjs/cqrs';
import { ApplicationDto } from '../dto/application.dto';

export class ListApplicationsQuery implements IQuery {}

export interface ListApplicationsQueryResult {
  applications: ApplicationDto[];
}
