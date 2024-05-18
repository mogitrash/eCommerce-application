import './select.scss';
import BaseComponent from '../base/base.component';

export default class SelectComponent extends BaseComponent<'div'> {
  select: BaseComponent<'select'>;

  label: BaseComponent<'label'>;

  constructor(options: string[]) {
    super({ tag: 'div' });
    this.select = new BaseComponent({ tag: 'select', classes: ['select'] });
    this.label = new BaseComponent({ tag: 'label', classes: ['label'], textContent: 'Country' });

    this.createOption(options);
    this.render();
  }

  createOption(options: string[]) {
    options.forEach((option) => {
      const optionComponent = new BaseComponent({ tag: 'option', textContent: option });
      optionComponent.setAttribute('value', option);
      this.select.append([optionComponent]);
    });
  }

  render() {
    this.append([this.label, this.select]);
  }
}
