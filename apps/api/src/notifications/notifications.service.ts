import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

export interface Notification {
  id: number;
  data: CreateNotificationDto;
}

@Injectable()
export class NotificationsService {
  private notifications: Notification[] = [];
  private nextId = 1;

  // Existing helper methods
  async sendEmail(to: string, subject: string, content: string) {
    console.log(`[Email] To: ${to}, Subject: ${subject}, Content: ${content}`);
    // Integration with AWS SES or SendGrid would go here
    return { success: true };
  }

  async sendWhatsApp(to: string, message: string) {
    console.log(`[WhatsApp] To: ${to}, Message: ${message}`);
    // Integration with Meta Cloud API or Twilio would go here
    return { success: true };
  }

  // CRUD operations for notifications
  create(createNotificationDto: CreateNotificationDto) {
    const notification: Notification = {
      id: this.nextId++,
      data: createNotificationDto,
    };
    this.notifications.push(notification);
    return notification;
  }

  findAll() {
    return this.notifications;
  }

  findOne(id: number) {
    return this.notifications.find((n) => n.id === id);
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = this.findOne(id);
    if (notification) {
      notification.data = { ...notification.data, ...updateNotificationDto } as any;
    }
    return notification;
  }

  remove(id: number) {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index >= 0) {
      const [removed] = this.notifications.splice(index, 1);
      return removed;
    }
    return null;
  }
}
