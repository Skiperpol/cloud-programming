import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParsedDocumentDto } from '../../application/dto/parsed-document.dto';
import { ParsedDocumentReadPort } from '../../application/ports/parsed-document-read.port';
import { ParsedDocumentEntity } from './parsed-document.entity';

@Injectable()
export class TypeOrmParsedDocumentReadAdapter implements ParsedDocumentReadPort {
  constructor(
    @InjectRepository(ParsedDocumentEntity)
    private readonly repository: Repository<ParsedDocumentEntity>,
  ) {}

  async findAll(): Promise<ParsedDocumentDto[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => ({
      id: entity.id,
      email: entity.email,
      skills: entity.skills,
    }));
  }
}
