import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CurrentUser } from '@/users/decorator/decorator';
import { User } from '@/users/user.entity';
import { Serialize } from '@/interceptors/seralized.interceptor';
import { ReportDto } from './dtos/report.dto';
import { AdminGuard } from '@/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { GetEstimateReturnValueDto } from './dtos/get-estimate-return-value.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {
    this.reportsService = reportsService;
  }

  @Serialize(ReportDto)
  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Serialize(ReportDto)
  @Patch('/:id')
  @UseGuards(AdminGuard)
  setAproveReport(
    @Param('id') id: string,
    @Body() body: { approved: boolean },
  ) {
    return this.reportsService.setApproval(id, body.approved);
  }

  @Serialize(GetEstimateReturnValueDto)
  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Serialize(ReportDto)
  @Get('/all')
  getAllReports() {
    return this.reportsService.getAll();
  }
}
