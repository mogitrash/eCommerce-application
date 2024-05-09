import BaseComponent from './components/base/base.component';
import LoginPage from './components/login/login.component';

export default class App extends BaseComponent<'div'> {
  loginPage: LoginPage;

  constructor(private root: HTMLElement) {
    super('div', ['app']);
    this.loginPage = new LoginPage();
    this.render();
  }

  render() {
    this.append([this.loginPage]);
  }

  start() {
    this.root.append(this.element);
  }
}
