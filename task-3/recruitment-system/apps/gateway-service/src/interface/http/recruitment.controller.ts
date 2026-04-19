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
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { DownloadApplicationFileUseCase } from '../../application/use-cases/download-application-file.use-case';
import { ListApplicationsUseCase } from '../../application/use-cases/list-applications.use-case';
import { SubmitApplicationUseCase } from '../../application/use-cases/submit-application.use-case';
import { FileMetadataLogger } from '../../infrastructure/logging/file-metadata.logger';
import { GatewayApplicationEntity } from '../../infrastructure/persistence/gateway-application.entity';
import { ApplyDto } from './dto/apply.dto';

@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private readonly submitApplicationUseCase: SubmitApplicationUseCase,
    private readonly listApplicationsUseCase: ListApplicationsUseCase,
    private readonly downloadApplicationFileUseCase: DownloadApplicationFileUseCase,
    private readonly fileMetadataLogger: FileMetadataLogger,
  ) {}

  @Post('apply')
  @UseInterceptors(FileInterceptor('file'))
  async apply(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ApplyDto,
  ): Promise<{ applicationId: string; status: string }> {
    if (!file?.buffer) {
      throw new BadRequestException('File is required');
    }

    const result = await this.submitApplicationUseCase.execute({
      email: body.email,
      originalName: file.originalname ?? 'unknown.bin',
      fileBuffer: file.buffer,
      mimeType: file.mimetype || 'application/octet-stream',
      sizeBytes: file.size,
    });

    this.fileMetadataLogger.logMetadata(
      result.fileName,
      result.extension,
      body.email,
      result.sizeBytes,
      result.s3ObjectKey,
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
    const { stream, contentType, contentLength, downloadFileName } =
      await this.downloadApplicationFileUseCase.execute(applicationId);
    const safeName = downloadFileName.replace(/[^\w.-]+/g, '_') || 'document';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    if (contentLength !== undefined) {
      res.setHeader('Content-Length', String(contentLength));
    }
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
  listApplications(): Promise<GatewayApplicationEntity[]> {
    return this.listApplicationsUseCase.execute();
  }
}
