import './header.scss';
import BaseComponent from '../base/base.component';
import RouterService from '../../services/router/router.service';
import logoSrc from '../../assets/images/main-logo.png';
import Button from '../button/button.component';
import Routes from '../../models/routes.model';
import authenticationService from '../../services/authentication.service';
import LocalStorageEndpoint from '../../models/local-storage-endpoint.model';

class HeaderComponent extends BaseComponent<'header'> {
  private loginButton!: Button;

  private logoutButton!: Button;

  private registrationButton!: Button;

  private profile!: Button;

  private burgerMenu!: BaseComponent<'div'>;

  private burgerButton!: BaseComponent<'div'>;

  private isBurgerShown: boolean = false;

  private authenticationService = authenticationService;

  constructor(private router: RouterService) {
    super({ tag: 'header', classes: ['header'] });
    this.createLogo();
    this.createControlPanel();
    this.setupCallbacks();
  }

  private createLogo(): void {
    const logoWrapper = new BaseComponent({
      tag: 'div',
      classes: ['header_logo-wrapper'],
    });
    const logo = new BaseComponent({ tag: 'img', classes: ['header_logo'] }).setAttribute(
      'src',
      logoSrc,
    );
    const slogan = new BaseComponent({
      tag: 'p',
      classes: ['header_slogan'],
      textContent: 'Pawsitively the Best for Your Pets!',
    });
    logo.addListener('click', () => {
      this.router.navigate('/');
    });
    logoWrapper.append([logo, slogan]);
    this.append([logoWrapper]);
  }

  private createBurgerButton(): void {
    this.burgerButton = new BaseComponent({ tag: 'div', classes: ['burger-button'] });
    const burgerButtonCenter = new BaseComponent({ tag: 'div' });
    this.burgerButton.append([burgerButtonCenter]);
    this.burgerButton.addListener('click', this.toggleBurger.bind(this));
  }

  private createControlPanel(): void {
    const wrapper = new BaseComponent({ tag: 'nav', classes: ['header_control-wrapper'] });
    this.burgerMenu = new BaseComponent({ tag: 'div', classes: ['header_burger-menu'] });
    const catalog = new Button({
      text: 'Catalog',
      style: 'navigation',
      onClick: () => {
        this.hideBurger();
        this.router.navigate('/catalog');
      },
    });
    this.profile = new Button({
      style: 'navigation',
      onClick: () => {
        this.hideBurger();
        this.router.navigate('/profile');
      },
    });
    this.profile.addClass('header_button-profile');
    this.loginButton = new Button({
      text: 'Log In',
      style: 'navigation',
      onClick: () => {
        this.hideBurger();
        this.router.navigate('/login');
      },
    });
    this.registrationButton = new Button({
      text: 'Registration',
      style: 'navigation',
      onClick: () => {
        this.hideBurger();
        this.router.navigate('/registration');
      },
    });
    this.logoutButton = new Button({
      text: 'Log Out',
      style: 'navigation',
      onClick: () => {
        this.hideBurger();
        this.authenticationService.signOutCustomer();
        this.router.redirect(Routes.Login);
      },
    });
    this.createBurgerButton();
    this.burgerMenu.append([catalog, this.loginButton, this.registrationButton, this.logoutButton]);
    wrapper.append([this.burgerMenu, this.profile, this.burgerButton]);
    this.append([wrapper]);
    this.handleUserStatus();
  }

  private handleUserStatus(): void {
    const isLoggedin = localStorage.getItem(LocalStorageEndpoint.userToken);
    if (isLoggedin) {
      this.handleLoggedin();
    } else {
      this.handleLoggedout();
    }
  }

  private setupCallbacks(): void {
    this.authenticationService.onLogin(this.handleLoggedin.bind(this));
    this.authenticationService.onLogout(this.handleLoggedout.bind(this));
  }

  private handleLoggedin(): void {
    this.logoutButton.show();
    this.loginButton.hide();
    this.registrationButton.hide();
    this.profile.show();
  }

  private handleLoggedout(): void {
    this.logoutButton.hide();
    this.loginButton.show();
    this.registrationButton.show();
    this.profile.hide();
  }

  private toggleBurger(): void {
    if (this.isBurgerShown) {
      this.hideBurger();
    } else this.showBurger();
  }

  private showBurger(): void {
    this.isBurgerShown = true;
    document.body.classList.add('disable-scrolling');
    this.burgerButton.addClass('burger-button--active');
    this.burgerMenu.addClass('header_burger-menu--active');
  }

  private hideBurger(): void {
    this.isBurgerShown = false;
    document.body.classList.remove('disable-scrolling');
    this.burgerButton.removeClass('burger-button--active');
    this.burgerMenu.removeClass('header_burger-menu--active');
  }
}

export default HeaderComponent;
