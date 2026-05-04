import { ApplicationDto } from '../dto/application.dto';

export const APPLICATION_REPOSITORY_PORT = 'APPLICATION_REPOSITORY_PORT';

export interface ApplicationRepositoryPort {
  save(application: ApplicationDto): Promise<void>;
}
