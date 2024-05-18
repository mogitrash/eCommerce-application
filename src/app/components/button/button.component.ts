import './button.scss';
import BaseComponent from '../base/base.component';

type ButtonConfig = { text: string; onClick?: (event: Event) => void };

export default class Button extends BaseComponent<'button'> {
  constructor(config: ButtonConfig) {
    const { text, onClick } = config;
    super({ tag: 'button', classes: ['button'], textContent: text });
    if (onClick) {
      this.addListener('click', onClick);
    }
  }

  public disable() {
    this.getElement().setAttribute('disabled', '');
  }

  public enable() {
    this.getElement().removeAttribute('disabled');
  }
}
