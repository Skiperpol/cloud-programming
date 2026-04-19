import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParsedDocumentRepositoryPort } from '../../application/ports/parsed-document-repository.port';
import { ParsedDocumentEntity } from './parsed-document.entity';

@Injectable()
export class TypeOrmParsedDocumentRepositoryAdapter
  implements ParsedDocumentRepositoryPort
{
  constructor(
    @InjectRepository(ParsedDocumentEntity)
    private readonly repository: Repository<ParsedDocumentEntity>,
  ) {}

  async save(document: Pick<ParsedDocumentEntity, 'email' | 'skills'>): Promise<void> {
    await this.repository.save({
      email: document.email,
      skills: document.skills,
    });
  }
}
