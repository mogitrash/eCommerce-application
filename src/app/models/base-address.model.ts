import Country from './country.model';

export default interface BaseAddress {
  id?: string;
  key?: string;
  country: Country;
  title?: string;
  firstName?: string;
  lastName?: string;
  streetName: string;
  streetNumber?: string;
  postalCode: string;
  city: string;
  region?: string;
  state?: string;
  company?: string;
  department?: string;
  building?: string;
  apartment?: string;
  phone?: string;
  mobile?: string;
  email?: string;
}
