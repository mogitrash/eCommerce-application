import BaseComponent from './components/base/base.component';
import LoginComponent from './components/login/login.component';

export default class App extends BaseComponent<'div'> {
  loginComponent: LoginComponent;

  constructor(private root: HTMLElement) {
    super({ tag: 'div', classes: ['app'] });
    this.loginComponent = new LoginComponent();
  }

  start() {
    this.root.append(this.element);
    this.append([this.loginComponent]);
  }
}
