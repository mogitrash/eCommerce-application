import RouterService from '../../services/router/router.service';
import BaseComponent from '../base/base.component';
import './header.scss';
// this is not real header, it's header only for test router,
// u can don't review this component
class HeaderComponent extends BaseComponent<'header'> {
  constructor(private router: RouterService) {
    super({ tag: 'header' });
    this.createButtons();
  }

  createButtons() {
    const login = new BaseComponent({ tag: 'button', textContent: 'login' });
    login.getElement().addEventListener('click', () => {
      this.router.navigate('/login');
    });
    const registration = new BaseComponent({ tag: 'button', textContent: 'registration' });
    registration.getElement().addEventListener('click', () => {
      this.router.navigate('/registration');
    });
    const main = new BaseComponent({ tag: 'button', textContent: 'main' });
    main.getElement().addEventListener('click', () => {
      this.router.navigate('/');
    });
    this.element.append(login.getElement(), registration.getElement(), main.getElement());
  }
}

export default HeaderComponent;
