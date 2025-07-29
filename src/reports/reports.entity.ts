import { User } from '@/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', (user: User) => user.reports)
  user: User;

  @Column()
  price: number;

  @Column()
  make: string; // Company that made the car: Ferrari, Toyota, etc.

  @Column()
  model: string; // Corolla, Camry, etc.

  @Column()
  year: number; // Year the car was manufactured

  @Column()
  lng: number; // Longitude

  @Column()
  lat: number; // Latitude

  @Column()
  mileage: number; // How many miles the car has been driven
}
