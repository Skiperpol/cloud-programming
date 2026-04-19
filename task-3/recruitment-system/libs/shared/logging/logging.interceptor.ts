import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const startedAt = Date.now();

    this.logger.info('Incoming call', {
      className,
      methodName,
    });

    return next.handle().pipe(
      tap(() => {
        this.logger.info('Call completed', {
          className,
          methodName,
          durationMs: Date.now() - startedAt,
        });
      }),
    );
  }
}
