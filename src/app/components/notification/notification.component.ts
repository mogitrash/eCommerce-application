import BaseComponent from '../base/base.component';
import './notification.scss';

export default class NotificationComponent extends BaseComponent<'div'> {
  constructor() {
    super({
      tag: 'div',
      classes: ['notification'],
    });
  }

  render(root: HTMLElement, text: string) {
    this.element.textContent = text;
    root.append(this.element);
  }
}
