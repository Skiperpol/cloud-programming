import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SaveNotificationCommand } from '../../application/commands/save-notification.command';
import { NotificationDto } from '../../application/dto/notification.dto';
import {
  GetNotificationByEmailQuery,
  GetNotificationByEmailQueryResult,
} from '../../application/queries/get-notification-by-email.query';
import { ListNotificationsQuery } from '../../application/queries/list-notifications.query';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('status')
  async status(
    @Query('email') email: string,
  ): Promise<{ email: string; message: string | null }> {
    const found: GetNotificationByEmailQueryResult =
      await this.queryBus.execute(new GetNotificationByEmailQuery(email));
    return {
      email,
      message: found.notification.message ?? null,
    };
  }

  @Get()
  list(): Promise<NotificationDto[]> {
    return this.queryBus.execute(new ListNotificationsQuery());
  }

  @Post()
  async create(
    @Body() body: CreateNotificationDto,
  ): Promise<{ message: string; email: string }> {
    if (!body) {
      throw new BadRequestException('Request body is required');
    }

    await this.commandBus.execute(
      new SaveNotificationCommand(body.email, body.result),
    );
    return {
      message: 'Notification saved successfully',
      email: body.email,
    };
  }
}
