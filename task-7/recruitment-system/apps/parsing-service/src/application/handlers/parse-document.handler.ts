import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ParsedSkillSet } from '../../domain/parsed-skill-set';
import { ParsingLogger } from '../../infrastructure/logging/parsing.logger';
import { ParseDocumentCommand } from '../commands/parse-document.command';
import { PARSED_DOCUMENT_REPOSITORY_PORT } from '../ports/parsed-document-repository.port';
import type { ParsedDocumentRepositoryPort } from '../ports/parsed-document-repository.port';

@CommandHandler(ParseDocumentCommand)
export class ParseDocumentHandler implements ICommandHandler<ParseDocumentCommand> {
  constructor(
    @Inject(PARSED_DOCUMENT_REPOSITORY_PORT)
    private readonly repository: ParsedDocumentRepositoryPort,
    private readonly logger: ParsingLogger,
  ) {}

  async execute(command: ParseDocumentCommand): Promise<void> {
    this.logger.parseDocumentCommand(command.email);
    const skills = ParsedSkillSet.stub();
    await this.repository.save({
      email: command.email,
      skills: skills.toPersistedArray(),
    });
  }
}
