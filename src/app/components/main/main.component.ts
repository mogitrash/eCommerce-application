import RouterService from '../../services/router/router.service';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import HeroImage from '../../assets/images/pets.png';
import './main.scss';

export default class MainComponent extends BaseComponent<'section'> {
  constructor(private router: RouterService) {
    super({ tag: 'section', classes: ['hero'] });
    this.createHeroContent();
  }

  private createHeroContent() {
    const heroDescription = new BaseComponent({
      tag: 'h2',
      classes: ['hero_description'],
      textContent: 'Welcome to Paws & Tails, your premier source for top-quality pet supplies!',
    });
    const heroInfo = new BaseComponent({
      tag: 'div',
      classes: ['hero_info'],
    });
    const heroHint = new BaseComponent({
      tag: 'p',
      classes: ['hero_hint'],
      textContent:
        'We offer a vast selection of products to meet the needs of all pet owners, including nutritious food, fun toys, cozy bedding and stylish accessories. Shop with us for all your pet goods needs!',
    });
    const promoHint = new BaseComponent({
      tag: 'p',
      classes: ['hero_hint', 'promo'],
      textContent: 'To receive a 10% discount on all products, use code: SAVE10',
    });
    const heroImage = new BaseComponent({
      tag: 'img',
      classes: ['hero_image'],
    });
    const catalogButton = new Button({
      text: 'Shop now',
      style: 'info',
      size: 'large',
      onClick: () => {
        this.router.navigate('/catalog');
      },
    });
    heroImage.setAttribute('src', HeroImage);
    heroInfo.append([heroHint, promoHint, catalogButton]);
    this.append([heroDescription, heroInfo, heroImage]);
  }
}
