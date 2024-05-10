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

  setAttribute(attribute: string, value: string) {
    this.element.setAttribute(attribute, value);
  }

  getAttribute(attribute: string): string | null {
    return this.element.getAttribute(attribute);
  }

  addListener(event: string, listener: (event: Event) => void, options: boolean = false) {
    this.element.addEventListener(event, listener, options);
  }

  addClass(className: string) {
    this.element.classList.add(className);
  }

  removeClass(className: string) {
    this.element.classList.remove(className);
  }

  setTextContent(content: string) {
    this.element.textContent = content;
  }

  append(components: BaseComponent<keyof HTMLElementTagNameMap>[]) {
    components.forEach((component) => {
      this.element.append(component.getElement());
    });

    return this;
  }
}
