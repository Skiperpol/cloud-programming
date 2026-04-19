import { ICommand } from '@nestjs/cqrs';

export class ParseDocumentCommand implements ICommand {
  constructor(public readonly email: string) {}
}
