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
    const basketItem = new BaseComponent({ tag: 'div', textContent: lineItem.name });
    return basketItem;
  }
}
