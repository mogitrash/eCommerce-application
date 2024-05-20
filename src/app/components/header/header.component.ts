import './header.scss';
import BaseComponent from '../base/base.component';
import RouterService from '../../services/router/router.service';
import logoSrc from '../../assets/images/main-logo.png';
import Button from '../button/button.component';
import Routes from '../../models/routes.model';

class HeaderComponent extends BaseComponent<'header'> {
  private loginButton!: Button;

  private logoutButton!: Button;

  private registrationButton!: Button;

  constructor(private router: RouterService) {
    super({ tag: 'header', classes: ['header'] });
    this.createLogo();
    this.createControlPanel();
  }

  changeDisplay(isLogined: boolean): void {
    if (isLogined) {
      this.logoutButton.removeClass('hidden');
      this.loginButton.addClass('hidden');
      this.registrationButton.addClass('hidden');
    } else {
      this.logoutButton.addClass('hidden');
      this.loginButton.removeClass('hidden');
      this.registrationButton.removeClass('hidden');
    }
  }

  private createLogo(): void {
    const logoWrapper = new BaseComponent({
      tag: 'div',
      classes: ['logo-wrapper'],
    });
    logoWrapper.addListener('click', () => {
      this.router.navigate('/');
    });
    const logo = new BaseComponent({ tag: 'img', classes: ['logo'] }).setAttribute('src', logoSrc);
    logoWrapper.append([logo]);
    this.append([logoWrapper]);
  }

  private createControlPanel(): void {
    const wrapper = new BaseComponent({ tag: 'nav', classes: ['control-wrapper'] });
    this.loginButton = new Button({
      text: 'Log In',
      onClick: () => {
        this.router.navigate('/login');
      },
    });
    this.registrationButton = new Button({
      text: 'Registration',
      onClick: () => {
        this.router.navigate('/registration');
      },
    });
    this.logoutButton = new Button({
      text: 'Log Out',
      onClick: () => {
        localStorage.removeItem('userToken');
        this.router.redirect(Routes.Login);
      },
    });
    wrapper.append([this.loginButton, this.registrationButton, this.logoutButton]);
    this.append([wrapper]);
  }
}

export default HeaderComponent;
