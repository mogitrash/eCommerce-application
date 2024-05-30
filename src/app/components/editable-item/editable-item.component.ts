import { SUPPORTED_COUNTRIES } from '../../models/constants/login-registration.constants';
import Country from '../../models/country.model';
import BaseComponent from '../base/base.component';
import InputDateComponent from '../input/input-date.component';
import InputTextComponent from '../input/input-text.component';
import SelectComponent from '../select/select.component';
import './editable-item.scss';

type EditableItemType = 'text' | 'date' | 'password' | 'countrySelect';

type EditableItemComponentConfig = {
  title: string;
  value: string;
  onSave: (newValue: string | Country) => void;
  type?: EditableItemType;
  pattern?: string;
  validator?: (validity: Partial<ValidityState>, newValue?: string) => string;
};

export default class EditableItemComponent extends BaseComponent<'div'> {
  private itemValue: string | Country;

  private editableInput!: InputTextComponent | InputDateComponent | SelectComponent;

  private type: EditableItemType;

  private pattern?: string;

  private validator?: (validity: Partial<ValidityState>, newValue?: string) => string;

  private onSave: (newValue: string | Country) => void;

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

  private createEditableItem(): void {
    this.editableInput = this.createEditableInput();
    this.saveButton = new BaseComponent({
      tag: 'button',
      classes: ['editable-item_button', 'editable-item_button--save'],
    });
    const cancelButton = new BaseComponent({
      tag: 'button',
      classes: ['editable-item_button', 'editable-item_button--cancel'],
    });
    this.saveButton.addListener('click', () => this.onSaveClick(this.editableInput.input));
    cancelButton.addListener('click', this.onCancelClick.bind(this));
    this.itemWrapper.append([this.editableInput, this.saveButton, cancelButton]);
  }

  private createEditableInput(): InputTextComponent | InputDateComponent | SelectComponent {
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
    editableInput.input.addListener('input', this.onInputValue.bind(this));
    return editableInput;
  }

  private onInputValue(event: Event): void {
    if (!this.validator) return;
    const error = this.validator(
      this.editableInput.getValidity(),
      (event.target as HTMLInputElement).value,
    );
    if (error) {
      this.editableInput.showError(error);
      this.saveButton.setAttribute('disabled', '');
    } else {
      this.saveButton.removeAttribute('disabled');
    }
  }

  private onEditClick(): void {
    this.itemWrapper.getElement().innerHTML = '';
    this.createEditableItem();
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
