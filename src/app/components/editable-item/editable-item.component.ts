import {
  PASSWORD_MINLENGTH,
  PASSWORD_REGEX,
  SUPPORTED_COUNTRIES,
} from '../../models/constants/login-registration.constants';
import Country from '../../models/country.model';
import BaseComponent from '../base/base.component';
import InputDateComponent from '../input/input-date.component';
import InputPasswordComponent from '../input/input-password.component';
import InputTextComponent from '../input/input-text.component';
import SelectComponent from '../select/select.component';
import './editable-item.scss';

type EditableItemType = 'text' | 'date' | 'password' | 'countrySelect';

type EditableItemInputType = InputTextComponent | InputDateComponent | SelectComponent;

type EditableItemComponentConfig = {
  title: string;
  value: string;
  onSave: (newValue: string | Country, currentValue?: string) => void;
  type?: EditableItemType;
  pattern?: string;
  validator?: (validity: Partial<ValidityState>, newValue?: string) => string;
};

export default class EditableItemComponent extends BaseComponent<'div'> {
  private itemValue: string | Country;

  private type: EditableItemType;

  private pattern?: string;

  private validator?: (validity: Partial<ValidityState>, newValue?: string) => string;

  private onSave: (newValue: string | Country, currentValue?: string) => void;

  private saveButton!: BaseComponent<'button'>;

  private itemWrapper!: BaseComponent<'div'>;

  constructor({ title, value, onSave, type, pattern, validator }: EditableItemComponentConfig) {
    super({ tag: 'div', classes: ['editable-item'] });
    this.itemValue = value;
    this.type = type || 'text';
    if (pattern) {
      this.pattern = pattern;
    }
    if (validator) {
      this.validator = validator;
    }
    this.onSave = onSave;
    this.createInitialItem(title);
  }

  private createInitialItem(title: string): void {
    this.itemWrapper = new BaseComponent({ tag: 'div', classes: ['editable-item_wrapper'] });
    const editableItemTitle = new BaseComponent({
      tag: 'p',
      classes: ['editable-item_title'],
      textContent: title,
    });
    this.createStaticItem();
    this.append([editableItemTitle, this.itemWrapper]);
  }

  private createStaticItem(): void {
    let textContent;
    if (this.type === 'countrySelect') {
      textContent = SUPPORTED_COUNTRIES.find(({ value }) => value === this.itemValue)?.label;
    } else {
      textContent = this.itemValue;
    }
    const editableItemValue = new BaseComponent({
      tag: 'p',
      classes: ['editable-item_value'],
      textContent,
    });
    const editButton = new BaseComponent({
      tag: 'button',
      classes: ['editable-item_button', 'editable-item_button--edit'],
    });
    editButton.addListener('click', this.onEditClick.bind(this));
    this.itemWrapper.append([editableItemValue, editButton]);
  }

  private static createEditableControls(): BaseComponent<'button'>[] {
    return [
      new BaseComponent({
        tag: 'button',
        classes: ['editable-item_button', 'editable-item_button--save'],
      }),
      new BaseComponent({
        tag: 'button',
        classes: ['editable-item_button', 'editable-item_button--cancel'],
      }),
    ];
  }

  private createEditableItem(): void {
    const editableInput = this.createEditableInput();
    const [saveButton, cancelButton] = EditableItemComponent.createEditableControls();
    this.saveButton = saveButton;
    this.saveButton.addListener('click', () => this.onSaveClick(editableInput.input));
    cancelButton.addListener('click', this.onCancelClick.bind(this));
    this.itemWrapper.append([editableInput, this.saveButton, cancelButton]);
  }

  private createEditablePassword(): void {
    this.addClass('editable-item--password');
    const currentPassword = new InputPasswordComponent({
      required: true,
      labelText: 'Current',
      pattern: PASSWORD_REGEX,
      minlength: PASSWORD_MINLENGTH,
    });
    const newPassword = new InputPasswordComponent({
      required: true,
      labelText: 'New',
      pattern: PASSWORD_REGEX,
      minlength: PASSWORD_MINLENGTH,
    });
    const [saveButton, cancelButton] = EditableItemComponent.createEditableControls();
    this.saveButton = saveButton;
    currentPassword.input.addListener('input', (event: Event) => {
      return this.onInputValue(event, currentPassword);
    });
    newPassword.input.addListener('input', (event: Event) => {
      return this.onInputValue(event, newPassword);
    });
    this.saveButton.addListener('click', () => {
      this.removeClass('editable-item--password');
      this.onPasswordSaveClick(currentPassword.input, newPassword.input);
    });
    cancelButton.addListener('click', () => {
      this.removeClass('editable-item--password');
      this.onCancelClick();
    });
    this.itemWrapper.append([currentPassword, newPassword, this.saveButton, cancelButton]);
  }

  private createEditableInput(): EditableItemInputType {
    let editableInput;
    switch (this.type) {
      case 'date':
        editableInput = new InputDateComponent({
          required: true,
          minYearDelta: 13,
        });
        break;
      case 'countrySelect':
        editableInput = new SelectComponent({
          required: true,
          options: [{ label: 'Please choose an option', value: '' }, ...SUPPORTED_COUNTRIES],
        });
        break;

      default:
        editableInput = new InputTextComponent({
          required: true,
          pattern: this.pattern as string,
        });
    }
    editableInput.input.addClass('editable-item_value');
    editableInput.input.setAttribute('value', this.itemValue);
    editableInput.input.addListener('input', (event: Event) => {
      return this.onInputValue(event, editableInput);
    });
    return editableInput;
  }

  private onInputValue(event: Event, editableInput: EditableItemInputType): void {
    if (!this.validator) return;
    const error = this.validator(
      editableInput.getValidity(),
      (event.target as HTMLInputElement).value,
    );
    if (error) {
      editableInput.showError(error);
      this.saveButton.setAttribute('disabled', '');
    } else {
      this.saveButton.removeAttribute('disabled');
    }
  }

  private onEditClick(): void {
    this.itemWrapper.getElement().innerHTML = '';
    if (this.type === 'password') {
      this.createEditablePassword();
    } else {
      this.createEditableItem();
    }
  }

  private onPasswordSaveClick(
    currentPasswordInput: BaseComponent<'input'>,
    newPasswordInput: BaseComponent<'input'>,
  ): void {
    const newPasswordValue = newPasswordInput.getElement().value;
    const currentPasswordValue = currentPasswordInput.getElement().value;
    this.itemWrapper.getElement().innerHTML = '';
    this.createStaticItem();
    this.onSave(newPasswordValue, currentPasswordValue);
  }

  private onSaveClick(inputComponent: BaseComponent<'input'> | BaseComponent<'select'>): void {
    this.itemValue = inputComponent.getElement().value;
    this.itemWrapper.getElement().innerHTML = '';
    this.createStaticItem();
    this.onSave(this.itemValue);
  }

  private onCancelClick(): void {
    this.itemWrapper.getElement().innerHTML = '';
    this.createStaticItem();
  }
}
