import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { User } from '@/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepo: Repository<Report>,
  ) {
    this.reportsRepo = reportsRepo;
  }
  async create(reportDto: CreateReportDto, user: User) {
    const report = this.reportsRepo.create(reportDto);
    report.user = user;
    const savedReport = await this.reportsRepo.save(report);
    return savedReport;
  }

  async setApproval(id: string, approved: boolean) {
    const report = await this.reportsRepo.findOne({
      where: { id: parseInt(id) },
      relations: ['user'],
    });
    if (!report) throw new NotFoundException('Report not found');

    report.approved = approved;
    await this.reportsRepo.save(report);

    return report;
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lng, lat, year, mileage } = estimateDto;

    const _3_nearest_reports = await this.reportsRepo
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng BETWEEN :minLng AND :maxLng', {
        minLng: lng - 5,
        maxLng: lng + 5,
      })
      .andWhere('lat BETWEEN :minLat AND :maxLat', {
        minLat: lat - 5,
        maxLat: lat + 5,
      })
      .andWhere('year BETWEEN :minYear AND :maxYear', {
        minYear: year - 3,
        maxYear: year + 3,
      })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'ASC')
      .setParameters({ mileage })
      .limit(3)
      .getRawMany();

    if (_3_nearest_reports.length === 0) {
      throw new NotFoundException('No reports found that match the criteria');
    }

    const avgPrice =
      _3_nearest_reports.reduce((acc, report) => acc + report.price, 0) /
      _3_nearest_reports.length;

    return { avgPrice };
  }
}
