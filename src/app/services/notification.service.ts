import NotificationComponent from '../components/notification/notification.component';

export default class NotificationService {
  private notificationComponent = new NotificationComponent();

  notify(text: string, style?: 'success' | 'error') {
    this.notificationComponent.render(document.body, text, style);
  }
}
