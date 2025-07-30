import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { User } from '@/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepo: Repository<Report>,
  ) {
    this.reportsRepo = reportsRepo;
  }
  create(reportDto: CreateReportDto, user: User) {
    const report = this.reportsRepo.create(reportDto);
    report.user = user;
    return this.reportsRepo.save(report);
  }
}
