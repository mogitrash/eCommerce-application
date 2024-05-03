import BaseComponent from './components/base/base';

export default class App extends BaseComponent<'main'> {
  constructor(private root: HTMLElement) {
    super('main', ['app']);
  }

  start() {
    this.root.append(this.element);
  }
}
