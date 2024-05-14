type BaseComponentConfig<T> = { tag: T; classes?: string[]; textContent?: string };
export default class BaseComponent<T extends keyof HTMLElementTagNameMap> {
  protected element: HTMLElementTagNameMap[T];

  constructor(config: BaseComponentConfig<T>) {
    const { tag, classes, textContent } = config;
    this.element = document.createElement(tag);
    if (classes) {
      this.element.classList.add(...classes);
    }
    this.element.textContent = textContent || '';
  }

  getElement(): HTMLElementTagNameMap[T] {
    return this.element;
  }

  setAttribute(attribute: string, value: string) {
    this.element.setAttribute(attribute, value);
    return this;
  }

  getAttribute(attribute: string): string | null {
    return this.element.getAttribute(attribute);
  }

  addListener(event: string, listener: (event: Event) => void, options: boolean = false) {
    this.element.addEventListener(event, listener, options);
    return this;
  }

  addClass(className: string) {
    this.element.classList.add(className);
    return this;
  }

  removeClass(className: string) {
    this.element.classList.remove(className);
    return this;
  }

  setTextContent(content: string) {
    this.element.textContent = content;
    return this;
  }

  append(components: BaseComponent<keyof HTMLElementTagNameMap>[]) {
    components.forEach((component) => {
      this.element.append(component.getElement());
    });

    return this;
  }
}
