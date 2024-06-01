import './profile.scss';
import { v4 as uuidv4 } from 'uuid';
import BaseComponent from '../base/base.component';
import ProfileService from '../../services/profile.service';
import NotificationService from '../../services/notification.service';
import authenticationService from '../../services/authentication.service';
import BaseAddress from '../../models/base-address.model';
import InputCheckboxComponent from '../input/input-checkbox.component';
import EditableItemComponent from '../editable-item/editable-item.component';
import Customer, { CustomerUpdateAction } from '../../models/customer.model';
import Country from '../../models/country.model';
import {
  CITY_REGEX,
  EMAIL_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  STREET_REGEX,
} from '../../models/constants/login-registration.constants';
import {
  validateInputCity,
  validateInputCountry,
  validateInputDate,
  validateInputName,
  validateInputEmail,
  validateInputPostalCode,
  validateInputStreet,
  validateInputPassword,
} from '../../utilities/input-validators';
import Button from '../button/button.component';
import AddressFormComponent from '../address-form/address-form.component';

type AddressType = 'billing' | 'shipping';

export default class ProfileComponent extends BaseComponent<'div'> {
  private customerVersion!: number;

  private profileService = new ProfileService();

  private authenticationService = authenticationService;

  private notificationService = new NotificationService();

  private customer!: Customer;

  private addressesWrappers: { [key: string]: BaseComponent<'div'> } = {};

  constructor() {
    super({ tag: 'div', classes: ['profile'] });
    this.createCustomerProfile();
  }

  private async createCustomerProfile(): Promise<void> {
    this.customer = await this.profileService.getUserProfile();
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      shippingAddressIds,
      addresses,
      defaultShippingAddressId,
      billingAddressIds,
      defaultBillingAddressId,
      version,
    } = this.customer;

    this.customerVersion = version;
    this.createPersonalDetails(firstName, lastName, email, dateOfBirth);
    this.createAddresses('shipping', addresses, shippingAddressIds, defaultShippingAddressId);
    this.createAddresses('billing', addresses, billingAddressIds, defaultBillingAddressId);
  }

  private createPersonalDetails(
    firstName: string,
    lastName: string,
    email: string,
    dateOfBirth: string,
  ): void {
    const personalDetailsContainer = new BaseComponent({
      tag: 'div',
      classes: ['profile_container'],
    });
    const personalDetailsHeading = new BaseComponent({
      tag: 'h2',
      classes: ['profile_heading'],
      textContent: 'Personal Details',
    });
    const firstNameItem = new EditableItemComponent({
      title: 'First Name',
      value: firstName,
      onSave: this.updateFirstName.bind(this),
      pattern: NAME_REGEX,
      validator: validateInputName,
    });
    const lastNameItem = new EditableItemComponent({
      title: 'Last Name',
      value: lastName,
      pattern: NAME_REGEX,
      onSave: this.updateLastName.bind(this),
      validator: validateInputName,
    });
    const dateOfBirthItem = new EditableItemComponent({
      title: 'Date of Birth',
      value: dateOfBirth,
      onSave: this.updateDateOfBirth.bind(this),
      type: 'date',
      validator: validateInputDate,
    });
    const emailItem = new EditableItemComponent({
      title: 'Email',
      value: email,
      onSave: this.updateEmail.bind(this),
      pattern: EMAIL_REGEX,
      validator: validateInputEmail,
    });
    const passwordItem = new EditableItemComponent({
      title: 'Password',
      value: '********',
      type: 'password',
      onSave: this.updatePassword.bind(this),
      pattern: PASSWORD_REGEX,
      validator: validateInputPassword,
    });
    personalDetailsContainer.append([
      personalDetailsHeading,
      firstNameItem,
      lastNameItem,
      emailItem,
      dateOfBirthItem,
      passwordItem,
    ]);
    this.append([personalDetailsContainer]);
  }

  private createAddresses(
    addressType: AddressType,
    addresses: BaseAddress[],
    addressIds?: string[],
    defaultAddressId?: string,
  ): void {
    if (!addressIds) return;
    const addressContainer = new BaseComponent({
      tag: 'div',
      classes: ['profile_container'],
    });
    const addressesWrapper = new BaseComponent({
      tag: 'div',
    });
    const addressHeading = new BaseComponent({
      tag: 'h2',
      classes: ['profile_heading'],
      textContent: `${addressType} address`,
    });
    const profileAddresses = addressIds.map((addressId) => {
      const profileAddress = addresses.find((address) => address.id === addressId) as BaseAddress;
      return this.createAddress(profileAddress, addressType, defaultAddressId);
    });
    const addNewAddress: Button = new Button({
      text: `Add new ${addressType} address`,
      size: 'small',
      onClick: () => this.createAddressForm(addressContainer, addressType, addNewAddress),
    });
    this.addressesWrappers[addressType] = addressesWrapper;
    addressesWrapper.append(profileAddresses);
    addressContainer.append([addressHeading, addressesWrapper, addNewAddress]);
    this.append([addressContainer]);
  }

  private createAddressForm(
    addressContainer: BaseComponent<'div'>,
    addressType: AddressType,
    addNewAddress: Button,
  ) {
    addNewAddress.disable();
    const newAddressForm = new BaseComponent({
      tag: 'form',
    });
    const addressFormElements = new AddressFormComponent({
      formName: `New ${addressType} address`,
      inputPrefix: addressType,
    });
    const controls = new BaseComponent({
      tag: 'div',
      classes: ['profile_new-address-controls'],
    });
    const save = new Button({
      text: 'Save',
      size: 'small',
      style: 'green',
      disabled: true,
      type: 'button',
    });
    const cancel = new Button({
      text: 'Cancel',
      size: 'small',
      style: 'red',
      type: 'button',
      onClick: () => {
        addNewAddress.enable();
        newAddressForm.getElement().remove();
      },
    });
    newAddressForm.addListener('input', () => {
      const isFormValid = addressFormElements.validateForm();
      if (isFormValid) {
        save.enable();
      } else {
        save.disable();
      }
    });
    controls.append([save, cancel]);
    save.addListener('click', () => this.handleSaveNewAddress(newAddressForm, addressType));
    newAddressForm.append([addressFormElements, controls]);
    addressContainer.append([newAddressForm]);
  }

  private async handleSaveNewAddress(
    newAddressForm: BaseComponent<'form'>,
    addressType: AddressType,
  ) {
    const formData = new FormData(newAddressForm.getElement());
    const addressKey = uuidv4();
    const address: BaseAddress = {
      streetName: formData.get(`${addressType}Street`) as string,
      city: formData.get(`${addressType}City`) as string,
      postalCode: formData.get(`${addressType}PostalCode`) as string,
      country: formData.get(`${addressType}Country`) as Country,
      key: addressKey,
    };
    await this.updateUserProfile({
      action: 'addAddress',
      address,
    });
    const updatedCustomer = await this.updateUserProfile({
      action: addressType === 'billing' ? 'addBillingAddressId' : 'addShippingAddressId',
      addressKey,
    });
    if (updatedCustomer) {
      const customerAddress = updatedCustomer.addresses.find(
        ({ key }) => key === addressKey,
      ) as BaseAddress;
      this.addressesWrappers[addressType].append([
        this.createAddress(customerAddress, addressType),
      ]);
    }
    newAddressForm.getElement().remove();
  }

  private createAddress(
    address: BaseAddress,
    addressType: AddressType,
    defaultAddressId?: string,
  ): BaseComponent<'div'> {
    const addressToUse = { ...address };
    const isUsedAsDefault = defaultAddressId ? defaultAddressId === address.id : false;
    const addressWrapper = new BaseComponent({
      tag: 'div',
      classes: isUsedAsDefault
        ? ['profile_address', 'profile_address--default']
        : ['profile_address'],
    });
    const street = new EditableItemComponent({
      title: 'Street',
      value: addressToUse.streetName,
      onSave: (streetName: string) => {
        addressToUse.streetName = streetName;
        this.updateAddress(addressToUse);
      },
      pattern: STREET_REGEX,
      validator: validateInputStreet,
    });
    const city = new EditableItemComponent({
      title: 'City',
      value: addressToUse.city,
      onSave: (cityName: string) => {
        addressToUse.city = cityName;
        this.updateAddress(addressToUse);
      },
      pattern: CITY_REGEX,
      validator: validateInputCity,
    });
    const country = new EditableItemComponent({
      title: 'Country',
      value: addressToUse.country,
      onSave: (countryName: string | Country) => {
        addressToUse.country = countryName as Country;
        this.updateAddress(addressToUse);
      },
      type: 'countrySelect',
      validator: validateInputCountry,
    });
    const postalCode = new EditableItemComponent({
      title: 'Postal Code',
      value: addressToUse.postalCode,
      onSave: (postalCodeNumber: string) => {
        addressToUse.postalCode = postalCodeNumber;
        this.updateAddress(addressToUse);
      },
      validator: (validity: Partial<ValidityState>, newValue) => {
        return validateInputPostalCode(validity, newValue as string, addressToUse.country);
      },
    });
    const addressControls = new BaseComponent({
      tag: 'div',
      classes: ['profile_address-controls'],
    });
    const defaultCheckbox = new InputCheckboxComponent({
      id: addressToUse.id as string,
      name: addressToUse.id as string,
      labelText: `Default ${addressType} address`,
      disabled: isUsedAsDefault,
      isChecked: isUsedAsDefault,
      onSelect: () => {
        this.handleDefaultAddressSelection(
          addressToUse,
          addressType,
          addressWrapper,
          defaultCheckbox,
        );
      },
    });
    const deleteButton = new Button({
      text: 'Delete',
      size: 'small',
      style: 'red',
      onClick: () => {
        addressWrapper.getElement().remove();
        this.removeAddress(addressToUse.id as string);
      },
    });
    addressControls.append([defaultCheckbox, deleteButton]);
    addressWrapper.append([street, city, country, postalCode, addressControls]);
    return addressWrapper;
  }

  private removeAddress(addressId: string) {
    this.updateUserProfile({
      action: 'removeAddress',
      addressId,
    });
  }

  private handleDefaultAddressSelection(
    addressToUse: BaseAddress,
    addressType: AddressType,
    addressWrapper: BaseComponent<'div'>,
    defaultCheckbox: InputCheckboxComponent,
  ): void {
    if (addressType === 'billing') {
      this.setBillingAddressAsDefault(addressToUse.id as string, addressWrapper, defaultCheckbox);
    } else {
      this.setShippingAddressAsDefault(addressToUse.id as string, addressWrapper, defaultCheckbox);
    }
  }

  static handleRemoveDefaultAddressStyles(addressElement: Element): void {
    addressElement.classList.remove('profile_address--default');
    const checkbox = addressElement.querySelector('input[type=checkbox]');
    checkbox?.removeAttribute('disabled');
    (checkbox as HTMLInputElement).checked = false;
  }

  private updateFirstName(firstName: string): void {
    this.updateUserProfile({
      action: 'setFirstName',
      firstName,
    });
  }

  private updateLastName(lastName: string): void {
    this.updateUserProfile({
      action: 'setLastName',
      lastName,
    });
  }

  private updateDateOfBirth(dateOfBirth: string): void {
    this.updateUserProfile({
      action: 'setDateOfBirth',
      dateOfBirth,
    });
  }

  private updateEmail(email: string): void {
    this.customer.email = email;
    this.updateUserProfile({
      action: 'changeEmail',
      email,
    });
  }

  private updateAddress(address: BaseAddress): void {
    this.updateUserProfile({
      action: 'changeAddress',
      addressId: address.id as string,
      address,
    });
  }

  private async setBillingAddressAsDefault(
    addressId: string,
    addressWrapper: BaseComponent<'div'>,
    defaultCheckbox: InputCheckboxComponent,
  ): Promise<void> {
    await this.updateUserProfile({
      action: 'setDefaultBillingAddress',
      addressId,
    });
    const currentDefaultAddress = this.addressesWrappers.billing
      .getElement()
      .querySelector('.profile_address--default');
    addressWrapper.addClass('profile_address--default');
    defaultCheckbox.disable();
    if (currentDefaultAddress) {
      ProfileComponent.handleRemoveDefaultAddressStyles(currentDefaultAddress);
    }
  }

  private async setShippingAddressAsDefault(
    addressId: string,
    addressWrapper: BaseComponent<'div'>,
    defaultCheckbox: InputCheckboxComponent,
  ): Promise<void> {
    await this.updateUserProfile({
      action: 'setDefaultShippingAddress',
      addressId,
    });
    const currentDefaultAddress = this.addressesWrappers.shipping
      .getElement()
      .querySelector('.profile_address--default');
    addressWrapper.addClass('profile_address--default');
    defaultCheckbox.disable();
    if (currentDefaultAddress) {
      ProfileComponent.handleRemoveDefaultAddressStyles(currentDefaultAddress);
    }
  }

  private async updateUserProfile(action: CustomerUpdateAction): Promise<void | Customer> {
    try {
      const customer = await this.profileService.updateUserProfile(this.customerVersion, action);
      const { version } = customer;
      if (version) {
        this.customerVersion = version;
        this.notificationService.notify('Changes were saved');
        return customer;
      }
      this.notificationService.notify('Changes were not saved');
    } catch (error) {
      this.notificationService.notify('Changes were not saved');
    }
    return undefined;
  }

  private async updatePassword(newPassword: string, currentPassword?: string): Promise<void> {
    try {
      const { version } = await this.profileService.updateUserPassword(
        this.customerVersion,
        currentPassword as string,
        newPassword,
      );
      if (version) {
        this.customerVersion = version;
        await this.authenticationService.signInCustomer({
          password: newPassword,
          email: this.customer.email,
        });
        this.notificationService.notify('Password was saved');
      } else {
        this.notificationService.notify('Password was not saved');
      }
    } catch (error) {
      this.notificationService.notify('Password was not saved');
    }
  }
}
