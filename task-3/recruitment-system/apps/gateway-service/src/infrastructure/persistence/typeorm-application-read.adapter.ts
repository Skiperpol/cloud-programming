import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationReadPort } from '../../application/ports/application-read.port';
import { ApplicationDto } from '../../application/dto/application.dto';
import { GatewayApplicationEntity } from './gateway-application.entity';

@Injectable()
export class TypeormApplicationReadAdapter implements ApplicationReadPort {
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
}
