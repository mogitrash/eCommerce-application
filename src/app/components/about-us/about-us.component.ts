import BaseComponent from '../base/base.component';
import './about-us.scss';

export default class AboutUsComponent extends BaseComponent<'div'> {
  constructor() {
    super({ tag: 'div', classes: ['about-us'], textContent: 'this is about-us page' });
  }
}
