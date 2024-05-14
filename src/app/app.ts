import BaseComponent from './components/base/base.component';
import AuthenticationService from './services/authentication.service';
import LoginComponent from './components/login/login.component';

export default class App extends BaseComponent<'div'> {
  private authenticationService = new AuthenticationService();

  loginComponent: LoginComponent;

  constructor(private root: HTMLElement) {
    super({ tag: 'div', classes: ['app'] });
    this.loginComponent = new LoginComponent();
    this.render();
  }

  render() {
    this.append([this.loginComponent]);
  }

  start() {
    this.root.append(this.element);

    // NOTE: examples of signup and login

    // const addresses: BaseAddress[] = [{ country: Country.BY }];

    // this.authenticationService
    //   .signUpCustomer({
    //     email: 'addressTest2@gmail.com',
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
