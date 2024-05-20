import './login.scss';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PASSWORD_MINLENGTH,
} from '../../models/constants/login-registration.constants';
import AuthenticationService from '../../services/authentication.service';
import CustomerSignIn from '../../models/customer-sign-in.model';
import NotificationService from '../../services/notification.service';

export default class LoginComponent extends BaseComponent<'div'> {
  private loginHint: BaseComponent<'p'>;

  public loginForm: BaseComponent<'form'>;

  private emailInput: BaseComponent<'input'>;

  private emailInputLabel: BaseComponent<'label'>;

  private emailInputId: string = 'emailId';

  public emailError: BaseComponent<'span'>;

  private passwordInput: BaseComponent<'input'>;

  private passwordInputLabel: BaseComponent<'label'>;

  private emailInputName: string = 'email';

  private passwordInputName: string = 'password';

  private passwordInputId: string = 'passwordId';

  public passwordError: BaseComponent<'span'>;

  private passwordVisibility: BaseComponent<'input'>;

  private passwordVisibilityLabel: BaseComponent<'label'>;

  private passwordVisibilityId: string = 'visibilityId';

  private visibilityWrapper: BaseComponent<'div'>;

  private emailInputWrapper: BaseComponent<'div'>;

  private passwordInputWrapper: BaseComponent<'div'>;

  public loginButton: Button;

  private registrationButton: Button;

  private authenticationService = new AuthenticationService();

  private notificationService = new NotificationService();

  constructor() {
    super({ tag: 'div', classes: ['login_modal'] });
    this.loginHint = new BaseComponent({
      tag: 'p',
      classes: ['modal_hint'],
      textContent: 'Sign In',
    });
    this.loginForm = new BaseComponent({ tag: 'form', classes: ['modal_form'] });
    this.emailInputWrapper = new BaseComponent({ tag: 'div', classes: ['modal_input-wrapper'] });
    this.emailInputLabel = new BaseComponent({
      tag: 'label',
      classes: ['modal_input-label'],
      textContent: 'Email',
    });
    this.emailInput = new BaseComponent({ tag: 'input', classes: ['modal_input'] });
    this.emailError = new BaseComponent({ tag: 'span', classes: ['modal_error'] });
    this.passwordInputWrapper = new BaseComponent({ tag: 'div', classes: ['modal_input-wrapper'] });
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
    });
    this.registrationButton = new Button({
      text: 'Registration',
      onClick: () => {
        // TODO routinghere
      },
    });
    this.loginButton.disable();
    this.setupElements();
    this.setupListeners();
    this.render();
  }

  public validateForm() {
    const emailErrorText = LoginComponent.validateInputEmail(this.emailInput.getElement().validity);
    const passwordErrorText = LoginComponent.validateInputPassword(
      this.passwordInput.getElement().validity,
    );

    if (emailErrorText) {
      LoginComponent.showInputError(emailErrorText, this.emailError);
      this.loginButton.disable();
      return;
    }
    if (passwordErrorText) {
      LoginComponent.showInputError(passwordErrorText, this.passwordError);
      this.loginButton.disable();
      return;
    }
    this.loginButton.enable();
  }

  private togglePasswordVisibility() {
    if (this.passwordInput.getAttribute('type') === 'password') {
      this.passwordInput.setAttribute('type', 'text');
    } else {
      this.passwordInput.setAttribute('type', 'password');
    }
  }

  public static validateInputPassword(validity: ValidityState): string {
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

  public static validateInputEmail(validity: ValidityState): string {
    if (validity.patternMismatch) {
      return 'Email address must be properly formatted (e.g., user@example.com). Whitespaces are not allowed.';
    }
    if (validity.valueMissing) {
      return 'Please enter value.';
    }
    return '';
  }

  public static showInputError(errorText: string, errorComponent: BaseComponent<'span'>) {
    errorComponent.addClass('modal_error--shown');
    errorComponent.setTextContent(errorText);
  }

  private static hideInputError(errorComponent: BaseComponent<'span'>) {
    errorComponent.removeClass('modal_error--shown');
    errorComponent.setTextContent('');
  }

  private setupElements() {
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

  private async handleFormSubmit(event: Event) {
    event?.preventDefault();
    if (event.target instanceof HTMLFormElement) {
      const customerSignIn: CustomerSignIn = {
        email: this.emailInput.getElement().value,
        password: this.passwordInput.getElement().value,
      };

      const response = await this.authenticationService.signInCustomer(customerSignIn);

      if ('customer' in response) {
        // TODO: add routing to main page here
        event.target.reset();
        this.notificationService.notify('You logged in');
      } else {
        this.notificationService.notify('Incorrect email or password. Please try again.');
      }
    }
  }

  private setupListeners() {
    this.loginForm.addListener('submit', this.handleFormSubmit.bind(this));
    this.loginForm.addListener('input', this.validateForm.bind(this));
    this.passwordVisibility.addListener('input', this.togglePasswordVisibility.bind(this));
    this.emailInput.addListener('input', () => {
      LoginComponent.hideInputError(this.emailError);
    });
    this.passwordInput.addListener('input', () => {
      LoginComponent.hideInputError(this.passwordError);
    });
  }

  private render() {
    this.visibilityWrapper.append([this.passwordVisibility, this.passwordVisibilityLabel]);
    this.emailInputWrapper.append([this.emailInputLabel, this.emailInput, this.emailError]);
    this.passwordInputWrapper.append([
      this.passwordInputLabel,
      this.passwordInput,
      this.passwordError,
      this.visibilityWrapper,
    ]);
    this.loginForm.append([
      this.emailInputWrapper,
      this.passwordInputWrapper,
      this.loginButton,
      this.registrationButton,
    ]);
    this.append([this.loginHint, this.loginForm]);
  }
}
