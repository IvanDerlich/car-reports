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
    mileage: 10100,
    price: 10010,
    approved: true,
  },
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2021,
    lng: 12,
    lat: 8,
    mileage: 10200,
    price: 10020,
    approved: true,
  },
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2022,
    lng: 7,
    lat: 8,
    mileage: 10300,
    price: 10030,
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
    mileage: 40000,
    price: 30000,
    approved: true,
  },
];
