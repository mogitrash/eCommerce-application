import {
  POSTAL_CODE_BELARUS_REGEX,
  POSTAL_CODE_GERMANY_REGEX,
  POSTAL_CODE_SPAIN_REGEX,
} from '../models/constants/login-registration.constants';
import Country from '../models/country.model';

export const validateInputDate = (validity: Partial<ValidityState>): string => {
  if (validity.valid) {
    return '';
  }
  return 'Minors need parential guidance to use this website.';
};

export const validateInputPassword = (validity: Partial<ValidityState>): string => {
  if (validity.tooShort) {
    return 'The password should be a minimum of 8 characters in length.';
  }
  if (validity.patternMismatch) {
    return 'Enter at least one uppercase, one lowercase letter, one digit. Whitespaces are not allowed.';
  }
  if (validity.valueMissing) {
    return 'Please enter value.';
  }
  return '';
};

export const validateInputEmail = (validity: Partial<ValidityState>): string => {
  if (validity.patternMismatch) {
    return 'Email address must be properly formatted (e.g., user@example.com). Whitespaces are not allowed.';
  }
  if (validity.valueMissing) {
    return 'Please enter value.';
  }
  return '';
};

export const validateInputName = (validity: Partial<ValidityState>): string => {
  if (validity.patternMismatch) {
    return 'Must contain at least one character and no special characters or numbers.';
  }
  if (validity.valueMissing) {
    return 'Please enter value.';
  }
  return '';
};

export const validateInputCountry = (validity: Partial<ValidityState>): string => {
  if (validity.valueMissing) {
    return 'Please select country.';
  }
  return '';
};
export const validateInputStreet = (validity: Partial<ValidityState>): string => {
  if (validity.valueMissing) {
    return 'Please enter value.';
  }
  return '';
};

export const validateInputCity = (validity: Partial<ValidityState>): string => {
  if (validity.valueMissing) {
    return 'Please enter value.';
  }
  if (validity.patternMismatch) {
    return 'Must contain at least one character and no special characters or numbers.';
  }
  return '';
};

export const validateInputPostalCode = (
  validity: Partial<ValidityState>,
  postalCode: string,
  country: Country,
): string => {
  if (validity.valueMissing) {
    return 'Please enter value.';
  }
  switch (country) {
    case Country.BY:
      if (!new RegExp(POSTAL_CODE_BELARUS_REGEX).test(postalCode)) {
        return 'Must contain 6 digits';
      }
      break;
    case Country.DE:
      if (!new RegExp(POSTAL_CODE_GERMANY_REGEX).test(postalCode)) {
        return 'Must contain 5 digits';
      }
      break;
    case Country.ES:
      if (!new RegExp(POSTAL_CODE_SPAIN_REGEX).test(postalCode)) {
        return 'Must be five-digit number ranging from 01000 to 52999';
      }
      break;
    default:
      break;
  }

  return '';
};
