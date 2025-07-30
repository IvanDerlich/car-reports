import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CurrentUser } from '@/users/decorator/decorator';
import { User } from '@/users/user.entity';
import { Serialize } from '@/interceptors/seralized.interceptor';
import { ReportDto } from './dtos/report.dto';
import { AdminGuard } from '@/guards/admin.guard';

@Serialize(ReportDto)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {
    this.reportsService = reportsService;
  }

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    console.log('Create report');
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  setAproveReport(
    @Param('id') id: string,
    @Body() body: { approved: boolean },
  ) {
    return this.reportsService.setApproval(id, body.approved);
  }
}
