import BaseComponent from '../base/base.component';
import './basket.scss';

export default class BasketComponent extends BaseComponent<'div'> {
  constructor() {
    super({ tag: 'div', classes: ['basket'], textContent: 'this is basket page' });
  }
}
