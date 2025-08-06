export type CustomReportData = {
  make: string;
  model: string;
  year: number;
  lng: number;
  lat: number;
  mileage: number;
  approved?: boolean;
  price: number;
  // used Id will be set when saving to database
};

export type CustomUserData = {
  email: string;
  password: string;
  admin: boolean;
};
