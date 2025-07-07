import {
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { nextTick } from 'process';
import { UserDto } from 'src/users/dtos/user.dto';

export class SerializedInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // console.log('I am running before the handler', context);
    return handler.handle().pipe(map((data: any) => {
      //console.log("I am running after the handler", data)
      return plainToClass(this.dto, data, {
        excludeExtraneousValues: true,
      });
    }))
  }
}
