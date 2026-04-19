import { IQuery } from '@nestjs/cqrs';
import { ParsedDocumentDto } from '../dto/parsed-document.dto';

export class ListParsedDocumentsQuery implements IQuery {}

export interface ListParsedDocumentsQueryResult {
  documents: ParsedDocumentDto[];
}
