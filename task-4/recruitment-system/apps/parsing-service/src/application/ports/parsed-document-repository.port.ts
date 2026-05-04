import { ParsedDocumentDto } from '../dto/parsed-document.dto';

export const PARSED_DOCUMENT_REPOSITORY_PORT =
  'PARSED_DOCUMENT_REPOSITORY_PORT';

export interface ParsedDocumentRepositoryPort {
  save(document: Pick<ParsedDocumentDto, 'email' | 'skills'>): Promise<void>;
}
