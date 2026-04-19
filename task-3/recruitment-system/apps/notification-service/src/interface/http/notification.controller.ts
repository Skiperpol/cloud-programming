import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ListNotificationsUseCase } from '../../application/use-cases/list-notifications.use-case';
import { SaveNotificationUseCase } from '../../application/use-cases/save-notification.use-case';
import { NotificationEntity } from '../../infrastructure/persistence/notification.entity';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly saveNotificationUseCase: SaveNotificationUseCase,
    private readonly listNotificationsUseCase: ListNotificationsUseCase,
  ) {}

  @Get('status')
  async status(@Query('email') email: string): Promise<{ email: string; message: string | null }> {
    const found = await this.saveNotificationUseCase.findByEmail(email);
    return {
      email,
      message: found?.message ?? null,
    };
  }

  @Get()
  list(): Promise<NotificationEntity[]> {
    return this.listNotificationsUseCase.execute();
  }

  @Post()
  async create(
    @Body() body: CreateNotificationDto,
  ): Promise<{ message: string; email: string }> {
    if (!body) {
      throw new BadRequestException('Request body is required');
    }

    await this.saveNotificationUseCase.save(body.email, body.result);
    return {
      message: 'Notification saved successfully',
      email: body.email,
    };
  }
}
