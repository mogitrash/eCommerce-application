import './login.scss';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';

const EMAIL_REGEX = '^\\S+@\\S+\\.\\S+$';
const PASSWORD_REGEX = '^[^\\s]*(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[^\\s]*$';
const PASSWORD_MINLENGTH = '8';

export default class Login extends BaseComponent<'div'> {
  loginHint: BaseComponent<'p'>;

  loginForm: BaseComponent<'form'>;

  emailInput: BaseComponent<'input'>;

  emailInputLabel: BaseComponent<'label'>;

  emailInputId: string = 'emailId';

  emailError: BaseComponent<'span'>;

  passwordInput: BaseComponent<'input'>;

  passwordInputLabel: BaseComponent<'label'>;

  emailInputName: string = 'email';

  passwordInputName: string = 'password';

  passwordInputId: string = 'passwordId';

  passwordError: BaseComponent<'span'>;

  passwordVisibility: BaseComponent<'input'>;

  passwordVisibilityLabel: BaseComponent<'label'>;

  passwordVisibilityId: string = 'visibilityId';

  visibilityWrapper: BaseComponent<'div'>;

  loginButton: Button;

  registrationButton: Button;

  constructor() {
    super({ tag: 'div', classes: ['login_modal'] });
    this.loginHint = new BaseComponent({
      tag: 'p',
      classes: ['modal_hint'],
      textContent: 'Sign In',
    });
    this.loginForm = new BaseComponent({ tag: 'form', classes: ['modal_form'] });
    this.emailInputLabel = new BaseComponent({
      tag: 'label',
      classes: ['modal_input-label'],
      textContent: 'Email',
    });
    this.emailInput = new BaseComponent({ tag: 'input', classes: ['modal_input'] });
    this.emailError = new BaseComponent({ tag: 'span', classes: ['modal_error'] });
    this.passwordInputLabel = new BaseComponent({
      tag: 'label',
      classes: ['modal_input-label'],
      textContent: 'Password',
    });
    this.passwordInput = new BaseComponent({ tag: 'input', classes: ['modal_input'] });
    this.passwordError = new BaseComponent({ tag: 'span', classes: ['modal_error'] });
    this.passwordVisibility = new BaseComponent({ tag: 'input' });
    this.passwordVisibilityLabel = new BaseComponent({
      tag: 'label',
      classes: ['modal_visibility'],
      textContent: 'Show Password',
    });
    this.visibilityWrapper = new BaseComponent({ tag: 'div', classes: ['visibility_wrapper'] });
    this.loginButton = new Button({
      text: 'Log In',
      onClick: Login.handleFormSubmit.bind(this),
    });
    this.registrationButton = new Button({
      text: 'Registration',
      onClick: () => {
        // TODO: add routing here
      },
    });
    this.loginButton.disable();
    this.setupElements();
    this.setupListeners();
    this.render();
  }

  static handleFormSubmit(event: Event) {
    event?.preventDefault();
  }

  validateForm() {
    const emailErrorText = Login.validateInputEmail(this.emailInput.getElement().validity);
    const passwordErrorText = Login.validateInputPassword(this.passwordInput.getElement().validity);

    if (emailErrorText) {
      Login.showInputError(emailErrorText, this.emailError);
      this.loginButton.disable();
      return;
    }
    if (passwordErrorText) {
      Login.showInputError(passwordErrorText, this.passwordError);
      this.loginButton.disable();
      return;
    }
    this.loginButton.enable();
  }

  togglePasswordVisibility() {
    if (this.passwordInput.getAttribute('type') === 'password') {
      this.passwordInput.setAttribute('type', 'text');
    } else {
      this.passwordInput.setAttribute('type', 'password');
    }
  }

  static validateInputPassword(validity: ValidityState): string {
    if (validity.tooShort) {
      return 'The password should be a minimum of 8 characters in length.';
    }
    if (validity.patternMismatch) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one digit. Whitespaces are not allowed.';
    }
    if (validity.valueMissing) {
      return 'Please enter value.';
    }
    return '';
  }

  static validateInputEmail(validity: ValidityState): string {
    if (validity.patternMismatch) {
      return 'Email address must be properly formatted (e.g., user@example.com). Whitespaces are not allowed.';
    }
    if (validity.valueMissing) {
      return 'Please enter value.';
    }
    return '';
  }

  static showInputError(errorText: string, errorComponent: BaseComponent<'span'>) {
    errorComponent.addClass('modal_error--shown');
    errorComponent.setTextContent(errorText);
  }

  static hideInputError(errorComponent: BaseComponent<'span'>) {
    errorComponent.removeClass('modal_error--shown');
    errorComponent.setTextContent('');
  }

  setupElements() {
    this.loginForm.setAttribute('novalidate', '');

    this.emailInput.setAttribute('type', 'text');
    this.emailInput.setAttribute('id', this.emailInputId);
    this.emailInput.setAttribute('required', '');
    this.emailInput.setAttribute('pattern', EMAIL_REGEX);
    this.emailInput.setAttribute('name', this.emailInputName);
    this.emailInputLabel.setAttribute('for', this.emailInputId);

    this.passwordInput.setAttribute('type', 'password');
    this.passwordInput.setAttribute('id', this.passwordInputId);
    this.passwordInput.setAttribute('required', '');
    this.passwordInput.setAttribute('minlength', PASSWORD_MINLENGTH);
    this.passwordInput.setAttribute('pattern', PASSWORD_REGEX);
    this.passwordInput.setAttribute('name', this.passwordInputName);
    this.passwordInputLabel.setAttribute('for', this.passwordInputId);

    this.passwordVisibility.setAttribute('type', 'checkbox');
    this.passwordVisibility.setAttribute('id', this.passwordVisibilityId);
    this.passwordVisibilityLabel.setAttribute('for', this.passwordVisibilityId);

    this.loginButton.setAttribute('type', 'submit');
  }

  setupListeners() {
    this.loginForm.addListener('submit', Login.handleFormSubmit.bind(this));
    this.loginForm.addListener('input', this.validateForm.bind(this));
    this.passwordVisibility.addListener('input', this.togglePasswordVisibility.bind(this));
    this.emailInput.addListener('input', () => {
      Login.hideInputError(this.emailError);
    });
    this.passwordInput.addListener('input', () => {
      Login.hideInputError(this.passwordError);
    });
  }

  render() {
    this.visibilityWrapper.append([this.passwordVisibility, this.passwordVisibilityLabel]);
    this.loginForm.append([
      this.emailInputLabel,
      this.emailError,
      this.emailInput,
      this.passwordInputLabel,
      this.passwordError,
      this.passwordInput,
      this.visibilityWrapper,
      this.loginButton,
      this.registrationButton,
    ]);
    this.append([this.loginHint, this.loginForm]);
  }
}
