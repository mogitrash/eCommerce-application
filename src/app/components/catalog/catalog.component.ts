import './catalog.scss';
import BaseComponent from '../base/base.component';
import ProductService from '../../services/product.service';
import { Product } from '../../models/product/product.model';

export default class CatalogComponent extends BaseComponent<'div'> {
  private productService = new ProductService();

  constructor() {
    super({ tag: 'div', classes: ['catalog'] });
    this.viewAllProd();
  }

  private viewAllProd() {
    this.productService.getAllPublishedProducts({ limit: 40 }).then((res) => {
      res.results.forEach((product: Product) => {
        this.makeCard(product);
      });
    });
  }

  private static convertPrice(cent: number) {
    return `${Math.floor(cent / 100)}.${cent % 100}`;
  }

  private makeCard(product: Product) {
    const discount = product.prices[0].discountedCentAmount;
    const price = product.prices[0].centAmount;
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
    const code = new BaseComponent({
      tag: 'div',
      classes: ['code'],
      textContent: `${product.prices[0].currencyCode}`,
    });
    if (discount) {
      const oldPrice = new BaseComponent({
        tag: 'div',
        classes: ['old'],
        textContent: `${CatalogComponent.convertPrice(price)}`,
      });
      const discountPrice = new BaseComponent({
        tag: 'div',
        classes: ['discount'],
        textContent: `${CatalogComponent.convertPrice(discount)}`,
      });
      cardPrice.append([oldPrice, discountPrice, code]);
    } else {
      const currentPrice = new BaseComponent({
        tag: 'div',
        classes: ['price'],
        textContent: `${CatalogComponent.convertPrice(price)}`,
      });
      cardPrice.append([currentPrice, code]);
    }
    cardWrapper.append([imgWrapper, cardName, cardDescription, cardPrice]);
    this.append([cardWrapper]);
  }
}
