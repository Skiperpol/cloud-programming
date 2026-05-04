import { ICommand } from '@nestjs/cqrs';

export class SaveNotificationCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly result: string,
  ) {}
}
