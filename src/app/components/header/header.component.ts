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

  private createControlPanel(): void {
    const wrapper = new BaseComponent({ tag: 'nav', classes: ['header_control-wrapper'] });
    const product = new Button({
      text: 'Product',
      style: 'navigation',
      onClick: () => {
        this.router.navigate('/product');
      },
    });
    const catalog = new Button({
      text: 'Catalog',
      style: 'navigation',
      onClick: () => {
        this.router.navigate('/catalog');
      },
    });
    this.profile = new Button({
      style: 'navigation',
      onClick: () => {
        this.router.navigate('/profile');
      },
    });
    this.profile.addClass('header_button-profile');
    this.loginButton = new Button({
      text: 'Log In',
      style: 'navigation',
      onClick: () => {
        this.router.navigate('/login');
      },
    });
    this.registrationButton = new Button({
      text: 'Registration',
      style: 'navigation',
      onClick: () => {
        this.router.navigate('/registration');
      },
    });
    this.logoutButton = new Button({
      text: 'Log Out',
      style: 'navigation',
      onClick: () => {
        this.authenticationService.signOutCustomer();
        this.router.redirect(Routes.Login);
      },
    });
    wrapper.append([
      product,
      catalog,
      this.loginButton,
      this.registrationButton,
      this.logoutButton,
      this.profile,
    ]);
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
}

export default HeaderComponent;
