import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListApplicationsUseCase } from '../../application/use-cases/list-applications.use-case';
import { SubmitApplicationUseCase } from '../../application/use-cases/submit-application.use-case';
import { ApplyDto } from './dto/apply.dto';
import { FileMetadataLogger } from '../../infrastructure/logging/file-metadata.logger';
import { GatewayApplicationEntity } from '../../infrastructure/persistence/gateway-application.entity';

@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private readonly submitApplicationUseCase: SubmitApplicationUseCase,
    private readonly listApplicationsUseCase: ListApplicationsUseCase,
    private readonly fileMetadataLogger: FileMetadataLogger,
  ) {}

  @Post('apply')
  @UseInterceptors(FileInterceptor('file'))
  async apply(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ApplyDto,
  ): Promise<{ applicationId: string; status: string }> {
    const result = await this.submitApplicationUseCase.execute({
      email: body.email,
      originalName: file?.originalname ?? 'unknown.bin',
    });

    this.fileMetadataLogger.logMetadata(
      result.fileName,
      result.extension,
      body.email,
    );

    return {
      applicationId: result.applicationId,
      status: 'SUBMITTED',
    };
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
