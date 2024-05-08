import BaseComponent from './components/base/base.component';
import AuthenticationService from './services/authentication.service';

export default class App extends BaseComponent<'div'> {
  private authenticationService = new AuthenticationService();

  constructor(private root: HTMLElement) {
    super('div', ['app']);
  }

  async start() {
    this.root.append(this.element);

    // NOTE: examples of signup and login

    // const addresses: BaseAddress[] = [{ country: Country.BY }];

    // await this.authenticationService.signUpCustomer({
    //   email: 'yourMail@gmail.com',
    //   password: '12345',
    //   addresses,
    // });

    // await this.authenticationService.signInCustomer({
    //   email: 'hermao@gmail.com',
    //   password: '12345',
    // });
  }
}
