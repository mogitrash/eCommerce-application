import BaseComponent from '../base/base.component';
import './notification.scss';

export default class NotificationComponent extends BaseComponent<'div'> {
  constructor() {
    super({
      tag: 'div',
      classes: ['notification'],
    });
  }

  render(root: HTMLElement, text: string, style?: 'success' | 'error') {
    this.element.textContent = text;
    if (style) {
      this.element.className = `notification notification--${style}`;
    } else {
      this.element.className = 'notification';
    }
    root.append(this.element);
  }
}
