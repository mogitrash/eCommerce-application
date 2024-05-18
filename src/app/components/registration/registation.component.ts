import './registration.scss';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PASSWORD_MINLENGTH,
  NAME_REGEX,
  STREET_REGEX,
  CITY_REGEX,
  POSTAL_CODE_BELARUS_REGEX,
  POSTAL_CODE_GERMANY_REGEX,
  POSTAL_CODE_SPAIN_REGEX,
} from '../../models/constants/login-registration.constants';
import InputTextComponent from '../input/input-text.component';
import InputPasswordComponent from '../input/input-password.component';
import InputDateComponent from '../input/input-date.component';
import SelectComponent from '../select/select.component';
import CustomerDraft from '../../models/customer-draft.model';
import Country from '../../models/country.model';

export default class RegistrationComponent extends BaseComponent<'div'> {
  personalDetails: BaseComponent<'p'>;

  personalDetailsWrapper: BaseComponent<'div'>;

  registrationForm: BaseComponent<'form'>;

  emailInput: InputTextComponent;

  passwordInput: InputPasswordComponent;

  firstNameInput: InputTextComponent;

  lastNameInput: InputTextComponent;

  shippingAddress: BaseComponent<'p'>;

  shippingAddressWrapper: BaseComponent<'div'>;

  streetInput: InputTextComponent;

  cityInput: InputTextComponent;

  postalCodeInput: InputTextComponent;

  dateInput: InputDateComponent;

  countryInput: SelectComponent;

  loginButton: Button;

  registrationButton: Button;

  constructor() {
    super({ tag: 'div', classes: ['modal'] });
    this.personalDetails = new BaseComponent({
      tag: 'p',
      classes: ['hint'],
      textContent: 'Personal Details',
    });
    this.personalDetailsWrapper = new BaseComponent({
      tag: 'div',
      classes: ['input_wrapper'],
    });
    this.registrationForm = new BaseComponent({ tag: 'form', classes: ['modal_form'] });
    this.emailInput = new InputTextComponent({
      id: 'emailId',
      name: 'email',
      required: true,
      labelText: 'Email',
      pattern: EMAIL_REGEX,
    });
    this.passwordInput = new InputPasswordComponent({
      id: 'passwordId',
      name: 'password',
      required: true,
      labelText: 'Password',
      pattern: PASSWORD_REGEX,
      minlength: PASSWORD_MINLENGTH,
    });
    this.firstNameInput = new InputTextComponent({
      id: 'firstNameId',
      name: 'firstName',
      required: true,
      labelText: 'First Name',
      pattern: NAME_REGEX,
    });
    this.lastNameInput = new InputTextComponent({
      id: 'lastNameId',
      name: 'lastName',
      required: true,
      labelText: 'Last Name',
      pattern: NAME_REGEX,
    });
    this.shippingAddress = new BaseComponent({
      tag: 'p',
      classes: ['hint'],
      textContent: 'Shipping Address',
    });
    this.shippingAddressWrapper = new BaseComponent({
      tag: 'div',
      classes: ['input_wrapper'],
    });
    this.streetInput = new InputTextComponent({
      id: 'streetId',
      name: 'street',
      required: true,
      labelText: 'Street',
      pattern: STREET_REGEX,
    });
    this.cityInput = new InputTextComponent({
      id: 'cityId',
      name: 'city',
      required: true,
      labelText: 'City',
      pattern: CITY_REGEX,
    });
    this.postalCodeInput = new InputTextComponent({
      id: 'postalCodeId',
      name: 'postalCode',
      required: true,
      labelText: 'Postal Code',
      pattern: CITY_REGEX,
    });
    this.dateInput = new InputDateComponent({
      id: 'dateOfBirthId',
      name: 'dateOfBirth',
      required: true,
      labelText: 'Date of Birth',
      minYearDelta: 13,
    });
    this.countryInput = new SelectComponent({
      id: 'countryId',
      name: 'country',
      labelText: 'Country',
      required: true,
      options: [
        { label: 'Please choose an option', value: '' },
        { label: 'Belarus', value: Country.BY },
        { label: 'Germany', value: Country.DE },
        { label: 'Spain', value: Country.ES },
      ],
    });
    this.loginButton = new Button({
      text: 'Log In',
      onClick: () => {},
      // TODO: add routing here,
    });
    this.registrationButton = new Button({
      text: 'Create account',
      onClick: this.handleFormSubmit.bind(this),
    });
    this.registrationButton.disable();
    this.setupElements();
    this.setupListeners();
    this.render();
  }

  handleFormSubmit(event: Event) {
    event?.preventDefault();
    const formData = new FormData(this.registrationForm.getElement());
    const customerDraft: CustomerDraft = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      addresses: [
        {
          streetName: formData.get('street') as string,
          city: formData.get('city') as string,
          postalCode: formData.get('postalCode') as string,
          country: formData.get('country') as Country,
        },
      ],
    };
    console.log(customerDraft);
  }

  validateForm() {
    const emailErrorText = RegistrationComponent.validateInputEmail(this.emailInput.getValidity());
    const passwordErrorText = RegistrationComponent.validateInputPassword(
      this.passwordInput.getValidity(),
    );
    const dateErrorText = this.validateInputDate();
    const countryErrorText = RegistrationComponent.validateInputCountry(
      this.countryInput.getValidity(),
    );
    const streetErrorText = RegistrationComponent.validateInputStreet(
      this.streetInput.getValidity(),
    );
    const cityErrorText = RegistrationComponent.validateInputCity(this.cityInput.getValidity());
    const postalCodeErrorText = this.validateInputPostalCode(this.postalCodeInput.getValidity());

    if (emailErrorText) {
      this.emailInput.showError(emailErrorText);
      this.registrationButton.disable();
      return;
    }
    if (passwordErrorText) {
      this.passwordInput.showError(passwordErrorText);
      this.registrationButton.disable();
      return;
    }
    if (dateErrorText) {
      this.dateInput.showError(dateErrorText);
      this.registrationButton.disable();
      return;
    }
    if (streetErrorText) {
      this.streetInput.showError(streetErrorText);
      this.registrationButton.disable();
      return;
    }
    if (cityErrorText) {
      this.cityInput.showError(cityErrorText);
      this.registrationButton.disable();
      return;
    }
    if (countryErrorText) {
      this.countryInput.showError(countryErrorText);
      this.registrationButton.disable();
      return;
    }
    if (postalCodeErrorText) {
      this.postalCodeInput.showError(postalCodeErrorText);
      this.registrationButton.disable();
      return;
    }
    this.registrationButton.enable();
  }

  validateInputDate(): string {
    if (this.dateInput.handleDateValidity()) {
      return '';
    }
    return 'Minors need parential guidance to use this website.';
  }

  static validateInputPassword(validity: ValidityState): string {
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
  }

  static validateInputEmail(validity: ValidityState): string {
    if (validity.patternMismatch) {
      return 'Email address must be properly formatted (e.g., user@example.com). Whitespaces are not allowed.';
    }
    if (validity.valueMissing) {
      return 'Please enter value.';
    }
    return '';
  }

  static validateInputCountry(validity: ValidityState): string {
    if (validity.valueMissing) {
      return 'Please select country.';
    }
    return '';
  }

  static validateInputStreet(validity: ValidityState): string {
    if (validity.valueMissing) {
      return 'Please enter value.';
    }
    return '';
  }

  static validateInputCity(validity: ValidityState): string {
    if (validity.valueMissing) {
      return 'Please enter value.';
    }
    if (validity.patternMismatch) {
      return 'Must contain at least one character and no special characters or numbers.';
    }
    return '';
  }

  validateInputPostalCode(validity: ValidityState): string {
    if (validity.valueMissing) {
      return 'Please enter value.';
    }

    const postalCode = this.postalCodeInput.input.getElement().value;
    const country = this.countryInput.select.getElement().value as Country;

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
  }

  setupElements() {
    this.registrationForm.setAttribute('novalidate', '');
    this.registrationButton.setAttribute('type', 'submit');
  }

  setupListeners() {
    this.registrationForm.addListener('submit', this.handleFormSubmit.bind(this));
    this.registrationForm.addListener('input', this.validateForm.bind(this));
  }

  render() {
    this.personalDetailsWrapper.append([
      this.emailInput,
      this.passwordInput,
      this.firstNameInput,
      this.lastNameInput,
      this.dateInput,
    ]);
    this.shippingAddressWrapper.append([
      this.streetInput,
      this.cityInput,
      this.countryInput,
      this.postalCodeInput,
    ]);
    this.registrationForm.append([
      this.personalDetails,
      this.personalDetailsWrapper,
      this.shippingAddress,
      this.shippingAddressWrapper,
      this.registrationButton,
      this.loginButton,
    ]);
    this.append([this.registrationForm]);
  }
}
