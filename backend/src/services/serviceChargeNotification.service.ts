import { IServiceCharge } from '../models/serviceCharge.model';
import { IExhibition } from '../models/exhibition.model';
import { createNotification } from '../controllers/notification.controller';
import { NotificationType, NotificationPriority } from '../models/notification.model';
import nodemailer from 'nodemailer';
import Exhibition from '../models/exhibition.model';
import User from '../models/user.model';

export class ServiceChargeNotificationService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.setupEmailTransporter();
  }

  /**
   * Setup email transporter
   */
  private setupEmailTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Notify admin about new service charge payment
   * @param serviceCharge Service charge details
   * @param exhibition Exhibition details
   */
  async notifyNewServiceCharge(serviceCharge: IServiceCharge, exhibition: IExhibition): Promise<void> {
    try {
      console.log('[Service Charge Notification] Sending notification for:', serviceCharge.receiptNumber);

      // Get exhibition owner and assigned users
      const notificationRecipients = await this.getNotificationRecipients(exhibition);

      // Create in-app notifications for all recipients
      await this.createInAppNotifications(serviceCharge, exhibition, notificationRecipients);

      // DISABLED: Email notifications for fast payment processing
      // await this.sendEmailNotifications(serviceCharge, exhibition, notificationRecipients);
      console.log('[Service Charge Notification] Email notifications disabled for fast payment processing');

      console.log('[Service Charge Notification] Notifications sent successfully');
    } catch (error) {
      console.error('[Service Charge Notification] Error sending notifications:', error);
    }
  }

  /**
   * Get users who should receive notifications for this exhibition
   * @param exhibition Exhibition details
   * @returns Array of user IDs
   */
  private async getNotificationRecipients(exhibition: IExhibition): Promise<string[]> {
    const recipients: string[] = [];

    // Add exhibition creator
    recipients.push(exhibition.createdBy.toString());

    // Add assigned users
    if (exhibition.assignedUsers && exhibition.assignedUsers.length > 0) {
      exhibition.assignedUsers.forEach(userId => {
        const userIdStr = userId.toString();
        if (!recipients.includes(userIdStr)) {
          recipients.push(userIdStr);
        }
      });
    }

    return recipients;
  }

  /**
   * Create in-app notifications
   * @param serviceCharge Service charge details
   * @param exhibition Exhibition details
   * @param recipients Array of user IDs
   */
  private async createInAppNotifications(
    serviceCharge: IServiceCharge,
    exhibition: IExhibition,
    recipients: string[]
  ): Promise<void> {
    try {
      const notificationPromises = recipients.map(async (userId) => {
        return createNotification(
          userId,
          'admin',
          'New Service Charge Payment',
          `Payment of ₹${serviceCharge.amount.toLocaleString('en-IN')} received from ${serviceCharge.vendorName} for ${exhibition.name}`,
          NotificationType.PAYMENT_RECEIVED,
          {
            priority: NotificationPriority.MEDIUM,
            entityId: serviceCharge._id.toString(),
            entityType: 'ServiceCharge',
            data: {
              serviceChargeId: serviceCharge._id.toString(),
              exhibitionId: exhibition._id.toString(),
              receiptNumber: serviceCharge.receiptNumber,
              amount: serviceCharge.amount,
              vendorName: serviceCharge.vendorName,
              serviceType: serviceCharge.serviceType
            }
          }
        );
      });

      await Promise.all(notificationPromises);
      console.log('[Service Charge Notification] In-app notifications created for', recipients.length, 'users');
    } catch (error) {
      console.error('[Service Charge Notification] Error creating in-app notifications:', error);
    }
  }

  /**
   * Send email notifications to admin users
   * @param serviceCharge Service charge details
   * @param exhibition Exhibition details
   * @param recipients Array of user IDs
   */
  private async sendEmailNotifications(
    serviceCharge: IServiceCharge,
    exhibition: IExhibition,
    recipients: string[]
  ): Promise<void> {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('[Service Charge Notification] Email credentials not configured, skipping email notifications');
        return;
      }

      // Get user details for email addresses
      const users = await User.find({ _id: { $in: recipients } }).select('email username');

      const emailPromises = users.map(async (user) => {
        if (user.email) {
          return this.sendServiceChargeEmail(serviceCharge, exhibition, user.email, user.username);
        }
      });

      await Promise.all(emailPromises.filter(Boolean));
      console.log('[Service Charge Notification] Email notifications sent to', users.length, 'users');
    } catch (error) {
      console.error('[Service Charge Notification] Error sending email notifications:', error);
    }
  }

  /**
   * Send individual email notification
   * @param serviceCharge Service charge details
   * @param exhibition Exhibition details
   * @param emailAddress Recipient email address
   * @param username Recipient username
   */
  private async sendServiceChargeEmail(
    serviceCharge: IServiceCharge,
    exhibition: IExhibition,
    emailAddress: string,
    username: string
  ): Promise<void> {
    try {
      const emailSubject = `New Service Charge Payment - ${exhibition.name}`;
      const emailHtml = this.generateEmailTemplate(serviceCharge, exhibition, username);

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: emailAddress,
        subject: emailSubject,
        html: emailHtml
      };

      await this.transporter.sendMail(mailOptions);
      console.log('[Service Charge Notification] Email sent to:', emailAddress);
    } catch (error) {
      console.error('[Service Charge Notification] Error sending email to:', emailAddress, error);
    }
  }

  /**
   * Generate email template for service charge notification
   * @param serviceCharge Service charge details
   * @param exhibition Exhibition details
   * @param username Recipient username
   * @returns HTML email template
   */
  private generateEmailTemplate(
    serviceCharge: IServiceCharge,
    exhibition: IExhibition,
    username: string
  ): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Charge Payment Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #fff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background: #7C3AED;
                color: white;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 30px;
            }
            .info-box {
                background: #f8f9fa;
                border-left: 4px solid #7C3AED;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .info-row {
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .info-label {
                font-weight: bold;
                color: #555;
            }
            .info-value {
                color: #333;
            }
            .amount {
                font-size: 20px;
                font-weight: bold;
                color: #28a745;
                text-align: center;
                padding: 15px;
                background: #d4edda;
                border-radius: 5px;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background: #7C3AED;
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💰 Service Charge Payment Received</h1>
            </div>
            
            <div class="content">
                <p>Hello ${username},</p>
                
                <p>A new service charge payment has been received for your exhibition. Here are the details:</p>
                
                <div class="info-box">
                    <h3 style="margin-top: 0; color: #7C3AED;">Payment Details</h3>
                    <div class="info-row">
                        <span class="info-label">Receipt Number:</span>
                        <span class="info-value">${serviceCharge.receiptNumber}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Payment Date:</span>
                        <span class="info-value">${new Date(serviceCharge.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Payment Status:</span>
                        <span class="info-value" style="color: #28a745; font-weight: bold;">
                            ${serviceCharge.paymentStatus.toUpperCase()}
                        </span>
                    </div>
                </div>
                
                <div class="amount">
                    Amount: ₹${serviceCharge.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                
                <div class="info-box">
                    <h3 style="margin-top: 0; color: #7C3AED;">Vendor Information</h3>
                    <div class="info-row">
                        <span class="info-label">Name:</span>
                        <span class="info-value">${serviceCharge.vendorName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Company:</span>
                        <span class="info-value">${serviceCharge.companyName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Phone:</span>
                        <span class="info-value">${serviceCharge.vendorPhone}</span>
                    </div>
                    ${serviceCharge.stallNumber ? `
                    <div class="info-row">
                        <span class="info-label">Stall Number:</span>
                        <span class="info-value">${serviceCharge.stallNumber}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="info-box">
                    <h3 style="margin-top: 0; color: #7C3AED;">Service Information</h3>
                    <div class="info-row">
                        <span class="info-label">Service Type:</span>
                        <span class="info-value">${serviceCharge.serviceType.charAt(0).toUpperCase() + serviceCharge.serviceType.slice(1)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Exhibition:</span>
                        <span class="info-value">${exhibition.name}</span>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/service-charges" class="button">
                        View in Dashboard
                    </a>
                </div>
                
                <p style="margin-top: 30px;">
                    You can view all service charge payments and manage them from your admin dashboard.
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated notification from your Exhibition Management System.</p>
                <p>If you have any questions, please contact your system administrator.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Notify admin about payment failure
   * @param serviceCharge Service charge details
   * @param exhibition Exhibition details
   * @param errorMessage Error message
   */
  async notifyPaymentFailure(
    serviceCharge: IServiceCharge,
    exhibition: IExhibition,
    errorMessage: string
  ): Promise<void> {
    try {
      console.log('[Service Charge Notification] Sending payment failure notification');

      const recipients = await this.getNotificationRecipients(exhibition);

      // Create in-app notifications for payment failure
      const notificationPromises = recipients.map(async (userId) => {
        return createNotification(
          userId,
          'admin',
          'Service Charge Payment Failed',
          `Payment attempt failed for ${serviceCharge.vendorName} - ${exhibition.name}. Error: ${errorMessage}`,
          NotificationType.SYSTEM_MESSAGE,
          {
            priority: NotificationPriority.HIGH,
            entityId: serviceCharge._id.toString(),
            entityType: 'ServiceCharge',
            data: {
              serviceChargeId: serviceCharge._id.toString(),
              exhibitionId: exhibition._id.toString(),
              receiptNumber: serviceCharge.receiptNumber,
              errorMessage
            }
          }
        );
      });

      await Promise.all(notificationPromises);
      console.log('[Service Charge Notification] Payment failure notifications sent');
    } catch (error) {
      console.error('[Service Charge Notification] Error sending payment failure notifications:', error);
    }
  }

  /**
   * Send receipt email to vendor
   * @param serviceCharge Service charge details
   * @param exhibition Exhibition details
   * @param receiptPath Path to receipt PDF
   */
  async sendReceiptToVendor(
    serviceCharge: IServiceCharge,
    exhibition: IExhibition,
    receiptPath: string
  ): Promise<void> {
    try {
      // Since vendor email is no longer collected, skip email sending
      console.log('[Service Charge Notification] Vendor email not available, skipping receipt email for:', serviceCharge.receiptNumber);
      return;
    } catch (error) {
      console.error('[Service Charge Notification] Error in sendReceiptToVendor:', error);
    }
  }

  /**
   * Generate receipt email template for vendor (DEPRECATED - vendor email no longer collected)
   * @param serviceCharge Service charge details
   * @param exhibition Exhibition details
   * @returns HTML email template
   */
  private generateReceiptEmailTemplate(
    serviceCharge: IServiceCharge,
    exhibition: IExhibition
  ): string {
    // This function is deprecated since vendor email is no longer collected
    return '';
  }
}

// Export singleton instance
export const serviceChargeNotificationService = new ServiceChargeNotificationService(); 