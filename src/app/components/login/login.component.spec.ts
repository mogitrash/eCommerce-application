import Login from './login.component';

const validityMock: ValidityState = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: false,
  valueMissing: false,
};

describe('Login', () => {
  let component: Login;
  const handleFormSubmitSpy = jest.spyOn(Login, 'handleFormSubmit');
  const showInputErrorSpy = jest.spyOn(Login, 'showInputError');

  beforeEach(() => {
    component = new Login();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('validateForm() should call showInputError() in case of email validation error', () => {
    jest.spyOn(Login, 'validateInputEmail').mockReturnValueOnce('Email error text');
    jest.spyOn(Login, 'validateInputPassword').mockReturnValueOnce('');
    component.validateForm();
    expect(showInputErrorSpy).toHaveBeenCalledWith('Email error text', component.emailError);
  });

  test('validateForm() should call showInputError() in case of password validation error', () => {
    jest.spyOn(Login, 'validateInputEmail').mockReturnValueOnce('');
    jest.spyOn(Login, 'validateInputPassword').mockReturnValueOnce('Password error text');
    component.validateForm();
    expect(showInputErrorSpy).toHaveBeenCalledWith('Password error text', component.passwordError);
  });

  test('validateForm() should not call showInputError() in case of the absence of an error', () => {
    jest.spyOn(Login, 'validateInputEmail').mockReturnValueOnce('');
    jest.spyOn(Login, 'validateInputPassword').mockReturnValueOnce('');
    component.validateForm();
    expect(showInputErrorSpy).toHaveBeenCalledTimes(0);
  });

  test('validateForm() should disable login button in case email of validation error', () => {
    jest.spyOn(Login, 'validateInputEmail').mockReturnValueOnce('Email error text');
    jest.spyOn(Login, 'validateInputPassword').mockReturnValueOnce('');
    component.validateForm();
    expect(component.loginButton.getElement().disabled).toBe(true);
  });

  test('validateForm() should disable login button in case password of validation error', () => {
    jest.spyOn(Login, 'validateInputEmail').mockReturnValueOnce('');
    jest.spyOn(Login, 'validateInputPassword').mockReturnValueOnce('Password error text');
    component.validateForm();
    expect(component.loginButton.getElement().disabled).toBe(true);
  });

  test('validateForm() should enable login button in case of the absence of an error', () => {
    jest.spyOn(Login, 'validateInputEmail').mockReturnValueOnce('');
    jest.spyOn(Login, 'validateInputPassword').mockReturnValueOnce('');
    component.validateForm();
    expect(component.loginButton.getElement().disabled).toBe(false);
  });

  test('handleFormSubmit() should be called on form submit', () => {
    const event = new Event('submit');
    component.loginForm.getElement().dispatchEvent(event);
    expect(handleFormSubmitSpy).toHaveBeenCalled();
  });

  test('handleFormSubmit() should be called on login button click', () => {
    const event = new Event('click');
    component.loginButton.getElement().dispatchEvent(event);
    expect(handleFormSubmitSpy).toHaveBeenCalled();
  });

  test('validateInputPassword() should return correct message in case of too short input', () => {
    expect(Login.validateInputPassword({ ...validityMock, tooShort: true })).toBe(
      'The password should be a minimum of 8 characters in length.',
    );
  });

  test('validateInputPassword() should return correct message in case of pattern mismatch', () => {
    expect(Login.validateInputPassword({ ...validityMock, patternMismatch: true })).toBe(
      'Password must contain at least one uppercase letter, one lowercase letter, one digit. Whitespaces are not allowed.',
    );
  });

  test('validateInputPassword() should return correct message in case of an empty input', () => {
    expect(Login.validateInputPassword({ ...validityMock, valueMissing: true })).toBe(
      'Please enter value.',
    );
  });

  test('validateInputEmail() should return correct message in case of pattern mismatch', () => {
    expect(Login.validateInputEmail({ ...validityMock, patternMismatch: true })).toBe(
      'Email address must be properly formatted (e.g., user@example.com). Whitespaces are not allowed.',
    );
  });

  test('validateInputEmail() should return correct message in case of an empty input', () => {
    expect(Login.validateInputEmail({ ...validityMock, valueMissing: true })).toBe(
      'Please enter value.',
    );
  });
});
