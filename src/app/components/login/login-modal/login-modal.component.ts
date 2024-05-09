import './login-modal.scss';
import BaseComponent from '../../base/base.component';
import Button from '../../button/button.component';
import Image from '../../../assets/images/main-logo.png';

const EMAIL_REGEX = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
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

  passwordInput: BaseComponent<'input'>;

  passwordInputLabel: BaseComponent<'label'>;

  emailInputName: string = 'email';

  passwordInputName: string = 'password';

  passwordInputId: string = 'passwordId';

  loginButton: Button;

  constructor() {
    super('div', ['login_modal']);
    this.modalHeader = new BaseComponent('div', ['modal_header']);
    this.modalLogo = new BaseComponent('img', ['modal_logo']);
    this.modalName = new BaseComponent('p', ['modal_name'], 'Paws & Tails');
    this.modalHint = new BaseComponent('p', ['modal_hint'], 'Sign In');
    this.modalForm = new BaseComponent('form', ['modal_form']);
    this.emailInputLabel = new BaseComponent('label', ['modal_input-label'], 'Email');
    this.emailInput = new BaseComponent('input', ['modal_input']);
    this.passwordInputLabel = new BaseComponent('label', ['modal_input-label'], 'Password');
    this.passwordInput = new BaseComponent('input', ['modal_input']);
    this.loginButton = new Button({ text: 'Log In', onClick: LoginModal.handleFormSubmit });

    this.setupAttributes();
    this.setupElements();
    this.setupForm();
    this.setupListeners();
    this.render();
  }

  static handleFormSubmit(event: Event) {
    event?.preventDefault();
  }

  setupAttributes() {
    this.modalLogo.setAttribute('src', Image);
  }

  setupElements() {
    this.emailInput.setAttribute('type', 'text');
    this.emailInput.setAttribute('id', this.emailInputId);
    this.emailInputLabel.setAttribute('for', this.emailInputId);

    this.passwordInput.setAttribute('type', 'text');
    this.passwordInput.setAttribute('id', this.passwordInputId);
    this.passwordInputLabel.setAttribute('for', this.passwordInputId);

    this.loginButton.setAttribute('type', 'submit');
  }

  setupForm() {
    this.modalForm.setAttribute('novalidate', '');
    this.emailInput.setAttribute('required', '');
    this.emailInput.setAttribute('pattern', EMAIL_REGEX);
    this.emailInput.setAttribute('name', this.emailInputName);
    this.passwordInput.setAttribute('type', 'password');
    this.passwordInput.setAttribute('required', '');
    this.passwordInput.setAttribute('minlength', PASSWORD_MINLENGTH);
    this.passwordInput.setAttribute('pattern', PASSWORD_REGEX);
    this.passwordInput.setAttribute('name', this.passwordInputName);
  }

  setupListeners() {
    this.modalForm.addListener('submit', LoginModal.handleFormSubmit.bind(this));
  }

  render() {
    this.modalHeader.append([this.modalLogo, this.modalName]);
    this.modalForm.append([
      this.emailInputLabel,
      this.emailInput,
      this.passwordInputLabel,
      this.passwordInput,
      this.loginButton,
    ]);
    this.append([this.modalHeader, this.modalHint, this.modalForm]);
  }
}
