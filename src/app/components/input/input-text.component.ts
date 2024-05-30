import './input.scss';
import BaseComponent from '../base/base.component';

type InputTextComponentConfig = {
  id?: string;
  name?: string;
  required: boolean;
  labelText?: string;
  pattern: string;
};

export default class InputTextComponent extends BaseComponent<'div'> {
  label: BaseComponent<'label'>;

  input: BaseComponent<'input'>;

  error: BaseComponent<'span'>;

  constructor(config: InputTextComponentConfig) {
    super({ tag: 'div', classes: ['input-container'] });
    this.label = new BaseComponent({ tag: 'label', classes: ['label'] });
    this.input = new BaseComponent({ tag: 'input', classes: ['input'] });
    this.error = new BaseComponent({ tag: 'span', classes: ['error'] });

    this.setupElements(config);
    this.setupListeners();
    this.render();
  }

  setupElements(config: InputTextComponentConfig) {
    const { id, name, required, labelText, pattern } = config;
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('pattern', pattern);
    if (id) {
      this.input.setAttribute('id', id);
      this.label.setAttribute('for', id);
    }
    if (name) {
      this.input.setAttribute('name', name);
    }
    if (required) {
      this.input.setAttribute('required', '');
    }
    if (labelText) {
      this.label.setTextContent(labelText);
    }
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
