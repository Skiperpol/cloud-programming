import { Controller, Get } from '@nestjs/common';
import { ListParsedDocumentsUseCase } from '../../application/use-cases/list-parsed-documents.use-case';
import { ParsedDocumentEntity } from '../../infrastructure/persistence/parsed-document.entity';

@Controller('parser')
export class ParsingController {
  constructor(
    private readonly listParsedDocumentsUseCase: ListParsedDocumentsUseCase,
  ) {}

  @Get('documents')
  list(): Promise<ParsedDocumentEntity[]> {
    return this.listParsedDocumentsUseCase.execute();
  }
}
