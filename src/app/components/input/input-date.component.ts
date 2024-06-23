import './input.scss';
import BaseComponent from '../base/base.component';

type InputDateComponentConfig = {
  id?: string;
  name?: string;
  required: boolean;
  labelText?: string;
  minYearDelta: number;
};

export default class InputDateComponent extends BaseComponent<'div'> {
  label: BaseComponent<'label'>;

  input: BaseComponent<'input'>;

  error: BaseComponent<'span'>;

  minYearDelta: number;

  constructor(config: InputDateComponentConfig) {
    super({ tag: 'div', classes: ['input-container'] });
    this.label = new BaseComponent({ tag: 'label', classes: ['label'] });
    this.input = new BaseComponent({ tag: 'input', classes: ['input'] });
    this.error = new BaseComponent({ tag: 'span', classes: ['error'] });

    this.minYearDelta = config.minYearDelta;
    this.setupElements(config);
    this.setupListeners();
    this.render();
  }

  handleDateValidity() {
    const inputDate = new Date(this.input.getElement().value);
    const currentDate = new Date();
    const yearDifference = currentDate.getFullYear() - inputDate.getFullYear();

    if (yearDifference > this.minYearDelta) {
      return true;
    }

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
    if (id) {
      this.input.setAttribute('id', id);
      this.label.setAttribute('for', id);
    }
    if (required) {
      this.input.setAttribute('required', '');
    }
    if (name) {
      this.input.setAttribute('name', name);
    }
    if (labelText) {
      this.label.setTextContent(labelText);
    }
  }

  getValidity(): Partial<ValidityState> {
    return {
      valid: this.handleDateValidity(),
    };
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
