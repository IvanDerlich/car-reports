import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Report } from './reports.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let fakeReportsRepo: Partial<ReportsService>;

  beforeEach(async () => {
    fakeReportsRepo = {
      create: jest.fn().mockResolvedValue(new Report()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getRepositoryToken(Report), useValue: fakeReportsRepo },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('can create an instance of reports service', () => {
    expect(service).toBeDefined();
  });

  it('can create a report', async () => {
    // const user = await service.create(
    //   { make: 'Ford', model: 'Mustang', year: 2020, lng: 0, lat: 0, mileage: 10000, price: 10000 },
    //   { id: 1, email: 'test@test.com' },
    // );
    // expect(user).toBeDefined();
  });
});
