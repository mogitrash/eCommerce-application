import './product.scss';
import BaseComponent from '../base/base.component';
import { Product, ProductImage, ProductPrice } from '../../models/product/product.model';
import SwiperComponent from '../swiper/swiper.components';
import Button from '../button/button.component';
import CartService from '../../services/cart.service';
import NotificationService from '../../services/notification.service';

export default class ProductComponent extends BaseComponent<'div'> {
  private cartService: CartService = new CartService();

  private notificationService = new NotificationService();

  private images: ProductImage[];

  private productCard: BaseComponent<'div'>;

  private productCardInfo: BaseComponent<'div'>;

  private productCardSlider: BaseComponent<'div'>;

  private productCardInfoName: BaseComponent<'div'>;

  private productCardInfoDescription: BaseComponent<'div'>;

  private productCardDetails: BaseComponent<'div'>;

  private productCardInfoPrice!: BaseComponent<'div'>;

  private productAddToCart!: Button;

  private productRemoveFromCart!: Button;

  constructor(
    { name, description, attributes, images, prices, id }: Product,
    isProductInTheCart: boolean,
  ) {
    super({
      tag: 'div',
      classes: ['product'],
    });

    this.images = images;

    this.productCard = new BaseComponent({ tag: 'div', classes: ['product-card'] });
    this.productCardSlider = new SwiperComponent(images);

    this.productCardInfo = new BaseComponent({ tag: 'div', classes: ['product-card_info'] });

    this.productCardInfoName = new BaseComponent({
      tag: 'div',
      classes: ['product-card_info-name'],
      textContent: name,
    });

    this.productCardInfoDescription = new BaseComponent({
      tag: 'div',
      classes: ['product-card_info-description'],
      textContent: description,
    });

    this.createPricesComponent(prices[0]);

    this.productCardDetails = new BaseComponent({
      tag: 'div',
      classes: ['product-card_info-details'],
    });

    this.productCardDetails.append(
      attributes.map((attribute) => {
        const attributeWrapper = new BaseComponent({
          tag: 'div',
          classes: ['product-card_info-details_item'],
        });

        const attributeName = new BaseComponent({
          tag: 'span',
          classes: ['bold'],
          textContent: `${attribute.name}: `,
        });

        const value = new BaseComponent({
          tag: 'span',
          textContent: attribute.label,
        });

        attributeWrapper.append([attributeName, value]);

        return attributeWrapper;
      }),
    );
    this.productAddToCart = new Button({
      text: isProductInTheCart ? 'In the cart' : 'Add to cart',
      disabled: isProductInTheCart,
      onClick: () => this.handleAddToCart(id),
    });
    this.productRemoveFromCart = new Button({
      text: 'Remove from cart',
      style: 'negative',
      onClick: () => {
        this.handleRemoveFromCart(id);
      },
    });
    if (!isProductInTheCart) {
      this.productRemoveFromCart.hide();
    }
    this.setListeners();
    this.render();
  }

  private createPricesComponent({ centAmount, discountedCentAmount, currencyCode }: ProductPrice) {
    const priceFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    });

    const mainPrice = priceFormat.format(centAmount / 100);

    const mainPriceComponent = new BaseComponent({
      tag: 'div',
      textContent: mainPrice,
      classes: ['product-price'],
    });

    this.productCardInfoPrice = new BaseComponent({
      tag: 'div',
      classes: ['product-price_wrapper'],
    }).append([mainPriceComponent]);

    if (discountedCentAmount) {
      const discountedPrice = priceFormat.format(discountedCentAmount / 100);

      const discountedPriceComponent = new BaseComponent({
        tag: 'div',
        textContent: discountedPrice,
        classes: ['product-price'],
      });

      mainPriceComponent.addClass('product-price__old');

      this.productCardInfoPrice.append([discountedPriceComponent]);
    }
  }

  private render() {
    this.productCardInfo.append([
      this.productCardInfoName,
      this.productCardInfoDescription,
      this.productCardInfoPrice,
      this.productCardDetails,
      this.productAddToCart,
      this.productRemoveFromCart,
    ]);

    this.productCard.append([this.productCardSlider, this.productCardInfo]);

    this.append([this.productCard]);
  }

  private async handleAddToCart(id: string): Promise<void> {
    this.productAddToCart.disable();
    this.productAddToCart.setTextContent('In the cart');
    this.notificationService.notify('Adding product to the cart...');
    const addToCartResponse = await this.cartService.addCartItems([{ productId: id }]);
    if ('errors' in addToCartResponse) {
      this.productAddToCart.enable();
      this.productAddToCart.setTextContent('Add to cart');
      this.notificationService.notify('Product has not been added', 'error');
    } else {
      this.notificationService.notify('Product has been added!', 'success');
      this.productRemoveFromCart.show();
    }
  }

  private async handleRemoveFromCart(id: string): Promise<void> {
    this.productRemoveFromCart.hide();
    this.notificationService.notify('Removing product from the cart...');
    const removeFromCartResponse = await this.cartService.removeLineItem(id);
    if ('errors' in removeFromCartResponse) {
      this.productRemoveFromCart.show();
      this.notificationService.notify('Product has not been removed', 'error');
    } else {
      this.productAddToCart.setTextContent('Add to cart');
      this.productAddToCart.enable();
      this.notificationService.notify('Product has been removed!', 'success');
    }
  }

  private setListeners() {
    this.productCardSlider.addListener('click', () => {
      this.zoomInSlider(this.images);
    });
  }

  private zoomInSlider(images: ProductImage[]) {
    const zoomedSliderComponent = new SwiperComponent(images, ['slider__zoomed'], true);
    const overlay = new BaseComponent({ tag: 'div', classes: ['overlay'] });
    const closeIcon = new BaseComponent({ tag: 'div', textContent: '✕', classes: ['close-icon'] });

    closeIcon.addListener('click', () => {
      zoomedSliderComponent.getElement().remove();
      overlay.getElement().remove();
    });

    overlay.append([closeIcon]);
    this.append([overlay, zoomedSliderComponent]);
  }
}
