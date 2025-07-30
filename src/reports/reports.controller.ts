import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthService } from '@/users/auth.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CurrentUser } from '@/users/decorator/decorator';
import { User } from '@/users/user.entity';
import { Serialize } from '@/interceptors/seralized.interceptor';
import { ReportDto } from './dtos/report.dto';

@Serialize(ReportDto)
@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private authService: AuthService,
  ) {
    this.reportsService = reportsService;
    this.authService = authService;
  }

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }
}
