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

type DtoType = typeof UserDto

// List all the DtoTypes that you wont to use in the interceptor
type DtoTypes = DtoType

export function Serialize(dto: DtoTypes) {
  return UseInterceptors(new SerializedInterceptor(dto));
}


class SerializedInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // console.log('I am running before the handler', context);
    return handler.handle().pipe(map((data: DtoTypes) => {
      //console.log("I am running after the handler", data)
      return plainToClass(this.dto, data, {
        excludeExtraneousValues: true,
      });
    }))
  }
}
