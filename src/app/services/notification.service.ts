import NotificationComponent from '../components/notification/notification.component';

class NotificationService {
  private notificationComponent = new NotificationComponent();

  notify(text: string) {
    this.notificationComponent.render(document.body, text);
  }
}

const notificationService = new NotificationService();

export default notificationService;
