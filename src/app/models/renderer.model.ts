import Routes from './routes.model';

interface Renderer {
  render(path: Routes, id?: string): void;
}

export default Renderer;
