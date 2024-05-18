import BaseComponent from './components/base/base.component';
import LoginComponent from './components/login/login.component';
import RegistrationComponent from './components/registration/registation.component';

export default class App extends BaseComponent<'div'> {
  loginComponent: LoginComponent;

  registrationComponent: RegistrationComponent;

  constructor(private root: HTMLElement) {
    super({ tag: 'div', classes: ['app'] });
    this.loginComponent = new LoginComponent();
    this.registrationComponent = new RegistrationComponent();
    this.render();
  }

  render() {
    this.append([this.loginComponent]);
  }

  start() {
    this.root.append(this.element);
    this.append([this.loginComponent]);
  }
}
