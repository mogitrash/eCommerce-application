import './catalog.scss';
import BaseComponent from '../base/base.component';
import { Product } from '../../models/product/product.model';
import RouterService from '../../services/router/router.service';
import ControlPanelComponent from '../control-panel/control-panel.component';
import CardMaker from '../../models/card-maker';
import NotFoundGif from '../../assets/images/not-found.gif';
import Button from '../button/button.component';
import CartService from '../../services/cart.service';
import NotificationService from '../../services/notification.service';

export default class CatalogComponent extends BaseComponent<'div'> implements CardMaker {
  private cartService: CartService = new CartService();

  private notificationService = new NotificationService();

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

  makeCard(product: Product, isProductInTheCart: boolean) {
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
    const cardControlsWrapper = new BaseComponent({
      tag: 'div',
      classes: ['card_controls-wrapper'],
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
    let removeFromCart: Button;
    const addToCart = new Button({
      text: isProductInTheCart ? 'In the cart' : 'Add to cart',
      size: 'small',
      disabled: isProductInTheCart,
      onClick: (event: Event) => {
        event.stopPropagation();
        this.handleAddToCart(product.id, removeFromCart, addToCart);
      },
    });
    removeFromCart = new Button({
      text: 'Remove from cart',
      size: 'small',
      style: 'negative',
      onClick: (event: Event) => {
        event.stopPropagation();
        this.handleRemoveFromCart(product.id, removeFromCart, addToCart);
      },
    });
    if (!isProductInTheCart) {
      removeFromCart.hide();
    }
    cardControlsWrapper.append([cardPrice, addToCart, removeFromCart]);
    cardWrapper.append([imgWrapper, cardName, cardDescription, cardControlsWrapper]);
    this.content.append([cardWrapper]);
  }

  private async handleAddToCart(
    id: string,
    removeButton: Button,
    addButton: Button,
  ): Promise<void> {
    addButton.disable();
    addButton.setTextContent('In the cart');
    this.notificationService.notify('Adding product to the cart...');
    const addToCartResponse = await this.cartService.addCartItems([{ productId: id }]);
    if ('errors' in addToCartResponse) {
      addButton.enable();
      addButton.setTextContent('Add to cart');
      this.notificationService.notify('Product has not been added', 'error');
    } else {
      this.notificationService.notify('Product has been added!', 'success');
      removeButton.show();
    }
  }

  private async handleRemoveFromCart(
    id: string,
    removeButton: Button,
    addButton: Button,
  ): Promise<void> {
    removeButton.hide();
    this.notificationService.notify('Removing product from the cart...');
    const removeFromCartResponse = await this.cartService.removeLineItem(id);
    if ('errors' in removeFromCartResponse) {
      removeButton.show();
      this.notificationService.notify('Product has not been removed', 'error');
    } else {
      addButton.enable();
      this.notificationService.notify('Product has been removed!', 'success');
    }
  }
}
