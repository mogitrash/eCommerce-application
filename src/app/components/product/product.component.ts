import './product.scss';
import BaseComponent from '../base/base.component';

export default class ProductComponent extends BaseComponent<'div'> {
  constructor() {
    super({ tag: 'div', textContent: 'Product' });
  }
}
