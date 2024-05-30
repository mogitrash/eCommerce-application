import './address-form.scss';
import BaseComponent from '../base/base.component';
import {
  STREET_REGEX,
  CITY_REGEX,
  SUPPORTED_COUNTRIES,
} from '../../models/constants/login-registration.constants';
import InputTextComponent from '../input/input-text.component';
import SelectComponent from '../select/select.component';
import Country from '../../models/country.model';
import {
  validateInputCity,
  validateInputCountry,
  validateInputPostalCode,
  validateInputStreet,
} from '../../utilities/input-validators';

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
      options: [{ label: 'Please choose an option', value: '' }, ...SUPPORTED_COUNTRIES],
    });
    this.render();
  }

  public validateForm(): boolean {
    const countryErrorText = validateInputCountry(this.countryInput.getValidity());
    const streetErrorText = validateInputStreet(this.streetInput.getValidity());
    const cityErrorText = validateInputCity(this.cityInput.getValidity());
    const postalCodeErrorText = validateInputPostalCode(
      this.postalCodeInput.getValidity(),
      this.postalCodeInput.input.getElement().value,
      this.countryInput.input.getElement().value as Country,
    );

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
