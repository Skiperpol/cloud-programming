import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParsedDocumentEntity } from '../../infrastructure/persistence/parsed-document.entity';

@Injectable()
export class ListParsedDocumentsUseCase {
  constructor(
    @InjectRepository(ParsedDocumentEntity)
    private readonly repository: Repository<ParsedDocumentEntity>,
  ) {}

  execute(): Promise<ParsedDocumentEntity[]> {
    return this.repository.find();
  }
}
