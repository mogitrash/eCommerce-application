import Swiper from 'swiper/bundle';
import { SwiperOptions } from 'swiper/types';

import 'swiper/css/bundle';
import BaseComponent from '../base/base.component';
import './swiper.scss';
import { ProductImage } from '../../models/product/product.model';

export default class SwiperComponent extends BaseComponent<'div'> {
  private swiperWrapper = new BaseComponent({ tag: 'div', classes: ['swiper-wrapper'] });

  private swiperConfig: SwiperOptions;

  constructor(images: ProductImage[], classes: string[] = [], navigation?: boolean) {
    super({ tag: 'div', classes: ['swiper', ...classes] });

    this.swiperConfig = {
      autoplay: { delay: 2500 },
      centeredSlides: true,
      spaceBetween: 30,
    };

    const slides = images.map(({ url, label }) => {
      const slide = new BaseComponent({
        tag: 'div',
        classes: ['swiper-slide'],
      });

      slide.append([
        new BaseComponent({ tag: 'img', classes: ['swiper-slide_image'] })
          .setAttribute('src', url)
          .setAttribute('alt', label)
          .setAttribute('loading', 'lazy'),
      ]);

      return slide;
    });

    this.swiperWrapper.append(slides);
    this.append([this.swiperWrapper]);

    if (navigation) {
      const buttonNext = new BaseComponent({ tag: 'div', classes: ['swiper-button-next'] });
      const buttonPrev = new BaseComponent({ tag: 'div', classes: ['swiper-button-prev'] });

      this.swiperConfig.navigation = {
        nextEl: buttonNext.getElement(),
        prevEl: buttonPrev.getElement(),
      };

      this.append([buttonNext, buttonPrev]);
    }

    const swiper = new Swiper(this.getElement(), this.swiperConfig);

    swiper.autoplay.start();
  }
}
