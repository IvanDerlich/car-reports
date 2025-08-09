import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetEstimateReturnValueDto {
  @Expose()
  @IsNumber()
  avgPrice: number;
}
