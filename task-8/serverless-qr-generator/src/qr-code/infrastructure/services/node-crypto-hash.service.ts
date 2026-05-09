import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { IHashService } from '../../domain/ports/hash-service.interface';

@Injectable()
export class NodeCryptoHashService implements IHashService {
  hash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
}
