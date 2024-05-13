import BaseComponent from './base.component';

describe('BaseComponent', () => {
  let component: BaseComponent<keyof HTMLElementTagNameMap>;

  beforeEach(() => {
    component = new BaseComponent({ tag: 'p' });
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should add class on creation', () => {
    component = new BaseComponent({ tag: 'p', classes: ['test', 'test1'] });
    expect(component.getElement().classList.contains('test')).toBe(true);
    expect(component.getElement().classList.contains('test1')).toBe(true);
  });

  test('should add text content on creation', () => {
    const textToCheck = 'test text';
    component = new BaseComponent({ tag: 'p', classes: ['test'], textContent: textToCheck });
    expect(component.getElement().textContent).toBe(textToCheck);
  });

  test('getElement() should return element', () => {
    expect(component.getElement().tagName).toBe('P');
  });

  test('setAttribute() should set attribute', () => {
    component.setAttribute('data-test', 'text');
    expect(component.getElement().getAttribute('data-test')).toBe('text');
  });

  test('getAttribute() should return attribute', () => {
    component.getElement().setAttribute('data-test', 'text');
    expect(component.getAttribute('data-test')).toBe('text');
  });

  test('should call added listener', () => {
    const clickHandler = jest.fn();
    component.addListener('click', clickHandler);
    const event = new Event('click');
    component.getElement().dispatchEvent(event);
    expect(clickHandler).toHaveBeenCalled();
  });

  test('addClass() should add class', () => {
    component.addClass('test');
    expect(component.getElement().classList.contains('test')).toBe(true);
  });

  test('removeClass() should remove class', () => {
    component.addClass('test');
    component.removeClass('test');
    expect(component.getElement().classList.contains('test')).toBe(false);
  });

  test('setTextContent() should set text', () => {
    component.setTextContent('test text');
    expect(component.getElement().textContent).toBe('test text');
  });

  test('append() should append children', () => {
    component.append([new BaseComponent({ tag: 'span' })]);
    expect(component.getElement().children[0].tagName).toBe('SPAN');
  });
});
