import {
  IsString,
  IsNumber,
  IsLongitude,
  IsLatitude,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { IsNotFutureYear } from '../validators/is-not-future-year.validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @IsNotFutureYear()
  year: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsBoolean()
  @IsOptional()
  approved: boolean;
}
