import './login.scss';
import BaseComponent from '../base/base.component';
import LoginModal from './login-modal/login-modal.component';

export default class LoginPage extends BaseComponent<'div'> {
  loginModal: LoginModal;

  constructor() {
    super('div', ['login_page']);
    this.loginModal = new LoginModal();

    this.render();
  }

  render() {
    this.append([this.loginModal]);
  }
}
