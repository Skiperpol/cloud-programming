import { ICommand } from '@nestjs/cqrs';

export class CreateProfileCommand implements ICommand {
  constructor(public readonly email: string) {}
}
