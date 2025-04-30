import { ApiResponseList } from '../shared/api/ApiResponseList';

export interface User {
  id: number;
  username: string;
  image: string;
}

/*****  UserResponse *****/
interface Coordinates {
  lat: number;
  lng: number;
}

interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

interface Hair {
  color: string;
  type: string;
}

interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

export interface UserResponse {
  id: number;
  username: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: string;
}

export type UsersResponse = ApiResponseList<UserResponse, 'users'>;
