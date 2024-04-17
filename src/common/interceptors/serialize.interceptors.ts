import {
    CallHandler,
    ExecutionContext,
    Logger,
    NestInterceptor,
    UseInterceptors,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { plainToInstance } from 'class-transformer';
  
  interface ClassConstructor {
    new (...args: any[]): object;
  }
  
  export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
  }
  
  export class SerializeInterceptor implements NestInterceptor {
    private readonly logger = new Logger(SerializeInterceptor.name);
    constructor(private dto: any) {}
  
    intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
      // run something before req handled by the request handler
      this.logger.log('I am running before the handler');
      return next.handle().pipe(
        map((data: any) => {
          // run something before response is sent out
          //this.logger.log('I am running before the response is sent out', data);
          this.logger.log('I am running before the response is sent out');
          return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }),
      );
    }
  }
  