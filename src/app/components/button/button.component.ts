import './button.scss';
import BaseComponent from '../base/base.component';

type ButtonConfig = { text: string; onClick: (event: Event) => void };

export default class Button extends BaseComponent<'button'> {
  constructor(config: ButtonConfig) {
    const { text, onClick } = config;
    super('button', ['button'], text);
    this.addListener('click', onClick);
  }
}
