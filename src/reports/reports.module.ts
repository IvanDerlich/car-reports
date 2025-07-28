import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { AuthService } from 'src/users/auth.service';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, AuthService, UsersService],
})
export class ReportsModule {}
