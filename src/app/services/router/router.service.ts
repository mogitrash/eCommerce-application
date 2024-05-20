import Renderer from '../../models/renderer.model';
import Routes from '../../models/routes.model';

export default class RouterService {
  private routes = Object.values(Routes) as string[];

  constructor(private app: Renderer) {
    window.addEventListener('popstate', () => {
      this.handleLocation(window.location.pathname);
    });
  }

  init() {
    this.handleLocation(window.location.pathname);
  }

  redirect(path: Routes) {
    window.history.replaceState({}, '', path);
    this.handleLocation(path);
  }

  navigate(path: Routes | string) {
    window.history.pushState({}, '', path);
    this.handleLocation(path);
  }

  private handleLocation(path: Routes | string) {
    if (this.routes.includes(path)) {
      this.app.render(path as Routes);
    } else {
      this.app.render(Routes.NotFound);
    }
  }
}
