import './not-found.scss';
import BaseComponent from '../base/base.component';
import NotFoundGif from '../../assets/images/not-found.gif';
import Button from '../button/button.component';
import RouterService from '../../services/router/router.service';

export default class NotFoundComponent extends BaseComponent<'div'> {
  private image: BaseComponent<'img'>;

  private hint: BaseComponent<'p'>;

  private error: BaseComponent<'p'>;

  private button: Button;

  constructor(private router: RouterService) {
    super({ tag: 'div', classes: ['not-found'] });
    this.image = new BaseComponent({
      tag: 'img',
      classes: ['not-found_image'],
    });
    this.hint = new BaseComponent({
      tag: 'p',
      classes: ['not-found_hint'],
      textContent: 'Ooops! Something went wrong. Page not found.',
    });
    this.error = new BaseComponent({
      tag: 'p',
      classes: ['not-found_error'],
      textContent: '404 error',
    });
    this.button = new Button({
      text: 'Back to Home Page',
      onClick: this.redirectToMain.bind(this),
    });
    this.setupElements();
    this.render();
  }

  private redirectToMain() {
    this.router.navigate('/');
  }

  private setupElements() {
    this.image.setAttribute('src', NotFoundGif);
  }

  private render() {
    this.append([this.image, this.hint, this.error, this.button]);
  }
}
