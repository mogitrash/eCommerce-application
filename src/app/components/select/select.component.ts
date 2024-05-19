import './select.scss';
import BaseComponent from '../base/base.component';

type SelectComponentConfig = {
  id: string;
  name: string;
  labelText: string;
  required: boolean;
  options: { label: string; value: string }[];
};

export default class SelectComponent extends BaseComponent<'div'> {
  select: BaseComponent<'select'>;

  label: BaseComponent<'label'>;

  error: BaseComponent<'span'>;

  constructor(config: SelectComponentConfig) {
    const { options, labelText } = config;
    super({ tag: 'div' });
    this.select = new BaseComponent({ tag: 'select', classes: ['select'] });
    this.label = new BaseComponent({ tag: 'label', classes: ['label'], textContent: labelText });
    this.error = new BaseComponent({ tag: 'span', classes: ['error'] });

    this.createOption(options);
    this.setupElements(config);
    this.setupListeners();
    this.render();
  }

  setupElements(config: SelectComponentConfig) {
    const { id, name, required } = config;
    this.select.setAttribute('id', id);
    this.select.setAttribute('name', name);
    this.label.setAttribute('for', id);
    if (required) {
      this.select.setAttribute('required', '');
    }
  }

  getValidity() {
    return this.select.getElement().validity;
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
      this.select.append([optionComponent]);
    });
  }

  setupListeners() {
    this.select.addListener('input', this.hideError.bind(this));
  }

  render() {
    this.append([this.label, this.select, this.error]);
  }
}
