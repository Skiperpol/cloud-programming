import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationDto } from '../../application/dto/application.dto';
import { ApplicationRepositoryPort } from '../../application/ports/application-repository.port';
import { GatewayApplicationEntity } from './gateway-application.entity';

@Injectable()
export class TypeormApplicationRepositoryAdapter implements ApplicationRepositoryPort {
  constructor(
    @InjectRepository(GatewayApplicationEntity)
    private readonly repository: Repository<GatewayApplicationEntity>,
  ) {}

  async save(application: ApplicationDto): Promise<void> {
    await this.repository.save({
      applicationId: application.applicationId,
      email: application.email,
      fileName: application.fileName,
      extension: application.extension,
      sizeBytes: application.sizeBytes,
      uploadedAt: application.uploadedAt,
      s3ObjectKey: application.s3ObjectKey,
    });
  }

  async findByApplicationId(
    applicationId: string,
  ): Promise<ApplicationDto | null> {
    const entity = await this.repository.findOne({
      where: { applicationId },
    });
    if (!entity) {
      return null;
    }
    return {
      applicationId: entity.applicationId,
      email: entity.email,
      fileName: entity.fileName,
      extension: entity.extension,
      sizeBytes: entity.sizeBytes,
      uploadedAt: entity.uploadedAt,
      s3ObjectKey: entity.s3ObjectKey,
    };
  }
}
