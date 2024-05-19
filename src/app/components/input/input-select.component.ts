import './input.scss';
import BaseComponent from '../base/base.component';

type InputSelectComponentConfig = {
  id: string;
  name: string;
  required: boolean;
  labelText: string;
  pattern: string;
};

export default class InputSelectComponent extends BaseComponent<'div'> {
  label: BaseComponent<'label'>;

  input: BaseComponent<'input'>;

  error: BaseComponent<'span'>;

  constructor(config: InputSelectComponentConfig) {
    super({ tag: 'div' });
    this.label = new BaseComponent({ tag: 'label', classes: ['label'] });
    this.input = new BaseComponent({ tag: 'input', classes: ['input'] });
    this.error = new BaseComponent({ tag: 'span', classes: ['error'] });

    this.setupElements(config);
    this.setupListeners();
    this.render();
  }

  setupElements(config: InputSelectComponentConfig) {
    const { id, name, required, labelText, pattern } = config;
    this.input.setAttribute('type', 'select');
    this.input.setAttribute('id', id);
    if (required) {
      this.input.setAttribute('required', '');
    }
    this.input.setAttribute('pattern', pattern);
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
