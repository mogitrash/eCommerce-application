import Renderer from '../../models/renderer.model';
import Routes from '../../models/routes.model';

export default class RouterService {
  private routes = Object.values(Routes) as string[];

  constructor(private app: Renderer) {
    window.addEventListener('popstate', () => {
      this.navigateTo(window.location.pathname);
    });
  }

  init() {
    this.navigate(window.location.pathname);
  }

  navigate(path: Routes | string) {
    window.history.pushState({}, '', path);
    this.navigateTo(path);
  }

  private navigateTo(path: Routes | string) {
    if (this.routes.includes(path)) {
      this.app.render(path as Routes);
    } else {
      this.app.render(Routes.NotFound);
    }
  }
}
