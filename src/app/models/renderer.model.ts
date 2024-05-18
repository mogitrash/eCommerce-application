import Routes from './routes.model';

interface Renderer {
  render(path: Routes): void;
}

export default Renderer;
