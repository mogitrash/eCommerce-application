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

import NotificationService from '../../services/notification.service';
import CustomerDraft from '../../models/customer-draft.model';
import Country from '../../models/country.model';
import AddressFormComponent from '../address-form/address-form.component';
import InputCheckboxComponent from '../input/input-checkbox.component';
import RouterService from '../../services/router/router.service';
import CustomerSignIn from '../../models/customer-sign-in.model';
import Routes from '../../models/routes.model';
import {
  validateInputDate,
  validateInputEmail,
  validateInputName,
  validateInputPassword,
} from '../../utilities/input-validators';
import authenticationService from '../../services/authentication.service';

export default class RegistrationComponent extends BaseComponent<'div'> {
  private personalDetails: BaseComponent<'p'>;

  private personalDetailsWrapper: BaseComponent<'div'>;

  private registrationForm: BaseComponent<'form'>;

  private emailInput: InputTextComponent;

  private passwordInput: InputPasswordComponent;

  private firstNameInput: InputTextComponent;

  private lastNameInput: InputTextComponent;

  private dateInput: InputDateComponent;

  private shippingAddressForm: AddressFormComponent;

  private defaultShippingCheckbox: InputCheckboxComponent;

  private defaultBillingCheckbox: InputCheckboxComponent;

  private defaultShippingAsBillingCheckbox: InputCheckboxComponent;

  private billingAddressForm: AddressFormComponent;

  private loginButton: Button;

  private registrationButton: Button;

  private isBillingAddressUsedAsDefault: boolean = false;

  private isShippingAddressUsedAsDefault: boolean = false;

  private isShippingUsedAsDefaultBilling: boolean = false;

  private authenticationService = authenticationService;

  private notificationService = new NotificationService();

  constructor(private router: RouterService) {
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
    this.defaultShippingCheckbox = new InputCheckboxComponent({
      id: 'defaultShippingId',
      name: 'defaultShipping',
      labelText: 'Use as default shipping address',
      onSelect: this.handleDefaultShippingCheckboxClick.bind(this),
    });
    this.billingAddressForm = new AddressFormComponent({
      formName: 'Billing Address',
      inputPrefix: 'billing',
    });
    this.defaultBillingCheckbox = new InputCheckboxComponent({
      id: 'defaultBillingId',
      name: 'defaultBilling',
      labelText: 'Use as default billing address',
      onSelect: this.handleDefaultBillingCheckboxClick.bind(this),
    });
    this.defaultShippingAsBillingCheckbox = new InputCheckboxComponent({
      id: 'defaultShippingAsBillingId',
      name: 'defaultShippingAsBilling',
      labelText: 'Use shipping address as default billing address',
      onSelect: this.handleDefaultShippingAsBillingCheckboxClick.bind(this),
    });
    this.loginButton = new Button({
      text: 'Log In',
      onClick: (event: Event) => {
        event.preventDefault();
        this.router.navigate('/login');
      },
    });
    this.registrationButton = new Button({
      text: 'Create account',
    });
    this.registrationButton.disable();
    this.setupElements();
    this.setupListeners();
    this.render();
  }

  private async handleFormSubmit(event: Event) {
    event?.preventDefault();
    const formData = new FormData(this.registrationForm.getElement());
    const customerSignIn: CustomerSignIn = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    const customerShippingAddress = {
      streetName: formData.get('shippingStreet') as string,
      city: formData.get('shippingCity') as string,
      postalCode: formData.get('shippingPostalCode') as string,
      country: formData.get('shippingCountry') as Country,
    };
    const customerDraft: CustomerDraft = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      addresses: [customerShippingAddress],
      shippingAddresses: [0],
    };

    if (this.isShippingAddressUsedAsDefault) {
      customerDraft.defaultShippingAddress = 0;
    }

    if (this.isShippingUsedAsDefaultBilling) {
      customerDraft.defaultBillingAddress = 0;
    } else {
      const customerBillingAddress = {
        streetName: formData.get('billingStreet') as string,
        city: formData.get('billingCity') as string,
        postalCode: formData.get('billingPostalCode') as string,
        country: formData.get('billingCountry') as Country,
      };
      customerDraft.addresses.push(customerBillingAddress);
      customerDraft.billingAddresses = [1];
      if (this.isBillingAddressUsedAsDefault) {
        customerDraft.defaultBillingAddress = 1;
      }
    }
    const response = await this.authenticationService.signUpCustomer(customerDraft);

    if ('customer' in response) {
      this.notificationService.notify('You have created an account');
      const responseLogIn = await this.authenticationService.signInCustomer(customerSignIn);
      if ('customer' in responseLogIn) {
        this.router.redirect(Routes.Main);
        this.notificationService.notify('You logged in');
      } else {
        this.notificationService.notify('Try to log in later');
        this.router.redirect(Routes.Main);
      }
      this.registrationForm.getElement().reset();
    } else {
      let errorMessage;
      if (response.message === 'There is already an existing customer with the provided email.') {
        errorMessage = 'Email already in use. Log in or use a different email.';
      } else {
        errorMessage = 'Oops! Something went wrong. Please try again later.';
      }

      this.notificationService.notify(errorMessage);
    }
  }

  private validateForm() {
    const emailErrorText = validateInputEmail(this.emailInput.getValidity());
    const passwordErrorText = validateInputPassword(this.passwordInput.getValidity());
    const firstNameErrorText = validateInputName(this.firstNameInput.getValidity());
    const lastNameErrorText = validateInputName(this.lastNameInput.getValidity());
    const dateErrorText = validateInputDate(this.dateInput.getValidity());

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
    if (firstNameErrorText) {
      this.firstNameInput.showError(firstNameErrorText);
      this.registrationButton.disable();
      return;
    }
    if (lastNameErrorText) {
      this.lastNameInput.showError(lastNameErrorText);
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
    if (!this.isShippingUsedAsDefaultBilling && !isBillingAddressFormValid) {
      this.registrationButton.disable();
      return;
    }
    this.registrationButton.enable();
  }

  private handleDefaultShippingCheckboxClick(isChecked: boolean) {
    if (isChecked) {
      this.isShippingAddressUsedAsDefault = true;
    } else {
      this.isShippingAddressUsedAsDefault = false;
    }
    this.validateForm();
  }

  private handleDefaultBillingCheckboxClick(isChecked: boolean) {
    if (isChecked) {
      this.isBillingAddressUsedAsDefault = true;
    } else {
      this.isBillingAddressUsedAsDefault = false;
    }
    this.validateForm();
  }

  private handleDefaultShippingAsBillingCheckboxClick(isChecked: boolean) {
    if (isChecked) {
      this.isShippingUsedAsDefaultBilling = true;
      this.billingAddressForm.hideForm();
      this.defaultBillingCheckbox.hide();
    } else {
      this.isShippingUsedAsDefaultBilling = false;
      this.billingAddressForm.showForm();
      this.defaultBillingCheckbox.show();
    }
    this.validateForm();
  }

  private setupElements() {
    this.registrationForm.setAttribute('novalidate', '');
    this.registrationButton.setAttribute('type', 'submit');
  }

  private setupListeners() {
    this.registrationForm.addListener('submit', this.handleFormSubmit.bind(this));
    this.registrationForm.addListener('input', this.validateForm.bind(this));
  }

  private render() {
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
      this.defaultShippingCheckbox,
      this.billingAddressForm,
      this.defaultBillingCheckbox,
      this.defaultShippingAsBillingCheckbox,
      this.registrationButton,
      this.loginButton,
    ]);
    this.append([this.registrationForm]);
  }
}
