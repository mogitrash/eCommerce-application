import './registration.scss';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PASSWORD_MINLENGTH,
  NAME_REGEX,
} from '../../models/constants/login-registration.constants';
import InputTextComponent from '../input/input-text.component';
import InputPasswordComponent from '../input/input-password.component';
import InputDateComponent from '../input/input-date.component';
import CustomerDraft from '../../models/customer-draft.model';
import Country from '../../models/country.model';
import AddressFormComponent from '../address-form/address-form.component';
import InputCheckboxComponent from '../input/input-checkbox.component';

export default class RegistrationComponent extends BaseComponent<'div'> {
  personalDetails: BaseComponent<'p'>;

  personalDetailsWrapper: BaseComponent<'div'>;

  registrationForm: BaseComponent<'form'>;

  emailInput: InputTextComponent;

  passwordInput: InputPasswordComponent;

  firstNameInput: InputTextComponent;

  lastNameInput: InputTextComponent;

  dateInput: InputDateComponent;

  shippingAddressForm: AddressFormComponent;

  defaultBillingCheckbox: InputCheckboxComponent;

  billingAddressForm: AddressFormComponent;

  loginButton: Button;

  registrationButton: Button;

  isShippingAddressUsedAsBilling: boolean = false;

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
    this.dateInput = new InputDateComponent({
      id: 'dateOfBirthId',
      name: 'dateOfBirth',
      required: true,
      labelText: 'Date of Birth',
      minYearDelta: 13,
    });
    this.shippingAddressForm = new AddressFormComponent({
      formName: 'Shipping Address',
      inputPrefix: 'shipping',
    });
    this.defaultBillingCheckbox = new InputCheckboxComponent({
      id: 'defaultBillingId',
      name: 'defaultBilling',
      labelText: 'Use as default billing address',
      onSelect: this.handleDefaultBillingCheckboxClick.bind(this),
    });
    this.billingAddressForm = new AddressFormComponent({
      formName: 'Billing Address',
      inputPrefix: 'billing',
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
          streetName: formData.get('shippingStreet') as string,
          city: formData.get('shippingCity') as string,
          postalCode: formData.get('shippingPostalCode') as string,
          country: formData.get('shippingCountry') as Country,
        },
      ],
      defaultShippingAddress: 0,
    };

    if (this.isShippingAddressUsedAsBilling) {
      customerDraft.defaultBillingAddress = 0;
    } else {
      customerDraft.addresses.push({
        streetName: formData.get('billingStreet') as string,
        city: formData.get('billingCity') as string,
        postalCode: formData.get('billingPostalCode') as string,
        country: formData.get('billingCountry') as Country,
      });
      customerDraft.defaultBillingAddress = 1;
    }
    // TODO: use service call with customerDraft
    console.log(customerDraft);
  }

  validateForm() {
    const emailErrorText = RegistrationComponent.validateInputEmail(this.emailInput.getValidity());
    const passwordErrorText = RegistrationComponent.validateInputPassword(
      this.passwordInput.getValidity(),
    );
    const dateErrorText = this.validateInputDate();

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

    const isShippingAddressFormValid = this.shippingAddressForm.validateForm();
    const isBillingAddressFormValid = this.billingAddressForm.validateForm();

    if (!isShippingAddressFormValid) {
      this.registrationButton.disable();
      return;
    }
    if (!this.isShippingAddressUsedAsBilling && !isBillingAddressFormValid) {
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

  handleDefaultBillingCheckboxClick(isChecked: boolean) {
    if (isChecked) {
      this.isShippingAddressUsedAsBilling = true;
      this.billingAddressForm.hideForm();
    } else {
      this.isShippingAddressUsedAsBilling = false;
      this.billingAddressForm.showForm();
    }
    this.validateForm();
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
    this.registrationForm.append([
      this.personalDetails,
      this.personalDetailsWrapper,
      this.shippingAddressForm,
      this.defaultBillingCheckbox,
      this.billingAddressForm,
      this.registrationButton,
      this.loginButton,
    ]);
    this.append([this.registrationForm]);
  }
}
