import './catalog.scss';
import BaseComponent from '../base/base.component';
import { Product } from '../../models/product/product.model';
import RouterService from '../../services/router/router.service';
import ControlPanelComponent from '../control-panel/control-panel.component';
import CardMaker from '../../models/card-maker';
import NotFoundGif from '../../assets/images/not-found.gif';

export default class CatalogComponent extends BaseComponent<'div'> implements CardMaker {
  private controlPanel = new ControlPanelComponent(this);

  private content = new BaseComponent({ tag: 'div', classes: ['content'] });

  constructor(private routerService: RouterService) {
    super({ tag: 'div', classes: ['catalog'] });
    this.append([this.controlPanel]);
    this.append([this.content]);
  }

  clearAll() {
    this.content.getElement().innerHTML = '';
  }

  makeEmptyCard() {
    const cardWrapper = new BaseComponent({ tag: 'div', classes: ['card_wrapper'] });
    this.content.append([cardWrapper]);
    const imgWrapper = new BaseComponent({ tag: 'div', classes: ['img_wrapper'] });
    const cardIMG = new BaseComponent({ tag: 'img', classes: ['catalog_img'] });
    cardIMG.setAttribute('src', NotFoundGif);
    imgWrapper.append([cardIMG]);
    const cardDescription = new BaseComponent({
      tag: 'p',
      classes: ['card_description'],
      textContent: 'No products found, try changing filter settings',
    });
    cardWrapper.append([imgWrapper, cardDescription]);
  }

  makeCard(product: Product) {
    const discount = product.prices[0].discountedCentAmount;
    const price = product.prices[0].centAmount;
    const priceFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: product.prices[0].currencyCode,
    });
    const cardWrapper = new BaseComponent({ tag: 'div', classes: ['card_wrapper'] });
    cardWrapper.addListener('click', () => {
      this.routerService.navigate('/product', `?id=${product.id}`);
    });
    const imgWrapper = new BaseComponent({ tag: 'div', classes: ['img_wrapper'] });
    const cardIMG = new BaseComponent({ tag: 'img', classes: ['catalog_img'] });
    cardIMG.setAttribute('src', `${product.images[0].url}`);
    imgWrapper.append([cardIMG]);
    const cardName = new BaseComponent({
      tag: 'h2',
      classes: ['card_name'],
      textContent: `${product.name}`,
    });
    const cardDescription = new BaseComponent({
      tag: 'p',
      classes: ['card_description'],
      textContent: `${product.description}`,
    });
    const cardPrice = new BaseComponent({
      tag: 'div',
      classes: ['card_price'],
    });
    if (discount) {
      const oldPrice = new BaseComponent({
        tag: 'div',
        classes: ['old'],
        textContent: `${priceFormat.format(price / 100)}`,
      });
      const currentPrice = new BaseComponent({
        tag: 'div',
        classes: ['price'],
        textContent: `${priceFormat.format(discount / 100)}`,
      });
      cardPrice.append([oldPrice, currentPrice]);
    } else {
      const currentPrice = new BaseComponent({
        tag: 'div',
        classes: ['price'],
        textContent: `${priceFormat.format(price / 100)}`,
      });
      cardPrice.append([currentPrice]);
    }
    cardWrapper.append([imgWrapper, cardName, cardDescription, cardPrice]);
    this.content.append([cardWrapper]);
  }
}
