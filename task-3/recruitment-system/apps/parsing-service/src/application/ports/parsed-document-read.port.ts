import { ParsedDocumentDto } from '../dto/parsed-document.dto';

export const PARSED_DOCUMENT_READ_PORT = 'PARSED_DOCUMENT_READ_PORT';

export interface ParsedDocumentReadPort {
  findAll(): Promise<ParsedDocumentDto[]>;
}
