import { CustomReportData } from '../../dev/db/types';

export const targetReportData: CustomReportData = {
  make: 'Ford',
  model: 'Mustang',
  year: 2020,
  lng: 10,
  lat: 10,
  mileage: 10000,
  price: 10000,
  approved: false,
};

/*

   4 Reports within range of the query builder
   - make and model must match exactly
   - lng and lat must be within 5 units of target report
   - year must be within 3 years of the query builder
   - approved must be true
  */

export const reportsData: CustomReportData[] = [
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2019,
    lng: 8,
    lat: 12,
    mileage: 30000,
    price: 13000,
    approved: true,
  },
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2021,
    lng: 12,
    lat: 8,
    mileage: 20000,
    price: 5000,
    approved: true,
  },
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2022,
    lng: 7,
    lat: 8,
    mileage: 15000,
    price: 22000,
    approved: true,
  },
  /* This should not be included in the results because it only 
  selects 3 reports sorted by ABS(mileage - 10000)
  */
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2023,
    lng: 12,
    lat: 11,
    mileage: 16000,
    price: 18000,
    approved: true,
  },
];
