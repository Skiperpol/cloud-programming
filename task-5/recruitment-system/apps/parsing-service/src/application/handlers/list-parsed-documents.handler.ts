import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PARSED_DOCUMENT_READ_PORT } from '../ports/parsed-document-read.port';
import type { ParsedDocumentReadPort } from '../ports/parsed-document-read.port';
import {
  ListParsedDocumentsQuery,
  ListParsedDocumentsQueryResult,
} from '../queries/list-parsed-documents.query';

@QueryHandler(ListParsedDocumentsQuery)
export class ListParsedDocumentsHandler implements IQueryHandler<
  ListParsedDocumentsQuery,
  ListParsedDocumentsQueryResult
> {
  constructor(
    @Inject(PARSED_DOCUMENT_READ_PORT)
    private readonly parsedDocumentReadPort: ParsedDocumentReadPort,
  ) {}

  async execute(): Promise<ListParsedDocumentsQueryResult> {
    const documents = await this.parsedDocumentReadPort.findAll();
    return { documents };
  }
}
