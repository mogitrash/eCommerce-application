import './input.scss';
import BaseComponent from '../base/base.component';

type InputPasswordComponentConfig = {
  id?: string;
  name?: string;
  required: boolean;
  labelText: string;
  pattern: string;
  minlength: string;
};

export default class InputPasswordComponent extends BaseComponent<'div'> {
  label: BaseComponent<'label'>;

  input: BaseComponent<'input'>;

  error: BaseComponent<'span'>;

  visibilityWrapper: BaseComponent<'div'>;

  visibilityInput: BaseComponent<'input'>;

  visibilityLabel: BaseComponent<'label'>;

  constructor(config: InputPasswordComponentConfig) {
    super({ tag: 'div', classes: ['input-container'] });
    this.label = new BaseComponent({ tag: 'label', classes: ['label'] });
    this.input = new BaseComponent({ tag: 'input', classes: ['input'] });
    this.error = new BaseComponent({ tag: 'span', classes: ['error'] });
    this.visibilityWrapper = new BaseComponent({ tag: 'div', classes: ['visibility_wrapper'] });
    this.visibilityInput = new BaseComponent({ tag: 'input' });
    this.visibilityLabel = new BaseComponent({ tag: 'label', classes: ['visibility_label'] });

    this.setupElements(config);
    this.setupListeners();
    this.render();
  }

  setupElements(config: InputPasswordComponentConfig) {
    const { id, name, required, labelText, pattern, minlength } = config;
    this.input.setAttribute('type', 'password');
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
    this.input.setAttribute('pattern', pattern);
    this.input.setAttribute('minlength', minlength);
    this.label.setTextContent(labelText);
    this.visibilityLabel.setTextContent('Show');

    this.visibilityInput.setAttribute('type', 'checkbox');
    this.visibilityInput.setAttribute('id', 'visibilityId');
    this.visibilityLabel.setAttribute('for', 'visibilityId');
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

  togglePasswordVisibility() {
    if (this.input.getAttribute('type') === 'password') {
      this.input.setAttribute('type', 'text');
    } else {
      this.input.setAttribute('type', 'password');
    }
  }

  setupListeners() {
    this.input.addListener('input', this.hideError.bind(this));
    this.visibilityInput.addListener('input', this.togglePasswordVisibility.bind(this));
  }

  render() {
    this.visibilityWrapper.append([this.visibilityInput, this.visibilityLabel]);
    this.append([this.label, this.input, this.error, this.visibilityWrapper]);
  }
}
