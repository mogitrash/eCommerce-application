import './address-form.scss';
import BaseComponent from '../base/base.component';
import {
  STREET_REGEX,
  CITY_REGEX,
  POSTAL_CODE_BELARUS_REGEX,
  POSTAL_CODE_GERMANY_REGEX,
  POSTAL_CODE_SPAIN_REGEX,
} from '../../models/constants/login-registration.constants';
import InputTextComponent from '../input/input-text.component';
import SelectComponent from '../select/select.component';
import Country from '../../models/country.model';

export default class AddressFormComponent extends BaseComponent<'div'> {
  private formName: BaseComponent<'p'>;

  private inputWrapper: BaseComponent<'div'>;

  private streetInput: InputTextComponent;

  private cityInput: InputTextComponent;

  private postalCodeInput: InputTextComponent;

  private countryInput: SelectComponent;

  constructor(config: { inputPrefix: string; formName: string }) {
    const { inputPrefix, formName } = config;
    super({ tag: 'div', classes: ['address_form'] });
    this.formName = new BaseComponent({
      tag: 'p',
      classes: ['hint'],
      textContent: formName,
    });
    this.inputWrapper = new BaseComponent({
      tag: 'div',
      classes: ['input_wrapper', 'input-address_wrapper'],
    });
    this.streetInput = new InputTextComponent({
      id: `${inputPrefix}StreetId`,
      name: `${inputPrefix}Street`,
      required: true,
      labelText: 'Street',
      pattern: STREET_REGEX,
    });
    this.cityInput = new InputTextComponent({
      id: `${inputPrefix}CityId`,
      name: `${inputPrefix}City`,
      required: true,
      labelText: 'City',
      pattern: CITY_REGEX,
    });
    this.postalCodeInput = new InputTextComponent({
      id: `${inputPrefix}PostalCodeId`,
      name: `${inputPrefix}PostalCode`,
      required: true,
      labelText: 'Postal Code',
      pattern: CITY_REGEX,
    });
    this.countryInput = new SelectComponent({
      id: `${inputPrefix}CountryId`,
      name: `${inputPrefix}Country`,
      labelText: 'Country',
      required: true,
      options: [
        { label: 'Please choose an option', value: '' },
        { label: 'Belarus', value: Country.BY },
        { label: 'Germany', value: Country.DE },
        { label: 'Spain', value: Country.ES },
      ],
    });
    this.render();
  }

  public validateForm(): boolean {
    const countryErrorText = AddressFormComponent.validateInputCountry(
      this.countryInput.getValidity(),
    );
    const streetErrorText = AddressFormComponent.validateInputStreet(
      this.streetInput.getValidity(),
    );
    const cityErrorText = AddressFormComponent.validateInputCity(this.cityInput.getValidity());
    const postalCodeErrorText = this.validateInputPostalCode(this.postalCodeInput.getValidity());

    if (streetErrorText) {
      this.streetInput.showError(streetErrorText);
      return false;
    }
    if (cityErrorText) {
      this.cityInput.showError(cityErrorText);
      return false;
    }
    if (countryErrorText) {
      this.countryInput.showError(countryErrorText);
      return false;
    }
    if (postalCodeErrorText) {
      this.postalCodeInput.showError(postalCodeErrorText);
      return false;
    }
    return true;
  }

  private static validateInputCountry(validity: ValidityState): string {
    if (validity.valueMissing) {
      return 'Please select country.';
    }
    return '';
  }

  private static validateInputStreet(validity: ValidityState): string {
    if (validity.valueMissing) {
      return 'Please enter value.';
    }
    return '';
  }

  private static validateInputCity(validity: ValidityState): string {
    if (validity.valueMissing) {
      return 'Please enter value.';
    }
    if (validity.patternMismatch) {
      return 'Must contain at least one character and no special characters or numbers.';
    }
    return '';
  }

  private validateInputPostalCode(validity: ValidityState): string {
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

  public showForm(): void {
    this.removeClass('address_form--hidden');
  }

  public hideForm(): void {
    this.addClass('address_form--hidden');
  }

  private render() {
    this.inputWrapper.append([
      this.streetInput,
      this.cityInput,
      this.countryInput,
      this.postalCodeInput,
    ]);
    this.append([this.formName, this.inputWrapper]);
  }
}
