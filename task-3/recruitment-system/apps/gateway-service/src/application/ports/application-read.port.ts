import { ApplicationDto } from '../dto/application.dto';

export const APPLICATION_READ_PORT = 'APPLICATION_READ_PORT';

export interface ApplicationReadPort {
  findAll(): Promise<ApplicationDto[]>;
}
