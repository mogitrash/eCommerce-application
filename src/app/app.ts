import BaseComponent from './components/base/base';

export default class App extends BaseComponent<'div'> {
  constructor(private root: HTMLElement) {
    super('div', ['app']);
  }

  start() {
    this.root.append(this.element);
  }
}
