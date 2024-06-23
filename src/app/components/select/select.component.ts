import './select.scss';
import BaseComponent from '../base/base.component';

type SelectComponentConfig = {
  id?: string;
  name?: string;
  labelText?: string;
  required: boolean;
  options: { label: string; value: string }[];
};

export default class SelectComponent extends BaseComponent<'div'> {
  input: BaseComponent<'select'>;

  label: BaseComponent<'label'>;

  error: BaseComponent<'span'>;

  constructor(config: SelectComponentConfig) {
    const { options, labelText } = config;
    super({ tag: 'div', classes: ['input-container'] });
    this.input = new BaseComponent({ tag: 'select', classes: ['select'] });
    this.label = new BaseComponent({ tag: 'label', classes: ['label'], textContent: labelText });
    this.error = new BaseComponent({ tag: 'span', classes: ['error'] });

    this.createOption(options);
    this.setupElements(config);
    this.setupListeners();
    this.render();
  }

  setupElements(config: SelectComponentConfig) {
    const { id, name, required } = config;
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

  createOption(options: { label: string; value: string }[]) {
    options.forEach(({ label, value }) => {
      const optionComponent = new BaseComponent({ tag: 'option', textContent: label });
      optionComponent.setAttribute('value', value);
      this.input.append([optionComponent]);
    });
  }

  setupListeners() {
    this.input.addListener('input', this.hideError.bind(this));
  }

  render() {
    this.append([this.label, this.input, this.error]);
  }
}
