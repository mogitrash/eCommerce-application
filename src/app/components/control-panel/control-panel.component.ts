import CardMaker from '../../models/card-maker';
import BaseComponent from '../base/base.component';
import NUMBER_OF_CARDS from '../../models/constants/catalog.constants';
import ProductService from '../../services/product.service';
import {
  GetAllPublishedProductsRequest,
  Product,
  ProductSort,
} from '../../models/product/product.model';

export default class ControlPanelComponent extends BaseComponent<'div'> {
  private productService = new ProductService();

  private reqestObject: GetAllPublishedProductsRequest = {};

  private limit = NUMBER_OF_CARDS;

  private sort: ProductSort = 'nameAsc';

  private text: string | null = null;

  constructor(private catalog: CardMaker) {
    super({ tag: 'div', classes: ['control_panel'] });
    this.makeSearchAndSort();
    this.makeFilter();
    this.makeCategory();
    this.viewAllProd();
  }

  private viewAllProd() {
    this.reqestObject.filter = [
      ProductService.generateBrandFilterQuery(['ancol', 'catit']),
      // ProductService.generateBrandFilterQuery('catit'),
      // ProductService.generateBrandFilterQuery('danishDesign'),
      ProductService.generateColorFilterQuery(['blue', 'black', 'multicolor']),
      // ProductService.generateColorFilterQuery('black'),
      // ProductService.generatePriceFilterQuery(0, 10000),
    ];
    this.productService.getAllProductsAttributes().then((res) => console.log(res));
    this.makeReqestObject();
    this.productService.getAllPublishedProducts(this.reqestObject).then((res) => {
      this.catalog.clearAll();
      if ('results' in res) {
        if (res.results.length === 0) {
          this.catalog.makeEmptyCard();
        } else {
          res.results.forEach((product: Product) => {
            this.catalog.makeCard(product);
          });
        }
      } else {
        this.catalog.makeEmptyCard();
      }
    });
  }

  private makeCategory() {
    const category = new BaseComponent({ tag: 'div', classes: ['category'] });
    this.append([category]);
  }

  private makeFilter() {
    const filter = new BaseComponent({ tag: 'div', classes: ['filter'] });
    const brand = new BaseComponent({ tag: 'div', classes: ['brand'], textContent: 'brand' });
    const color = new BaseComponent({ tag: 'div', classes: ['color'], textContent: 'color' });
    const price = new BaseComponent({ tag: 'div', classes: ['price'], textContent: 'price' });
    filter.append([brand, color, price]);
    this.append([filter]);
  }

  private makeSearchAndSort() {
    const searchAndSort = new BaseComponent({ tag: 'div', classes: ['search_and_sort'] });
    const sortSelect = new BaseComponent({ tag: 'select', classes: ['sort'] });
    sortSelect.append([
      ControlPanelComponent.makeOption('sort by alphabetically ascending', 'nameAsc'),
      ControlPanelComponent.makeOption('sort by alphabetically descending', 'nameDesc'),
      ControlPanelComponent.makeOption('sort by price ascending', 'priceAsc'),
      ControlPanelComponent.makeOption('sort by price descending', 'priceDesc'),
    ]);
    sortSelect.addListener('change', () => {
      this.sort = sortSelect.getElement().value as ProductSort;
      this.viewAllProd();
    });
    const form = new BaseComponent({ tag: 'form', classes: ['control_form'] });
    const input = new BaseComponent({ tag: 'input', classes: ['control_form_input'] });
    const button = new BaseComponent({
      tag: 'button',
      classes: ['control_form_button'],
      textContent: 'search',
    });
    form.addListener('submit', (e: Event) => {
      e.preventDefault();
      this.text = input.getElement().value;
      this.viewAllProd();
    });
    form.append([input, button]);
    searchAndSort.append([form, sortSelect]);
    this.append([searchAndSort]);
  }

  private makeReqestObject() {
    this.reqestObject.limit = this.limit;
    this.reqestObject.sort = this.sort;
    if (this.text) {
      this.reqestObject.text = this.text;
    } else {
      delete this.reqestObject.text;
    }
  }

  private static makeOption(text: string, value: ProductSort) {
    const option = new BaseComponent({ tag: 'option', textContent: text, classes: ['option'] });
    option.setAttribute('value', value);
    return option;
  }
}
