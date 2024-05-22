import './catalog.scss';
import BaseComponent from '../base/base.component';

export default class CatalogComponent extends BaseComponent<'div'> {
  constructor() {
    super({ tag: 'div', textContent: 'Catalog' });
  }
}
