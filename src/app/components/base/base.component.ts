export default class BaseComponent<T extends keyof HTMLElementTagNameMap> {
  protected element: HTMLElementTagNameMap[T];

  constructor(tag: T, classes: string[] = [], text: string = '') {
    this.element = document.createElement(tag);
    this.element.classList.add(...classes);
    this.element.innerText = text;
  }

  getElement(): HTMLElementTagNameMap[T] {
    return this.element;
  }

  append(components: BaseComponent<T>[]) {
    components.forEach((component) => {
      this.element.append(component.getElement());
    });

    return this;
  }
}
