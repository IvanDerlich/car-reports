import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

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
