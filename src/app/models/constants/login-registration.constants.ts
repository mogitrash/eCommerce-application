import Country from '../country.model';

export const EMAIL_REGEX = '^\\S+@\\S+\\.\\S+$';

export const PASSWORD_REGEX = '^[^\\s]*(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[^\\s]*$';
export const PASSWORD_MINLENGTH = '8';

export const NAME_REGEX = '^[A-Za-z]+$';

export const STREET_REGEX = '^.{1,}$';

export const CITY_REGEX = '^[A-Za-z]+$';

export const POSTAL_CODE_BELARUS_REGEX = '^\\d{6}$';

export const POSTAL_CODE_GERMANY_REGEX = '^\\d{5}$';

export const POSTAL_CODE_SPAIN_REGEX = '^(?:0[1-9]\\d{3}|[1-4]\\d{4}|5[0-2]\\d{3})$';

export const SUPPORTED_COUNTRIES = [
  { label: 'Belarus', value: Country.BY },
  { label: 'Germany', value: Country.DE },
  { label: 'Spain', value: Country.ES },
];
