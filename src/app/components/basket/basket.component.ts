import { LineItem, LineItemPrice } from '../../models/cart/cart.model';
import CartService from '../../services/cart.service';
import NotificationService from '../../services/notification.service';
import RouterService from '../../services/router/router.service';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './basket.scss';

export default class BasketComponent extends BaseComponent<'div'> {
  private cartService: CartService = new CartService();

  private notificationService = new NotificationService();

  private cartPrice!: BaseComponent<'p'>;

  private cartCalcPrice!: BaseComponent<'p'>;

  private calcPrice: number = 0;

  private totalPrice: number = 0;

  constructor(private router: RouterService) {
    super({ tag: 'div', classes: ['basket'] });
    this.render();
  }

  private async getBasktetItems(): Promise<BaseComponent<'div'>[]> {
    const customerCart = await this.cartService.getActiveCustomerCart();
    if ('id' in customerCart) {
      this.totalPrice = customerCart.totalPrice.centAmount;
      return customerCart.lineItems.map((lineItem) => {
        return this.makeBasketItem(lineItem);
      });
    }
    return [];
  }

  private changeTotalPrice() {
    const priceFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    });
    this.cartPrice.setTextContent(
      `Total promo cart price: ${priceFormat.format(this.totalPrice / 100)}`,
    );
    this.cartCalcPrice.setTextContent(
      `Total cart price: ${priceFormat.format(this.calcPrice / 100)}`,
    );
    if (this.calcPrice > this.totalPrice) {
      this.cartCalcPrice.addClass('crossed');
    } else {
      this.cartPrice.addClass('hidden');
    }
  }

  private async render(): Promise<void> {
    this.getElement().innerHTML = '';
    this.calcPrice = 0;
    this.totalPrice = 0;
    const basketHeader = new BaseComponent({ tag: 'h2', textContent: 'Shopping cart' });
    const promoForm = new BaseComponent({ tag: 'form', classes: ['promo'] });
    const input = new BaseComponent({ tag: 'input', classes: ['promo_input'] });
    input.setAttribute('placeholder', 'Enter promo code here');
    const button = new Button({ text: 'Apply', size: 'small', type: 'submit' });
    promoForm.append([input, button]);
    promoForm.addListener('submit', async (e: Event) => {
      e.preventDefault();
      const promo = input.getElement().value;
      const response = await this.cartService.applyDiscountCodeToActiveCustomerCart(promo);
      if ('message' in response) {
        this.notificationService.notify('Invalid promo code', 'error');
      } else {
        this.notificationService.notify('Promo code applied', 'success');
        this.render();
      }
    });
    const clearButton = new Button({
      text: 'Clear Shopping Cart',
      onClick: async () => {
        await this.cartService.clearActiveCustomerCart();
        this.render();
      },
    });
    this.cartCalcPrice = new BaseComponent({
      tag: 'p',
      textContent: 'Total cart price:',
      classes: ['basket_total-price'],
    });
    this.cartPrice = new BaseComponent({
      tag: 'p',
      textContent: 'Total promo cart price:',
      classes: ['basket_total-price'],
    });
    this.append([basketHeader, promoForm, clearButton, this.cartCalcPrice, this.cartPrice]);
    const basketItems = await this.getBasktetItems();
    if (basketItems.length) {
      this.append(basketItems);
    } else {
      this.showEmpyBasket();
    }
    this.changeTotalPrice();
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
        (price.discountedCentAmount || price.centAmount) / 100,
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
    const calcPrice = (price.discountedCentAmount || price.centAmount) * quantity;
    this.calcPrice += calcPrice;
    const basketItemCalcPrice = new BaseComponent({
      tag: 'p',
      textContent: `Total price: ${priceFormat.format(calcPrice / 100)}`,
      classes: ['basket-item_total-price'],
    });
    const basketItemTotalPrice = new BaseComponent({
      tag: 'p',
      textContent: `Total promo price: ${priceFormat.format(totalPrice.centAmount / 100)}`,
      classes: ['basket-item_total-price'],
    });
    const removeButton = new Button({
      text: 'Remove',
      onClick: async () => {
        await this.cartService.removeLineItem(productId);
        this.render();
      },
    });
    const isDiffer = BasketComponent.isPricesDiffer(price, totalPrice, quantity);
    if (isDiffer) {
      basketItemCalcPrice.addClass('crossed');
    } else {
      basketItemTotalPrice.addClass('hidden');
    }
    basketItemPrice.append([basketItemSinglePrice, basketItemCalcPrice]);
    basketItemInfo.append([
      basketItemName,
      basketItemQuantity,
      basketItemPrice,
      basketItemTotalPrice,
      removeButton,
    ]);
    basketItem.append([basketItemImage, basketItemInfo]);
    return basketItem;
  }

  private static isPricesDiffer(
    price: LineItemPrice,
    totalPrice: LineItemPrice,
    quantity: number,
  ): Boolean {
    const calculatedPrice = (price.discountedCentAmount || price.centAmount) * quantity;
    return calculatedPrice > totalPrice.centAmount;
  }
}
