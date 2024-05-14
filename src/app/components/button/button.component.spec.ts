import Button from './button.component';

describe('Button', () => {
  let component: Button;
  beforeEach(() => {
    component = new Button({ text: 'test', onClick: () => {} });
  });
  test('disable() should set "disabled" attribute', () => {
    component.disable();
    expect(component.getElement().disabled).toBe(true);
  });

  test('enable() should remove "disabled" attribute', () => {
    component.enable();
    expect(component.getElement().disabled).toBe(false);
  });
});
