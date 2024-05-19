import './input.scss';
import BaseComponent from '../base/base.component';

type InputCheckboxComponentConfig = {
  id: string;
  name: string;
  labelText: string;
  onSelect: (isChecked: boolean) => void;
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

  setupElements(config: InputCheckboxComponentConfig) {
    const { id, name, labelText } = config;
    this.input.setAttribute('type', 'checkbox');
    this.input.setAttribute('id', id);
    this.input.setAttribute('name', name);
    this.label.setAttribute('for', id);
    this.label.setTextContent(labelText);
  }

  setupListeners(config: InputCheckboxComponentConfig) {
    const { onSelect } = config;
    this.input.addListener('change', () => onSelect(this.input.getElement().checked));
  }

  render() {
    this.append([this.input, this.label]);
  }
}
