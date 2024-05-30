import Country from '../../models/country.model';
import BaseComponent from '../base/base.component';
import './editable-item.scss';

type EditableItemComponentConfig = {
  title: string;
  value: string;
  onSave: (newValue: string | Country) => void;
};

export default class EditableItemComponent extends BaseComponent<'div'> {
  private itemValue: string | Country;

  private onSave: (newValue: string | Country) => void;

  private itemWrapper!: BaseComponent<'div'>;

  constructor({ title, value, onSave }: EditableItemComponentConfig) {
    super({ tag: 'div', classes: ['editable-item'] });
    this.itemValue = value;
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
    const editableItemValue = new BaseComponent({
      tag: 'p',
      classes: ['editable-item_value'],
      textContent: this.itemValue,
    });
    const editButton = new BaseComponent({
      tag: 'button',
      classes: ['editable-item_button', 'editable-item_button--edit'],
    });
    editButton.addListener('click', this.onEditClick.bind(this));
    this.itemWrapper.append([editableItemValue, editButton]);
  }

  private createEditableItem(): void {
    const editableItemValue = new BaseComponent({
      tag: 'input',
      classes: ['editable-item_value'],
    });
    const saveButton = new BaseComponent({
      tag: 'button',
      classes: ['editable-item_button', 'editable-item_button--save'],
    });
    const cancelButton = new BaseComponent({
      tag: 'button',
      classes: ['editable-item_button', 'editable-item_button--cancel'],
    });
    editableItemValue.setAttribute('value', this.itemValue);
    editableItemValue.addListener('input', this.onInputValue.bind(this));
    saveButton.addListener('click', () => this.onSaveClick(editableItemValue));
    cancelButton.addListener('click', this.onCancelClick.bind(this));
    this.itemWrapper.append([editableItemValue, saveButton, cancelButton]);
  }

  private onInputValue(event: Event): void {
    console.log((event.target as HTMLInputElement).value);
    console.log(this.itemValue);
  }

  private onEditClick(): void {
    this.itemWrapper.getElement().innerHTML = '';
    this.createEditableItem();
  }

  private onSaveClick(inputComponent: BaseComponent<'input'>): void {
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
