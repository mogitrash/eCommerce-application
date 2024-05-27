import BaseComponent from '../base/base.component';
import './editable-item.scss';
import NotificationService from '../../services/notification.service';

type EditableItemComponentConfig = { title: string; value: string };

export default class EditableItemComponent extends BaseComponent<'div'> {
  private itemValue: string;

  private itemWrapper!: BaseComponent<'div'>;

  private notificationService = new NotificationService();

  constructor({ title, value }: EditableItemComponentConfig) {
    super({ tag: 'div', classes: ['editable-item'] });
    this.itemValue = value;
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
    this.notificationService.notify('Changes were saved');
  }

  private onCancelClick(): void {
    this.itemWrapper.getElement().innerHTML = '';
    this.createStaticItem();
  }
}
