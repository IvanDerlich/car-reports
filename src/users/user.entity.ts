import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Report } from '@/reports/reports.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany('Report', (report: Report) => report.user)
  reports: Report[];

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @AfterInsert()
  logInsert() {
    // console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    // console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    // console.log('Removed User with id', this.id);
  }
}
