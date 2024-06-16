import { LineItem } from '../../models/cart/cart.model';
import CartService from '../../services/cart.service';
import RouterService from '../../services/router/router.service';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './basket.scss';

export default class BasketComponent extends BaseComponent<'div'> {
  private cartService: CartService = new CartService();

  constructor(private router: RouterService) {
    super({ tag: 'div', classes: ['basket'] });
    this.render();
  }

  private async getBasktetItems(): Promise<BaseComponent<'div'>[]> {
    const customerCart = await this.cartService.getActiveCustomerCart();
    if ('id' in customerCart) {
      return customerCart.lineItems.map((lineItem) => {
        return BasketComponent.makeBasketItem(lineItem);
      });
    }
    return [];
  }

  private async render(): Promise<void> {
    const basketHeader = new BaseComponent({ tag: 'h2', textContent: 'Shopping cart' });
    this.append([basketHeader]);
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

  private static makeBasketItem(lineItem: LineItem): BaseComponent<'div'> {
    const { price, totalPrice, images, quantity, name } = lineItem;
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
      tag: 'p',
      textContent: `Quantity: ${quantity}`,
      classes: ['basket-item_quantity'],
    });
    const basketItemTotalPrice = new BaseComponent({
      tag: 'p',
      textContent: `Total price: ${priceFormat.format(totalPrice.discountedCentAmount || totalPrice.centAmount / 100)}`,
      classes: ['basket-item_total-price'],
    });
    basketItemPrice.append([basketItemSinglePrice, basketItemTotalPrice]);
    basketItemInfo.append([basketItemName, basketItemQuantity, basketItemPrice]);
    basketItem.append([basketItemImage, basketItemInfo]);
    return basketItem;
  }
}
