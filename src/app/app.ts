import BaseComponent from './components/base/base.component';
import LoginComponent from './components/login/login.component';
import RegistrationComponent from './components/registration/registation.component';
import Renderer from './models/renderer.model';
import RouterService from './services/router/router.service';
import Routes from './models/routes.model';
import HeaderComponent from './components/header/header.component';
import NotFoundComponent from './components/not-found-page/not-found.component';
import MainComponent from './components/main/main.component';

export default class App extends BaseComponent<'div'> implements Renderer {
  private routerService = new RouterService(this);

  private loginComponent = new LoginComponent(this.routerService);

  private headerComponent = new HeaderComponent(this.routerService);

  private registrationComponent = new RegistrationComponent(this.routerService);

  private mainComponent = new MainComponent(this.routerService);

  private notFoundComponent = new NotFoundComponent(this.routerService);

  private contentWrapper = new BaseComponent({
    tag: 'main',
    classes: ['app_content'],
  });

  constructor(private root: HTMLElement) {
    super({ tag: 'div', classes: ['app'] });
  }

  render(path: Routes): void {
    const isLogined = localStorage.getItem('userToken');
    this.headerComponent.changeDisplay(Boolean(isLogined));
    this.contentWrapper.getElement().innerHTML = '';
    switch (path) {
      case Routes.Login:
        if (isLogined) {
          this.routerService.redirect(Routes.Main);
        } else {
          this.contentWrapper.append([this.loginComponent]);
        }
        break;
      case Routes.Registration:
        if (isLogined) {
          this.routerService.redirect(Routes.Main);
        } else {
          this.contentWrapper.append([this.registrationComponent]);
        }
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
  }
}
