import './catalog.scss';
import BaseComponent from '../base/base.component';
import ProductService from '../../services/product.service';
import { Product } from '../../models/product/product.model';
import numberOfCards from '../../models/constants/catalog.constants';

export default class CatalogComponent extends BaseComponent<'div'> {
  private productService = new ProductService();

  constructor() {
    super({ tag: 'div', classes: ['catalog'] });
    this.viewAllProd();
  }

  private viewAllProd() {
    this.productService.getAllPublishedProducts({ limit: numberOfCards }).then((res) => {
      res.results.forEach((product: Product) => {
        this.makeCard(product);
      });
    });
  }

  private makeCard(product: Product) {
    const discount = product.prices[0].discountedCentAmount;
    const price = product.prices[0].centAmount;
    const priceFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: product.prices[0].currencyCode,
    });
    const cardWrapper = new BaseComponent({ tag: 'div', classes: ['card_wrapper'] });
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
    this.append([cardWrapper]);
  }
}
