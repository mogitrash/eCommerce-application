import './profile.scss';
import BaseComponent from '../base/base.component';
import ProfileService from '../../services/profile.service';
import BaseAddress from '../../models/base-address.model';
import InputCheckboxComponent from '../input/input-checkbox.component';
import EditableItemComponent from '../editable-item/editable-item.component';

export default class ProfileComponent extends BaseComponent<'div'> {
  private profileService = new ProfileService();

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

  private createPersonalDetails(firstName: string, lastName: string, dateOfBirth: string): void {
    const personalDetailsContainer = new BaseComponent({
      tag: 'div',
      classes: ['profile_container'],
    });
    const personalDetailsHeading = new BaseComponent({
      tag: 'h2',
      classes: ['profile_heading'],
      textContent: 'Personal Details',
    });
    const firstNameItem = new EditableItemComponent({ title: 'First Name', value: firstName });
    const lastNameItem = new EditableItemComponent({ title: 'Last Name', value: lastName });
    const dateOfBirthItem = new EditableItemComponent({
      title: 'Date of Birth',
      value: dateOfBirth,
    });
    personalDetailsContainer.append([
      personalDetailsHeading,
      firstNameItem,
      lastNameItem,
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
      return ProfileComponent.createAddress(profileAddress, defaultAddressId);
    });
    addressContainer.append([addressHeading, ...profileAddresses]);
    this.append([addressContainer]);
  }

  private static createAddress(
    address: BaseAddress,
    defaultAddressId?: string,
  ): BaseComponent<'div'> {
    const isUsedAsDefault = defaultAddressId === address.id;
    const addressWrapper = new BaseComponent({
      tag: 'div',
      classes: isUsedAsDefault
        ? ['profile_address', 'profile_address--default']
        : ['profile_address'],
    });
    const street = new EditableItemComponent({ title: 'Street', value: address.streetName });
    const city = new EditableItemComponent({ title: 'City', value: address.city });
    const country = new EditableItemComponent({ title: 'Country', value: address.country });
    const postalCode = new EditableItemComponent({
      title: 'Postal Code',
      value: address.postalCode,
    });
    const defaultCheckbox = new InputCheckboxComponent({
      id: address.id as string,
      name: address.id as string,
      labelText: 'Use as default',
      isChecked: isUsedAsDefault,
      onSelect: () => {},
    });
    addressWrapper.append([street, city, country, postalCode, defaultCheckbox]);
    return addressWrapper;
  }
}
