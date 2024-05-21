import './profile.scss';
import BaseComponent from '../base/base.component';

export default class ProfileComponent extends BaseComponent<'div'> {
  constructor() {
    super({ tag: 'div', textContent: 'Profile' });
  }
}
