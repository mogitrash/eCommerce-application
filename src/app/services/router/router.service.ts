import Renderer from '../../models/renderer.model';
import Routes from '../../models/routes.model';

export default class RouterService {
  private routes = Object.values(Routes) as string[];

  constructor(private app: Renderer) {
    window.addEventListener('popstate', () => {
      this.handleLocation(window.location.pathname, window.location.search);
    });
  }

  init() {
    this.handleLocation(window.location.pathname, window.location.search);
  }

  redirect(path: Routes, id?: string) {
    if (id) {
      window.history.replaceState({}, '', path + id);
      this.handleLocation(path, id);
    } else {
      window.history.replaceState({}, '', path);
      this.handleLocation(path);
    }
  }

  navigate(path: Routes | string, id?: string) {
    if (id) {
      window.history.pushState({}, '', path + id);
      this.handleLocation(path, id);
    } else {
      window.history.pushState({}, '', path);
      this.handleLocation(path);
    }
  }

  private handleLocation(path: Routes | string, id?: string) {
    if (this.routes.includes(path)) {
      this.app.render(path as Routes, id);
    } else {
      this.app.render(Routes.NotFound);
    }
  }
}
