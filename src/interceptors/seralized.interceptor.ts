import { NestInterceptor, UseInterceptors } from '@nestjs/common';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from '@/users/dtos/user.dto';
import { ReportDto } from '@/reports/dtos/report.dto';

type ApprovedDtos = UserDto | ReportDto;

export function Serialize<T extends ApprovedDtos>(dto: new () => T) {
  return UseInterceptors(new SerializedInterceptor(dto));
}

class SerializedInterceptor<T extends ApprovedDtos> implements NestInterceptor {
  constructor(private dto: new () => T) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // console.log('I am running before the handler', context);
    return handler.handle().pipe(
      map((data: any) => {
        //console.log("I am running after the handler", data)
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
