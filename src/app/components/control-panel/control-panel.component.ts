import './control-panel.scss';
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

  private filterWrapper = new BaseComponent({ tag: 'div', classes: ['filter_wrapper'] });

  private limit = NUMBER_OF_CARDS;

  private sort: ProductSort = 'nameAsc';

  private text: string | null = null;

  private filterBrand: string[] = [];

  private filterColor: string[] = [];

  private checkboxBrand: BaseComponent<'input'>[] = [];

  private checkboxColor: BaseComponent<'input'>[] = [];

  private priceFrom: number = 0;

  private priceTo: number | null = null;

  private currentPage: number = 1;

  private prevButton!: BaseComponent<'button'>;

  private nextButton!: BaseComponent<'button'>;

  private pageDisplay!: BaseComponent<'div'>;

  constructor(private catalog: CardMaker) {
    super({ tag: 'div', classes: ['control_panel'] });
    this.makeSearchAndSort();
    this.append([this.filterWrapper]);
    this.makeFilter();
    this.makePagination();
    this.viewAllProd();
  }

  private viewAllProd() {
    this.makeReqestObject();
    this.productService.getAllPublishedProducts(this.reqestObject).then((res) => {
      this.catalog.clearAll();
      if ('results' in res) {
        if (res.results.length === 0) {
          this.prevButton.setAttribute('disabled', 'disabled');
          this.nextButton.setAttribute('disabled', 'disabled');
          this.catalog.makeEmptyCard();
        } else {
          if (res.total <= this.currentPage * this.limit) {
            this.nextButton.setAttribute('disabled', 'disabled');
          } else {
            this.nextButton.removeAttribute('disabled');
          }
          if (this.currentPage === 1) {
            this.prevButton.setAttribute('disabled', 'disabled');
          } else {
            this.prevButton.removeAttribute('disabled');
          }
          res.results.forEach((product: Product) => {
            this.catalog.makeCard(product);
          });
        }
      } else {
        this.prevButton.setAttribute('disabled', 'disabled');
        this.nextButton.setAttribute('disabled', 'disabled');
        this.catalog.makeEmptyCard();
      }
    });
  }

  private makePagination() {
    const paginator = new BaseComponent({ tag: 'div', classes: ['paginator'] });
    this.prevButton = new BaseComponent({
      tag: 'button',
      classes: ['button', 'previous'],
      textContent: 'previous',
    });
    this.prevButton.setAttribute('disabled', 'disabled');
    this.prevButton.addListener('click', () => {
      this.currentPage -= 1;
      this.pageDisplay.setTextContent(`${this.currentPage}`);
      this.viewAllProd();
    });
    this.pageDisplay = new BaseComponent({ tag: 'div', classes: ['current'], textContent: '1' });
    this.nextButton = new BaseComponent({
      tag: 'button',
      classes: ['button', 'next'],
      textContent: 'next',
    });
    this.nextButton.addListener('click', () => {
      this.currentPage += 1;
      this.pageDisplay.setTextContent(`${this.currentPage}`);
      this.viewAllProd();
    });
    paginator.append([this.prevButton, this.pageDisplay, this.nextButton]);
    this.append([paginator]);
  }

  private resetPaginator() {
    this.currentPage = 1;
    this.pageDisplay.setTextContent(`${this.currentPage}`);
    this.prevButton.setAttribute('disabled', 'disabled');
    this.nextButton.removeAttribute('disabled');
  }

  private makeFilter() {
    this.filterWrapper.getElement().innerHTML = '';
    const filter = new BaseComponent({ tag: 'form', classes: ['filter'] });
    const brand = new BaseComponent({ tag: 'div', classes: ['brand'], textContent: 'Brand:    ' });
    this.checkboxBrand = [];
    const brandsArray = [
      this.makeChekbox('ancol', 'Ancol', 'brand'),
      this.makeChekbox('bonio', 'Bonio', 'brand'),
      this.makeChekbox('catit', 'Catit', 'brand'),
      this.makeChekbox('catMate', 'Cat Mate', 'brand'),
      this.makeChekbox('classic', 'Classic', 'brand'),
      this.makeChekbox('danishDesign', 'Danish Design', 'brand'),
      this.makeChekbox('goodBoy', 'Good Boy', 'brand'),
      this.makeChekbox('kong', 'KONG', 'brand'),
      this.makeChekbox('kingdom', 'Kingdom', 'brand'),
      this.makeChekbox('masonCash', 'Mason Cash', 'brand'),
      this.makeChekbox('petsafe', 'Petsafe', 'brand'),
    ];
    brand.append(brandsArray);
    const color = new BaseComponent({ tag: 'div', classes: ['color'], textContent: 'Color:    ' });
    this.checkboxColor = [];
    const colorsArray = [
      this.makeChekbox('beige', 'Beige', 'color'),
      this.makeChekbox('black', 'Black', 'color'),
      this.makeChekbox('blue', 'Blue', 'color'),
      this.makeChekbox('brown', 'Brown', 'color'),
      this.makeChekbox('gray', 'Gray', 'color'),
      this.makeChekbox('green', 'Green', 'color'),
      this.makeChekbox('multicolor', 'Multicolor', 'color'),
      this.makeChekbox('orange', 'Orange', 'color'),
      this.makeChekbox('pink', 'Pink', 'color'),
      this.makeChekbox('red', 'Red', 'color'),
      this.makeChekbox('white', 'White', 'color'),
    ];
    color.append(colorsArray);
    const price = new BaseComponent({ tag: 'div', classes: ['price'] });
    const textFrom = new BaseComponent({
      tag: 'div',
      classes: ['price'],
      textContent: 'Price from:',
    });
    const from = new BaseComponent({ tag: 'input', classes: ['filter_input'] });
    from.setAttribute('placeholder', 'value in cent');
    const textTo = new BaseComponent({ tag: 'div', classes: ['price'], textContent: 'Price to:' });
    const to = new BaseComponent({ tag: 'input', classes: ['filter_input'] });
    to.setAttribute('placeholder', 'value in cent');
    price.append([textFrom, from, textTo, to]);
    const buttonWrapper = new BaseComponent({
      tag: 'div',
      classes: ['button_wrapper'],
    });
    const apply = new BaseComponent({
      tag: 'button',
      classes: ['button'],
      textContent: 'apply',
    });
    apply.addListener('click', (e: Event) => {
      e.preventDefault();
      this.filterBrand = [];
      this.filterColor = [];
      this.checkboxBrand.forEach((el) => {
        if (el.getElement().checked) {
          this.filterBrand.push(el.getElement().value);
        }
      });
      this.checkboxColor.forEach((el) => {
        if (el.getElement().checked) {
          this.filterColor.push(el.getElement().value);
        }
      });
      const fromNumber = Number(from.getElement().value);
      const toNumber = Number(to.getElement().value);
      if (Number.isNaN(fromNumber)) {
        this.priceFrom = 0;
      } else {
        this.priceFrom = fromNumber;
      }
      if (Number.isNaN(toNumber)) {
        this.priceTo = null;
      } else {
        this.priceTo = toNumber;
      }
      this.resetPaginator();
      this.viewAllProd();
    });
    filter.addListener('submit', (e: Event) => {
      e.preventDefault();
    });
    const reset = new BaseComponent({
      tag: 'button',
      classes: ['button'],
      textContent: 'reset',
    });
    reset.addListener('click', (e: Event) => {
      e.preventDefault();
      this.filterBrand = [];
      this.filterColor = [];
      this.priceFrom = 0;
      this.priceTo = 0;
      this.resetPaginator();
      this.viewAllProd();
      this.makeFilter();
    });
    buttonWrapper.append([apply, reset]);
    filter.append([brand, color, price, buttonWrapper]);
    this.filterWrapper.append([filter]);
  }

  private makeChekbox(value: string, text: string, type: string) {
    const label = new BaseComponent({ tag: 'label', classes: ['label'], textContent: text });
    const input = new BaseComponent({ tag: 'input', classes: ['label'] });
    input.setAttribute('type', 'checkbox');
    input.setAttribute('value', value);
    label.append([input]);
    if (type === 'brand') {
      this.checkboxBrand.push(input);
    } else {
      this.checkboxColor.push(input);
    }
    return label;
  }

  private makeSearchAndSort() {
    const searchAndSort = new BaseComponent({ tag: 'div', classes: ['search-sort'] });
    const sortSelect = new BaseComponent({ tag: 'select', classes: ['sort'] });
    sortSelect.append([
      ControlPanelComponent.makeOption('sort by alphabetically ascending', 'nameAsc'),
      ControlPanelComponent.makeOption('sort by alphabetically descending', 'nameDesc'),
      ControlPanelComponent.makeOption('sort by price ascending', 'priceAsc'),
      ControlPanelComponent.makeOption('sort by price descending', 'priceDesc'),
    ]);
    sortSelect.addListener('change', () => {
      this.sort = sortSelect.getElement().value as ProductSort;
      this.resetPaginator();
      this.viewAllProd();
    });
    const form = new BaseComponent({ tag: 'form', classes: ['search-form'] });
    const input = new BaseComponent({ tag: 'input', classes: ['search-form_input'] });
    const button = new BaseComponent({
      tag: 'button',
      classes: ['button'],
      textContent: 'Search',
    });
    form.addListener('submit', (e: Event) => {
      e.preventDefault();
      this.text = input.getElement().value;
      this.resetPaginator();
      this.viewAllProd();
    });
    form.append([input, button]);
    searchAndSort.append([form, sortSelect]);
    this.append([searchAndSort]);
  }

  private makeReqestObject() {
    this.reqestObject.limit = this.limit;
    this.reqestObject.sort = this.sort;
    this.reqestObject.offset = (this.currentPage - 1) * this.limit;
    if (this.text) {
      this.reqestObject.text = this.text;
    } else {
      delete this.reqestObject.text;
    }
    const filter = [];
    if (this.filterBrand.length) {
      filter.push(ProductService.generateBrandFilterQuery(this.filterBrand));
    }
    if (this.filterColor.length) {
      filter.push(ProductService.generateColorFilterQuery(this.filterColor));
    }
    if (this.priceTo) {
      filter.push(ProductService.generatePriceFilterQuery(this.priceFrom, this.priceTo));
    } else {
      filter.push(ProductService.generatePriceFilterQuery(this.priceFrom));
    }
    if (filter.length) {
      this.reqestObject.filter = filter;
    } else {
      delete this.reqestObject.filter;
    }
  }

  private static makeOption(text: string, value: ProductSort) {
    const option = new BaseComponent({ tag: 'option', textContent: text, classes: ['option'] });
    option.setAttribute('value', value);
    return option;
  }
}
