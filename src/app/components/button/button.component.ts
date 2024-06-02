import './button.scss';
import BaseComponent from '../base/base.component';

type ButtonSize = 'small';

type ButtonStyle = 'positive' | 'negative' | 'navigation';

type ButtonType = 'button' | 'submit';

type ButtonConfig = {
  text?: string;
  onClick?: (event: Event) => void;
  disabled?: boolean;
  size?: ButtonSize;
  style?: ButtonStyle;
  type?: ButtonType;
};

export default class Button extends BaseComponent<'button'> {
  constructor(config: ButtonConfig) {
    const { text } = config;
    super({ tag: 'button', classes: ['button'], textContent: text });
    this.setupButton(config);
  }

  public disable(): void {
    this.getElement().setAttribute('disabled', '');
  }

  public enable(): void {
    this.getElement().removeAttribute('disabled');
  }

  public show(): void {
    this.removeClass('hidden');
  }

  public hide(): void {
    this.addClass('hidden');
  }

  private setupButton(config: ButtonConfig): void {
    const { onClick, disabled, size, style, type } = config;
    if (onClick) {
      this.addListener('click', onClick);
    }
    if (disabled) {
      this.disable();
    }
    if (size) {
      this.addClass(`button--${size}`);
    }
    if (style) {
      this.addClass(`button--${style}`);
    }
    if (type) {
      this.setAttribute('type', type);
    }
  }
}
