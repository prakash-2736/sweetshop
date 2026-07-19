import { createTransport } from "nodemailer";

// Check SMTP settings in process environment
const isEmailConfigured =
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

let transporter = null;
if (isEmailConfigured) {
  transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log("📨 Nodemailer SMTP transport initialized successfully.");
} else {
  console.warn("⚠️ SMTP configuration missing in environment. Email notifications will be simulated in console.");
}

class NotificationService {
  /**
   * Send arbitrary email
   */
  async sendEmail({ to, subject, html }) {
    if (isEmailConfigured && transporter) {
      try {
        const info = await transporter.sendMail({
          from: `"${process.env.SMTP_FROM_NAME || "SweetShop"}" <${process.env.SMTP_FROM_EMAIL || "no-reply@sweetshop.com"}>`,
          to,
          subject,
          html,
        });
        console.log(`[Notification Email Success] Sent email to ${to}. Message ID: ${info.messageId}`);
        return true;
      } catch (err) {
        console.error(`[Notification Email Error] Failed to send to ${to}:`, err);
        return false;
      }
    } else {
      console.log(`\n=================== [SIMULATED EMAIL] ===================`);
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body:    (HTML snippet) ${html.substring(0, 300)}...`);
      console.log(`==========================================================\n`);
      return true;
    }
  }

  /**
   * Send Order Confirmation Email
   */
  async sendOrderConfirmation(user, order) {
    const subject = `Order Confirmed - Your SweetShop Order #${order.orderId}`;

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.weight})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
      </tr>`
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #d97706; text-align: center;">Thank You for Your Order!</h2>
        <p>Hi ${user.name},</p>
        <p>Your order <strong>#${order.orderId}</strong> has been successfully placed. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Item</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="text-align: right; line-height: 1.6;">
          <p>Subtotal: <strong>₹${order.subtotal.toFixed(2)}</strong></p>
          <p>GST Tax (5%): <strong>₹${order.tax.toFixed(2)}</strong></p>
          <p>Shipping Charge: <strong>₹${order.shippingCharge.toFixed(2)}</strong></p>
          ${order.discount > 0 ? `<p style="color: green;">Discount: <strong>-₹${order.discount.toFixed(2)}</strong></p>` : ""}
          <h3 style="color: #d97706;">Total: ₹${order.total.toFixed(2)}</h3>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">This is an automated email. Please do not reply directly.</p>
      </div>`;

    return this.sendEmail({ to: user.email, subject, html });
  }

  /**
   * Send Order Status Update Email
   */
  async sendOrderStatusUpdate(user, order) {
    const subject = `Order Updated - #${order.orderId} Status: ${order.orderStatus}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #d97706;">Order Status Update</h2>
        <p>Hi ${user.name},</p>
        <p>The status of your order <strong>#${order.orderId}</strong> has been updated to: <span style="font-weight: bold; color: #d97706;">${order.orderStatus}</span>.</p>
        <p>You can track the progress in your dashboard or view transaction details.</p>
        <p>Thank you for choosing SweetShop!</p>
      </div>`;
    return this.sendEmail({ to: user.email, subject, html });
  }

  // Interfaces/Placeholders for SMS, WhatsApp, and Push
  async sendSMS(phoneNumber, message) {
    console.log(`[SMS Simulation] To: ${phoneNumber} | Message: ${message}`);
    return true;
  }

  async sendWhatsApp(phoneNumber, message) {
    console.log(`[WhatsApp Simulation] To: ${phoneNumber} | Message: ${message}`);
    return true;
  }

  async sendPushNotification(userId, title, body) {
    console.log(`[Push Notification Simulation] To User: ${userId} | Title: ${title} | Body: ${body}`);
    return true;
  }
}

export default new NotificationService();
