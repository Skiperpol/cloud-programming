import { BlacklistEntryDto } from '../dto/blacklist-entry.dto';

export const BLACKLIST_READ_PORT = 'BLACKLIST_READ_PORT';

export interface BlacklistReadPort {
  findAll(): Promise<BlacklistEntryDto[]>;
  findByEmail(email: string): Promise<BlacklistEntryDto | null>;
}
