import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { notifications, notificationTemplates, users } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private configService: ConfigService,
  ) { }

  async sendNotification(
    templateCode: string,
    recipientId: number,
    variables: Record<string, any>,
    channels: ('email' | 'whatsapp' | 'sms')[] = ['email']
  ) {
    try {
      // 1. Get Template
      const template = await this.db.query.notificationTemplates.findFirst({
        where: eq(notificationTemplates.code, templateCode),
      });

      if (!template) {
        this.logger.error(`Template not found: ${templateCode}`);
        return;
      }

      // 2. Get Recipient
      const recipient = await this.db.query.users.findFirst({
        where: eq(users.id, recipientId),
      });

      if (!recipient) {
        this.logger.error(`Recipient not found: ${recipientId}`);
        return;
      }

      // 3. Process Template
      let message = template.template;
      Object.keys(variables).forEach((key) => {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
      });

      let subject = template.subject;
      if (subject) {
        Object.keys(variables).forEach((key) => {
          subject = subject!.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
        });
      }

      // 4. Send via Channels
      for (const channel of channels) {
        if (channel === 'email' && template.type === 'email') {
          await this.sendEmail(recipient.email, subject!, message);
        } else if (channel === 'whatsapp' && template.type === 'whatsapp') {
          await this.sendWhatsApp(recipient.phone!, message);
        }
      }

      // 5. Log Notification
      await this.db.insert(notifications).values({
        type: template.type,
        recipientId,
        recipientEmail: recipient.email,
        recipientPhone: recipient.phone,
        templateId: template.id,
        subject: subject,
        message,
        status: 'sent',
        sentAt: new Date(),
        metadata: variables,
      });

    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
    }
  }

  private async sendEmail(to: string, subject: string, body: string) {
    // Mock implementation or integration with AWS SES / SendGrid
    this.logger.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
    // console.log(body);
    // In production: await this.emailProvider.send(...)
  }

  private async sendWhatsApp(to: string, message: string) {
    // Mock implementation or integration with Twilio / Interakt
    this.logger.log(`[WHATSAPP] To: ${to}, Message: ${message}`);
    // In production: await this.whatsappProvider.send(...)
  }

  async findAll() {
    return this.db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async findOne(id: number) {
    const result = await this.db.select().from(notifications).where(eq(notifications.id, id));
    if (!result.length) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return result[0];
  }
}
