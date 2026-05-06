import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ParsedDocumentDto } from '../../application/dto/parsed-document.dto';
import { ListParsedDocumentsQuery } from '../../application/queries/list-parsed-documents.query';

@Controller('parser')
export class ParsingController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('documents')
  list(): Promise<ParsedDocumentDto[]> {
    return this.queryBus.execute(new ListParsedDocumentsQuery());
  }
}
