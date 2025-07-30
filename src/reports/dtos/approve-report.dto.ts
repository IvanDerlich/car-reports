import { IsBoolean, IsNumber } from 'class-validator';

export class ApproveReportDto {
  @IsBoolean()
  approved: boolean;
}
