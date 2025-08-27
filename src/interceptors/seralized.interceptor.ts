import { NestInterceptor, UseInterceptors } from '@nestjs/common';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { UserDto } from '@/users/dtos/user.dto';
import { ReportDto } from '@/reports/dtos/report.dto';
import { GetEstimateReturnValueDto } from '@/reports/dtos/get-estimate-return-value.dto';
import { MessageDto } from '@/dtos/message.dto';

type ApprovedDtos =
  | UserDto
  | ReportDto
  | GetEstimateReturnValueDto
  | MessageDto;

const SERIALIZE_DTO_KEY = 'serialize_dto';

export function Serialize<T extends ApprovedDtos>(dto: new () => T) {
  return UseInterceptors(new SerializedInterceptor(dto));
}

// New decorator for method-level overrides
export function SerializeResponse<T extends ApprovedDtos>(dto: new () => T) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(SERIALIZE_DTO_KEY, dto, descriptor.value);
    return descriptor;
  };
}

class SerializedInterceptor<T extends ApprovedDtos> implements NestInterceptor {
  constructor(private dto: new () => T) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const reflector = new Reflector();
    const methodDto = reflector.get(SERIALIZE_DTO_KEY, context.getHandler());

    // Use method-level DTO if available, otherwise use class-level DTO
    const dtoToUse = methodDto || this.dto;

    return handler.handle().pipe(
      map((data: any) => {
        return plainToClass(dtoToUse, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
