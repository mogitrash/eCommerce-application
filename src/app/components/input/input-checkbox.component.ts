import './input.scss';
import BaseComponent from '../base/base.component';

type InputCheckboxComponentConfig = {
  id: string;
  name: string;
  labelText: string;
  onSelect: (isChecked: boolean) => void;
  isChecked?: boolean;
  disabled?: boolean;
};

export default class InputCheckboxComponent extends BaseComponent<'div'> {
  label: BaseComponent<'label'>;

  input: BaseComponent<'input'>;

  constructor(config: InputCheckboxComponentConfig) {
    super({ tag: 'div', classes: ['input_checkbox'] });
    this.label = new BaseComponent({ tag: 'label', classes: ['label'] });
    this.input = new BaseComponent({ tag: 'input', classes: ['input'] });

    this.setupElements(config);
    this.setupListeners(config);
    this.render();
  }

  private setupElements(config: InputCheckboxComponentConfig) {
    const { id, name, labelText, isChecked, disabled } = config;
    this.input.setAttribute('type', 'checkbox');
    this.input.setAttribute('id', id);
    this.input.setAttribute('name', name);
    this.label.setAttribute('for', id);
    this.label.setTextContent(labelText);
    if (isChecked) {
      this.input.setAttribute('checked', '');
    }
    if (disabled) {
      this.disable();
    }
  }

  private setupListeners(config: InputCheckboxComponentConfig) {
    const { onSelect } = config;
    this.input.addListener('change', () => onSelect(this.input.getElement().checked));
  }

  public show(): void {
    this.removeClass('input_checkbox--hidden');
  }

  public hide(): void {
    this.addClass('input_checkbox--hidden');
  }

  public disable(): void {
    this.input.setAttribute('disabled', '');
  }

  public enable(): void {
    this.input.removeAttribute('disabled');
  }

  render() {
    this.append([this.input, this.label]);
  }
}
