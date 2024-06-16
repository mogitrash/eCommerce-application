import { LineItem } from '../../models/cart/cart.model';
import CartService from '../../services/cart.service';
import RouterService from '../../services/router/router.service';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './basket.scss';

export default class BasketComponent extends BaseComponent<'div'> {
  private cartService: CartService = new CartService();

  private totalPrice!: BaseComponent<'p'>;

  constructor(private router: RouterService) {
    super({ tag: 'div', classes: ['basket'] });
    this.render();
  }

  private async getBasktetItems(): Promise<BaseComponent<'div'>[]> {
    const customerCart = await this.cartService.getActiveCustomerCart();
    if ('id' in customerCart) {
      this.changeTotalPrice(customerCart.totalPrice.centAmount);
      return customerCart.lineItems.map((lineItem) => {
        return this.makeBasketItem(lineItem);
      });
    }
    return [];
  }

  private changeTotalPrice(price: number) {
    const priceFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    });
    this.totalPrice.setTextContent(`Total price: ${priceFormat.format(price / 100)}`);
  }

  private async render(): Promise<void> {
    this.getElement().innerHTML = '';
    const basketHeader = new BaseComponent({ tag: 'h2', textContent: 'Shopping cart' });
    this.totalPrice = new BaseComponent({ tag: 'p', textContent: 'Total price:' });
    this.append([basketHeader, this.totalPrice]);
    const basketItems = await this.getBasktetItems();
    if (basketItems.length) {
      this.append(basketItems);
    } else {
      this.showEmpyBasket();
    }
  }

  private showEmpyBasket(): void {
    const emptyBasket = new BaseComponent({
      tag: 'div',
      classes: ['empty-basket'],
    });
    const emptyBasketDescription = new BaseComponent({
      tag: 'p',
      classes: ['empty-basket_description'],
      textContent: 'Your Paws & Tails Cart is empty',
    });
    const emptyBasketButton = new Button({
      text: 'Continue shopping',
      onClick: () => {
        this.router.navigate('/catalog');
      },
    });

    emptyBasket.append([emptyBasketDescription, emptyBasketButton]);

    this.append([emptyBasket]);
  }

  private makeBasketItem(lineItem: LineItem): BaseComponent<'div'> {
    const { price, totalPrice, images, quantity, name, productId } = lineItem;
    const priceFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode,
    });

    const basketItem = new BaseComponent({
      tag: 'div',
      classes: ['basket-item'],
    });
    const basketItemImage = new BaseComponent({ tag: 'img', classes: ['basket-item_image'] });
    basketItemImage.setAttribute('src', `${images[0].url}`);
    const basketItemInfo = new BaseComponent({
      tag: 'div',
      classes: ['basket-item_info'],
    });
    const basketItemName = new BaseComponent({
      tag: 'p',
      textContent: name,
      classes: ['basket-item_name'],
    });
    const basketItemPrice = new BaseComponent({
      tag: 'div',
      classes: ['basket-item_price'],
    });
    const basketItemSinglePrice = new BaseComponent({
      tag: 'p',
      textContent: `Price: ${priceFormat.format(
        price.discountedCentAmount || price.centAmount / 100,
      )}`,
      classes: ['basket-item_single-price'],
    });
    const basketItemQuantity = new BaseComponent({
      tag: 'div',
      textContent: `Quantity: ${quantity}`,
      classes: ['basket-item_quantity'],
    });
    const downButton = new Button({
      text: '-',
      disabled: quantity === 1,
      size: 'small',
      onClick: async () => {
        await this.cartService.removeLineItem(productId, 1);
        this.render();
      },
    });
    const upButton = new Button({
      text: '+',
      size: 'small',
      onClick: async () => {
        await this.cartService.addCartItems([{ productId, quantity: 1 }]);
        this.render();
      },
    });
    basketItemQuantity.append([downButton, upButton]);
    const basketItemTotalPrice = new BaseComponent({
      tag: 'p',
      textContent: `Total price: ${priceFormat.format(totalPrice.discountedCentAmount || totalPrice.centAmount / 100)}`,
      classes: ['basket-item_total-price'],
    });
    const removeButton = new Button({
      text: 'Remove',
      onClick: async () => {
        await this.cartService.removeLineItem(productId);
        this.render();
      },
    });
    basketItemPrice.append([basketItemSinglePrice, basketItemTotalPrice]);
    basketItemInfo.append([basketItemName, basketItemQuantity, basketItemPrice, removeButton]);
    basketItem.append([basketItemImage, basketItemInfo]);
    return basketItem;
  }
}
