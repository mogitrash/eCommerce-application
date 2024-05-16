import BaseComponent from './components/base/base.component';
import AuthenticationService from './services/authentication.service';
import LoginComponent from './components/login/login.component';
import Renderer from './models/renderer.model';
import RouterService from './services/router/router.service';
import Routes from './models/routes.model';

export default class App extends BaseComponent<'div'> implements Renderer {
  private authenticationService = new AuthenticationService();

  private routerService = new RouterService(this);

  private loginComponent = new LoginComponent();

  private headerComponent = new BaseComponent({
    tag: 'header',
    classes: ['app_header'],
    textContent: 'this is HEADER',
  });

  private registrationComponent = new BaseComponent({
    tag: 'div',
    classes: ['app_registration'],
    textContent: 'this is REGISTRATION page',
  });

  private mainComponent = new BaseComponent({
    tag: 'div',
    classes: ['app_main'],
    textContent: 'this is MAIN page',
  });

  private notFoundComponent = new BaseComponent({
    tag: 'div',
    classes: ['app_not-found'],
    textContent: 'this is NOT FOUND page',
  });

  private contentWrapper = new BaseComponent({
    tag: 'main',
    classes: ['app_main'],
  });

  constructor(private root: HTMLElement) {
    super({ tag: 'div', classes: ['app'] });
  }

  render(path: Routes): void {
    this.contentWrapper.getElement().innerHTML = '';
    switch (path) {
      case Routes.Login:
        this.contentWrapper.append([this.loginComponent]);
        break;
      case Routes.Registration:
        this.contentWrapper.append([this.registrationComponent]);
        break;
      case Routes.Main:
        this.contentWrapper.append([this.mainComponent]);
        break;
      case Routes.NotFound:
      default:
        this.contentWrapper.append([this.notFoundComponent]);
    }
  }

  start(): void {
    this.root.append(this.element);
    this.append([this.headerComponent, this.contentWrapper]);
    this.routerService.init();

    // NOTE: examples of signup and login

    // const addresses: BaseAddress[] = [{ country: Country.BY }];

    // this.authenticationService
    //   .signUpCustomer({
    //     email: 'aaddressTest2@gmail.com',
    //     password: '12345',
    //     addresses,
    //     defaultBillingAddress: 0,
    //     defaultShippingAddress: 0,
    //   })
    //   .then((res) => console.log(res));

    // this.authenticationService
    //   .signInCustomer({
    //     email: 'hermao@gmail.com',
    //     password: '12345',
    //   })
    //   .then((res) => console.log(res));
  }
}
