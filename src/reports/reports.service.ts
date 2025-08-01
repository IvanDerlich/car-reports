import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { User } from '@/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { GetEstimateReturnValueDto } from './dtos/get-estimate-return-value.dto';

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

  async createEstimate(
    estimateDto: GetEstimateDto,
  ): Promise<GetEstimateReturnValueDto> {
    // console.log('estimateDto: ', estimateDto);
    const { make, model, lng, lat, year, mileage } = estimateDto;

    const queryBuilder = await this.reportsRepo
      .createQueryBuilder()
      .select('AVG(price)', 'avgPrice')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng BETWEEN :minLng AND :maxLng', {
        minLng: lng,
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
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3);

    // console.log(
    //   'query with parameters: ',
    //   queryBuilder.getQueryAndParameters(),
    // );

    const result = await queryBuilder.getRawOne();
    // console.log('result: ', result);
    return result;
  }
}
