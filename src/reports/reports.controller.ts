import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthService } from 'src/users/auth.service';
import { AuthGuard } from '@/guards/auth.guard';

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
  createReport(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
}
