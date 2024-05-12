import './login-modal.scss';
import BaseComponent from '../../base/base.component';
import Button from '../../button/button.component';
import Image from '../../../assets/images/main-logo.png';

const EMAIL_REGEX = '^[^\\s@]+@[^\\s@]+.[^\\s@]+$';
const PASSWORD_REGEX = '^[^\\s]*(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[^\\s]*$';
const PASSWORD_MINLENGTH = '8';

export default class LoginModal extends BaseComponent<'div'> {
  modalHeader: BaseComponent<'div'>;

  modalLogo: BaseComponent<'img'>;

  modalName: BaseComponent<'p'>;

  modalHint: BaseComponent<'p'>;

  modalForm: BaseComponent<'form'>;

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
    super('div', ['login_modal']);
    this.modalHeader = new BaseComponent('div', ['modal_header']);
    this.modalLogo = new BaseComponent('img', ['modal_logo']);
    this.modalName = new BaseComponent('p', ['modal_name'], 'Paws & Tails');
    this.modalHint = new BaseComponent('p', ['modal_hint'], 'Sign In');
    this.modalForm = new BaseComponent('form', ['modal_form']);
    this.emailInputLabel = new BaseComponent('label', ['modal_input-label'], 'Email');
    this.emailInput = new BaseComponent('input', ['modal_input']);
    this.emailError = new BaseComponent('span', ['modal_error']);
    this.passwordInputLabel = new BaseComponent('label', ['modal_input-label'], 'Password');
    this.passwordInput = new BaseComponent('input', ['modal_input']);
    this.passwordError = new BaseComponent('span', ['modal_error']);
    this.passwordVisibility = new BaseComponent('input');
    this.passwordVisibilityLabel = new BaseComponent(
      'label',
      ['modal_visibility'],
      'Show Password',
    );
    this.visibilityWrapper = new BaseComponent('div', ['visibility_wrapper']);
    this.loginButton = new Button({
      text: 'Log In',
      onClick: LoginModal.handleFormSubmit.bind(this),
    });
    this.registrationButton = new Button({
      text: 'Registration',
      onClick: () => {
        // TODO: add routing here
      },
    });
    this.loginButton.disable();
    this.setupAttributes();
    this.setupElements();
    this.setupListeners();
    this.render();
  }

  static handleFormSubmit(event: Event) {
    event?.preventDefault();
  }

  validateForm() {
    const emailErrorText = LoginModal.validateInputEmail(this.emailInput.getElement().validity);
    const passwordErrorText = LoginModal.validateInputPassword(
      this.passwordInput.getElement().validity,
    );

    if (emailErrorText) {
      LoginModal.showInputError(emailErrorText, this.emailError);
      this.loginButton.disable();
      return;
    }
    if (passwordErrorText) {
      LoginModal.showInputError(passwordErrorText, this.passwordError);
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

  setupAttributes() {
    this.modalLogo.setAttribute('src', Image);
  }

  setupElements() {
    this.modalForm.setAttribute('novalidate', '');

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
    this.modalForm.addListener('submit', LoginModal.handleFormSubmit.bind(this));
    this.modalForm.addListener('input', this.validateForm.bind(this));
    this.passwordVisibility.addListener('input', this.togglePasswordVisibility.bind(this));
    this.emailInput.addListener('input', () => {
      LoginModal.hideInputError(this.emailError);
    });
    this.passwordInput.addListener('input', () => {
      LoginModal.hideInputError(this.passwordError);
    });
  }

  render() {
    this.visibilityWrapper.append([this.passwordVisibility, this.passwordVisibilityLabel]);
    this.modalForm.append([
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
    this.append([this.modalHint, this.modalForm]);
  }
}
