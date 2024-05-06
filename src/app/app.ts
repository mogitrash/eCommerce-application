import BaseComponent from './components/base/base.component';
import AuthenticationService from './services/authentication.service';

export default class App extends BaseComponent<'div'> {
  private authenticationService = new AuthenticationService();

  constructor(private root: HTMLElement) {
    super('div', ['app']);
  }

  async start() {
    this.root.append(this.element);

    await this.authenticationService.signUpCustomer('test@gmail.com', 'Name', 'Lastname', '12345');
  }
}
