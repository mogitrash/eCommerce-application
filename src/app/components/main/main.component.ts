import RouterService from '../../services/router/router.service';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './main.scss';

export default class MainComponent extends BaseComponent<'div'> {
  constructor(private router: RouterService) {
    super({ tag: 'div', classes: ['main'] });
    this.createButtons();
  }

  private createButtons() {
    const loginButton = new Button({
      text: 'Log In',
      onClick: () => {
        this.router.navigate('/login');
      },
    });
    const registrationButton = new Button({
      text: 'Registration',
      onClick: () => {
        this.router.navigate('/registration');
      },
    });
    const notFound = new Button({
      text: '404',
      onClick: () => {
        this.router.navigate('/404');
      },
    });

    const main = new Button({
      text: 'Main',
      onClick: () => {
        this.router.navigate('/');
      },
    });

    this.append([main, loginButton, registrationButton, notFound]);
  }
}
