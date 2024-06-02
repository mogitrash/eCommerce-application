import BaseComponent from './components/base/base.component';
import LoginComponent from './components/login/login.component';
import RegistrationComponent from './components/registration/registation.component';
import Renderer from './models/renderer.model';
import RouterService from './services/router/router.service';
import Routes from './models/routes.model';
import HeaderComponent from './components/header/header.component';
import NotFoundComponent from './components/not-found-page/not-found.component';
import MainComponent from './components/main/main.component';
import CatalogComponent from './components/catalog/catalog.component';
import ProductComponent from './components/product/product.component';
import ProfileComponent from './components/profile/profile.component';
import LocalStorageEndpoint from './models/local-storage-endpoint.model';
import ProductService from './services/product.service';

export default class App extends BaseComponent<'div'> implements Renderer {
  private routerService = new RouterService(this);

  private productService = new ProductService();

  private loginComponent = new LoginComponent(this.routerService);

  private headerComponent = new HeaderComponent(this.routerService);

  private registrationComponent = new RegistrationComponent(this.routerService);

  private mainComponent = new MainComponent(this.routerService);

  private notFoundComponent = new NotFoundComponent(this.routerService);

  private catalogComponent = new CatalogComponent(this.routerService);

  private productComponent!: ProductComponent;

  private contentWrapper = new BaseComponent({
    tag: 'main',
    classes: ['app_content'],
  });

  constructor(private root: HTMLElement) {
    super({ tag: 'div', classes: ['app'] });
  }

  async render(path: Routes, id?: string) {
    const isLogined = Boolean(localStorage.getItem(LocalStorageEndpoint.userToken));
    this.headerComponent.changeDisplay(isLogined);
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
      case Routes.Catalog:
        this.contentWrapper.append([this.catalogComponent]);
        break;
      case Routes.Profile:
        if (isLogined) {
          this.contentWrapper.append([new ProfileComponent()]);
          this.routerService.redirect(Routes.Login);
        }
        break;
      case Routes.Product:
        if (id) {
          const card = await this.productService.getPublishedProductById(id.slice(4));
          if ('id' in card) {
            this.productComponent = new ProductComponent(card);
            this.contentWrapper.append([this.productComponent]);
            break;
          }
        }
        this.contentWrapper.append([this.notFoundComponent]);
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
