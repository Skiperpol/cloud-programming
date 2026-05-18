import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationReadPort } from '../../application/ports/application-read.port';
import { ApplicationDto } from '../../application/dto/application.dto';
import { GatewayApplicationEntity } from './gateway-application.entity';

@Injectable()
export class TypeOrmApplicationReadAdapter implements ApplicationReadPort {
  constructor(
    @InjectRepository(GatewayApplicationEntity)
    private readonly repository: Repository<GatewayApplicationEntity>,
  ) {}

  async findAll(): Promise<ApplicationDto[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => ({
      applicationId: entity.applicationId,
      email: entity.email,
      fileName: entity.fileName,
      extension: entity.extension,
      sizeBytes: entity.sizeBytes,
      uploadedAt: entity.uploadedAt,
      s3ObjectKey: entity.s3ObjectKey,
    }));
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
