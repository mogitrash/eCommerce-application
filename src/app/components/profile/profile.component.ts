import './profile.scss';
import BaseComponent from '../base/base.component';
import ProfileService from '../../services/profile.service';
import NotificationService from '../../services/notification.service';
import BaseAddress from '../../models/base-address.model';
import InputCheckboxComponent from '../input/input-checkbox.component';
import EditableItemComponent from '../editable-item/editable-item.component';
import { CustomerUpdateAction } from '../../models/customer.model';
import Country from '../../models/country.model';
import {
  CITY_REGEX,
  EMAIL_REGEX,
  NAME_REGEX,
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
} from '../../utilities/input-validators';

export default class ProfileComponent extends BaseComponent<'div'> {
  private customerVersion!: number;

  private profileService = new ProfileService();

  private notificationService = new NotificationService();

  constructor() {
    super({ tag: 'div', classes: ['profile'] });
    this.createCustomerProfile();
  }

  private async createCustomerProfile(): Promise<void> {
    const customer = await this.profileService.getUserProfile();
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
    } = customer;

    this.customerVersion = version;
    this.createPersonalDetails(firstName, lastName, email, dateOfBirth);
    this.createAddresses(
      'Shipping Address',
      addresses,
      shippingAddressIds,
      defaultShippingAddressId,
    );
    this.createAddresses('Billing Address', addresses, billingAddressIds, defaultBillingAddressId);
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
    personalDetailsContainer.append([
      personalDetailsHeading,
      firstNameItem,
      lastNameItem,
      emailItem,
      dateOfBirthItem,
    ]);
    this.append([personalDetailsContainer]);
  }

  private createAddresses(
    headingText: string,
    addresses: BaseAddress[],
    addressIds?: string[],
    defaultAddressId?: string,
  ): void {
    if (!addressIds) return;
    const addressContainer = new BaseComponent({
      tag: 'div',
      classes: ['profile_container'],
    });
    const addressHeading = new BaseComponent({
      tag: 'h2',
      classes: ['profile_heading'],
      textContent: headingText,
    });
    const profileAddresses = addressIds.map((addressId) => {
      const profileAddress = addresses.find((address) => address.id === addressId) as BaseAddress;
      return this.createAddress(profileAddress, defaultAddressId);
    });
    addressContainer.append([addressHeading, ...profileAddresses]);
    this.append([addressContainer]);
  }

  private createAddress(address: BaseAddress, defaultAddressId?: string): BaseComponent<'div'> {
    const addressToUse = { ...address };
    const isUsedAsDefault = defaultAddressId === address.id;
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
    const defaultCheckbox = new InputCheckboxComponent({
      id: addressToUse.id as string,
      name: addressToUse.id as string,
      labelText: 'Use as default',
      isChecked: isUsedAsDefault,
      onSelect: () => {},
    });
    addressWrapper.append([street, city, country, postalCode, defaultCheckbox]);
    return addressWrapper;
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

  private async updateUserProfile(action: CustomerUpdateAction): Promise<void> {
    try {
      const { version } = await this.profileService.updateUserProfile(this.customerVersion, action);
      if (version) {
        this.customerVersion = version;
        this.notificationService.notify('Changes were saved');
      } else {
        this.notificationService.notify('Changes were not saved');
      }
    } catch (error) {
      this.notificationService.notify('Changes were not saved');
    }
  }
}
