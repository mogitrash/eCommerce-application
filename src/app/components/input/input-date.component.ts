import './input.scss';
import BaseComponent from '../base/base.component';

type InputDateComponentConfig = {
  id: string;
  name: string;
  required: boolean;
  labelText: string;
  minYearDelta: number;
};

export default class InputDateComponent extends BaseComponent<'div'> {
  label: BaseComponent<'label'>;

  input: BaseComponent<'input'>;

  error: BaseComponent<'span'>;

  minYearDelta: number;

  constructor(config: InputDateComponentConfig) {
    super({ tag: 'div' });
    this.label = new BaseComponent({ tag: 'label', classes: ['label'] });
    this.input = new BaseComponent({ tag: 'input', classes: ['input'] });
    this.error = new BaseComponent({ tag: 'span', classes: ['error'] });

    this.minYearDelta = config.minYearDelta;
    this.setupElements(config);
    this.setupListeners();
    this.render();
  }

  handleDateValidity() {
    // const currentDate = new Date();
    // const date = new Date(this.input.getElement().value);
    // const month = date.getMonth() + 1;
    // const day = date.getDate();
    // const year = date.getFullYear();

    // Parse the input date string
    const inputDate = new Date(this.input.getElement().value);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in years
    const yearDifference = currentDate.getFullYear() - inputDate.getFullYear();

    // If the year difference is more than 13, it's valid
    if (yearDifference > this.minYearDelta) {
      return true;
    }

    // If the year difference is exactly 13, we need to check the month and day
    if (yearDifference === this.minYearDelta) {
      const monthDifference = currentDate.getMonth() - inputDate.getMonth();
      if (monthDifference > 0) {
        return true;
      }
      if (monthDifference === 0) {
        const dayDifference = currentDate.getDate() - inputDate.getDate();
        if (dayDifference >= 0) {
          return true;
        }
      }
    }
    return false;
  }

  setupElements(config: InputDateComponentConfig) {
    const { id, name, required, labelText } = config;
    this.input.setAttribute('type', 'date');
    this.input.setAttribute('id', id);
    if (required) {
      this.input.setAttribute('required', '');
    }
    this.input.setAttribute('name', name);
    this.label.setAttribute('for', id);
    this.label.setTextContent(labelText);
  }

  getValidity() {
    return this.input.getElement().validity;
  }

  showError(errorText: string) {
    this.error.addClass('error--shown');
    this.error.setTextContent(errorText);
  }

  hideError() {
    this.error.removeClass('error--shown');
    this.error.setTextContent('');
  }

  setupListeners() {
    this.input.addListener('input', this.hideError.bind(this));
  }

  render() {
    this.append([this.label, this.input, this.error]);
  }
}
