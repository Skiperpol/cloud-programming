import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistEntryDto } from '../../application/dto/blacklist-entry.dto';
import { BlacklistReadPort } from '../../application/ports/blacklist-read.port';
import { BlacklistEntryEntity } from './blacklist-entry.entity';

@Injectable()
export class TypeOrmBlacklistReadAdapter implements BlacklistReadPort {
  constructor(
    @InjectRepository(BlacklistEntryEntity)
    private readonly repository: Repository<BlacklistEntryEntity>,
  ) {}

  async findAll(): Promise<BlacklistEntryDto[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => ({
      id: entity.id,
      email: entity.email,
      blocked: entity.blocked,
    }));
  }

  async findByEmail(email: string): Promise<BlacklistEntryDto | null> {
    const entity = await this.repository.findOne({ where: { email } });
    if (!entity) {
      return null;
    }
    return { id: entity.id, email: entity.email, blocked: entity.blocked };
  }
}
