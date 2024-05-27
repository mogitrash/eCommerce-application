import './profile.scss';
import BaseComponent from '../base/base.component';
import ProfileService from '../../services/profile.service';
import BaseAddress from '../../models/base-address.model';
import InputCheckboxComponent from '../input/input-checkbox.component';

export default class ProfileComponent extends BaseComponent<'div'> {
  private profileService = new ProfileService();

  constructor() {
    super({ tag: 'div', classes: ['profile'] });
    this.createCustomerProfile();
  }

  async createCustomerProfile(): Promise<void> {
    const customer = await this.profileService.getUserProfile();
    const {
      firstName,
      lastName,
      dateOfBirth,
      shippingAddressIds,
      addresses,
      defaultShippingAddressId,
      billingAddressIds,
      defaultBillingAddressId,
    } = customer;

    this.createPersonalDetails(firstName, lastName, dateOfBirth);
    this.createAddresses(
      'Shipping Address',
      addresses,
      shippingAddressIds,
      defaultShippingAddressId,
    );
    this.createAddresses('Billing Address', addresses, billingAddressIds, defaultBillingAddressId);
  }

  createPersonalDetails(firstName: string, lastName: string, dateOfBirth: Date): void {
    const personalDetailsContainer = new BaseComponent({
      tag: 'div',
      classes: ['profile_container'],
    });
    const personalDetailsHeading = new BaseComponent({
      tag: 'h2',
      classes: ['profile_heading'],
      textContent: 'Personal Details',
    });
    const firstNameWrapper = new BaseComponent({
      tag: 'div',
      classes: ['profile_item-wrapper'],
    });
    const firstNameTitle = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-title'],
      textContent: 'First name',
    });
    const firstNameValue = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-value'],
      textContent: firstName,
    });
    const lastNameWrapper = new BaseComponent({
      tag: 'div',
      classes: ['profile_item-wrapper'],
    });
    const lastNameTitle = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-title'],
      textContent: 'Last name',
    });
    const lastNameValue = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-value'],
      textContent: lastName,
    });
    const dateOfBirthWrapper = new BaseComponent({
      tag: 'div',
      classes: ['profile_item-wrapper'],
    });
    const dateOfBirthTitle = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-title'],
      textContent: 'Date of Birth',
    });
    const dateOfBirthValue = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-value'],
      textContent: dateOfBirth.toString(),
    });

    firstNameWrapper.append([firstNameTitle, firstNameValue]);
    lastNameWrapper.append([lastNameTitle, lastNameValue]);
    dateOfBirthWrapper.append([dateOfBirthTitle, dateOfBirthValue]);
    personalDetailsContainer.append([
      personalDetailsHeading,
      firstNameWrapper,
      lastNameWrapper,
      dateOfBirthWrapper,
    ]);
    this.append([personalDetailsContainer]);
  }

  createAddresses(
    headingText: string,
    addresses: BaseAddress[],
    addressIds?: string[],
    defaultAddressId?: string,
  ) {
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
      return ProfileComponent.createAddress(profileAddress, defaultAddressId);
    });
    addressContainer.append([addressHeading, ...profileAddresses]);
    this.append([addressContainer]);
  }

  static createAddress(address: BaseAddress, defaultAddressId?: string): BaseComponent<'div'> {
    const isUsedAsDefault = defaultAddressId === address.id;
    const addressWrapper = new BaseComponent({
      tag: 'div',
      classes: isUsedAsDefault
        ? ['profile_address', 'profile_address--default']
        : ['profile_address'],
    });
    const streetWrapper = new BaseComponent({
      tag: 'div',
      classes: ['profile_item-wrapper'],
    });
    const streetTitle = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-title'],
      textContent: 'Street',
    });
    const streetValue = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-value'],
      textContent: address.streetName,
    });
    const cityWrapper = new BaseComponent({
      tag: 'div',
      classes: ['profile_item-wrapper'],
    });
    const cityTitle = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-title'],
      textContent: 'City',
    });
    const cityValue = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-value'],
      textContent: address.city,
    });
    const countryWrapper = new BaseComponent({
      tag: 'div',
      classes: ['profile_item-wrapper'],
    });
    const countryTitle = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-title'],
      textContent: 'Country',
    });
    const countryValue = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-value'],
      textContent: address.country,
    });
    const postalCodeWrapper = new BaseComponent({
      tag: 'div',
      classes: ['profile_item-wrapper'],
    });
    const postalCodeTitle = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-title'],
      textContent: 'Postal Code',
    });
    const postalCodeValue = new BaseComponent({
      tag: 'p',
      classes: ['profile_item-value'],
      textContent: address.postalCode,
    });
    const defaultCheckbox = new InputCheckboxComponent({
      id: address.id as string,
      name: address.id as string,
      labelText: 'Use as default',
      isChecked: isUsedAsDefault,
      onSelect: () => {},
    });
    streetWrapper.append([streetTitle, streetValue]);
    cityWrapper.append([cityTitle, cityValue]);
    countryWrapper.append([countryTitle, countryValue]);
    postalCodeWrapper.append([postalCodeTitle, postalCodeValue]);
    addressWrapper.append([
      streetWrapper,
      cityWrapper,
      countryWrapper,
      postalCodeWrapper,
      defaultCheckbox,
    ]);
    return addressWrapper;
  }
}
