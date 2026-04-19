import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GatewayApplicationEntity } from '../../infrastructure/persistence/gateway-application.entity';

@Injectable()
export class ListApplicationsUseCase {
  constructor(
    @InjectRepository(GatewayApplicationEntity)
    private readonly repository: Repository<GatewayApplicationEntity>,
  ) {}

  execute(): Promise<GatewayApplicationEntity[]> {
    return this.repository.find();
  }
}
