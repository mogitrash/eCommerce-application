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
  DATE_REGEX,
} from '../../models/constants/login-registration.constants';
import InputTextComponent from '../input/input-text.component';
import InputPasswordComponent from '../input/input-password.component';
import InputDateComponent from '../input/input-date.component';
import SelectComponent from '../select/select.component';

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
      pattern: DATE_REGEX,
    });
    this.countryInput = new SelectComponent([
      'Please choose an option',
      'Belarus',
      'Germany',
      'Spain',
    ]);
    this.loginButton = new Button({
      text: 'Log In',
      onClick: () => {},
      // TODO: add routing here,
    });
    this.registrationButton = new Button({
      text: 'Create account',
      onClick: RegistrationComponent.handleFormSubmit.bind(this),
    });
    this.registrationButton.disable();
    this.setupElements();
    this.setupListeners();
    this.render();
  }

  static handleFormSubmit(event: Event) {
    event?.preventDefault();
  }

  validateForm() {
    const emailErrorText = RegistrationComponent.validateInputEmail(this.emailInput.getValidity());
    const passwordErrorText = RegistrationComponent.validateInputPassword(
      this.passwordInput.getValidity(),
    );

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
    this.registrationButton.enable();
  }

  static validateInputPassword(validity: ValidityState): string {
    if (validity.tooShort) {
      return 'The password should be a minimum of 8 characters in length.';
    }
    if (validity.patternMismatch) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one digit. Whitespaces are not allowed.';
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

  setupElements() {
    this.registrationForm.setAttribute('novalidate', '');
    this.registrationButton.setAttribute('type', 'submit');
  }

  setupListeners() {
    this.registrationForm.addListener('submit', RegistrationComponent.handleFormSubmit.bind(this));
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
      this.postalCodeInput,
      this.countryInput,
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
