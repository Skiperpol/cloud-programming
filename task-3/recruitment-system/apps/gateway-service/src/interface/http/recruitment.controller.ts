import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApplicationDto } from '../../application/dto/application.dto';
import { SubmitApplicationCommand } from '../../application/commands/submit-application.command';
import { DownloadApplicationFileQuery } from '../../application/queries/download-application-file.query';
import { ListApplicationsQuery } from '../../application/queries/list-applications.query';
import { ApplyDto, ApplyResponseDto } from './dto/apply.dto';
import { SubmitApplicationCommandResult } from '../../application/commands/submit-application.command';
import { DownloadApplicationFileQueryResult } from '../../application/queries/download-application-file.query';

@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('apply')
  @UseInterceptors(FileInterceptor('file'))
  async apply(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ApplyDto,
  ): Promise<ApplyResponseDto> {
    if (!file?.buffer) {
      throw new BadRequestException('File is required');
    }

    const result = await this.commandBus.execute<
      SubmitApplicationCommand,
      SubmitApplicationCommandResult
    >(
      new SubmitApplicationCommand(
        body.email,
        file.originalname ?? 'unknown.bin',
        file.buffer,
        file.mimetype || 'application/octet-stream',
        file.size,
      ),
    );

    return {
      applicationId: result.applicationId,
      status: 'SUBMITTED',
    };
  }

  @Get('applications/:applicationId/file')
  async downloadApplicationFile(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const result = await this.queryBus.execute<
      DownloadApplicationFileQuery,
      DownloadApplicationFileQueryResult
    >(new DownloadApplicationFileQuery(applicationId));
    const { stream, contentType, contentLength, downloadFileName } = result;
    const safeName =
      typeof downloadFileName === 'string'
        ? downloadFileName.replace(/[^\w.-]+/g, '_') || 'document'
        : 'document';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    if (contentLength !== undefined)
      res.setHeader('Content-Length', String(contentLength));
    return new StreamableFile(stream);
  }

  @Get('health')
  healthCheck(): { status: string; service: string } {
    return {
      status: 'ok',
      service: 'gateway-service',
    };
  }

  @Get('applications')
  listApplications(): Promise<ApplicationDto[]> {
    return this.queryBus.execute(new ListApplicationsQuery());
  }
}
