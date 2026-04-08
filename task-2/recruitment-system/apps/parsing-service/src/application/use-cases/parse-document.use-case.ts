import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { ParsedDocumentEntity } from '../../infrastructure/persistence/parsed-document.entity';

@Injectable()
export class ParseDocumentUseCase {
  constructor(
    @InjectRepository(ParsedDocumentEntity)
    private readonly repository: Repository<ParsedDocumentEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async parseDocument(email: string): Promise<void> {
    this.logger.info('parseDocument() call', { email });
    await this.repository.save({
      email,
      skills: ['Java', 'SQL'],
    });
  }
}
