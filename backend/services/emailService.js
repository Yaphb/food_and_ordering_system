const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  generateOrderReceiptHTML(order) {
    const formatCurrency = (amount) => `RM${parseFloat(amount).toFixed(2)}`;
    const formatDate = (date) => new Date(date).toLocaleDateString('en-MY', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsHTML = order.items.map(item => `
      <div class="item-row">
        <div class="item-name">${item.menuItem.name}</div>
        <div class="item-qty">×${item.quantity}</div>
        <div class="item-price">${formatCurrency(item.subtotal)}</div>
      </div>
    `).join('');

    const deliveryFee = order.deliveryType === 'delivery' ? 5 : 0;
    const subtotal = order.totalPrice - deliveryFee;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Receipt</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #1a1a1a;
            background-color: #ffffff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          .email-container {
            max-width: 480px;
            margin: 0 auto;
            background: #ffffff;
          }
          
          .receipt-header {
            text-align: center;
            padding: 48px 24px 32px;
            border-bottom: 1px solid #e8e8e8;
          }
          
          .receipt-title {
            font-size: 28px;
            font-weight: 700;
            color: #000000;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
          }
          
          .receipt-subtitle {
            font-size: 14px;
            color: #666666;
            font-weight: 400;
          }
          
          .order-info {
            padding: 32px 24px;
            background: #fafafa;
          }
          
          .info-item {
            display: block;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e8e8e8;
          }
          
          .info-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          
          .info-label {
            font-size: 11px;
            font-weight: 600;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            display: block;
          }
          
          .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            display: block;
          }
          
          .items-section {
            padding: 32px 24px;
          }
          
          .section-header {
            font-size: 11px;
            font-weight: 600;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e8e8e8;
          }
          
          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;
          }
          
          .item-row:last-child {
            border-bottom: none;
          }
          
          .item-name {
            flex: 1;
            font-size: 15px;
            font-weight: 500;
            color: #1a1a1a;
          }
          
          .item-qty {
            font-size: 14px;
            color: #666666;
            margin: 0 16px;
            min-width: 40px;
            text-align: center;
          }
          
          .item-price {
            font-size: 15px;
            font-weight: 600;
            color: #1a1a1a;
            min-width: 80px;
            text-align: right;
          }
          
          .totals-section {
            padding: 24px;
            background: #f8f8f8;
            border-top: 1px solid #e8e8e8;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .total-row:last-child {
            margin-bottom: 0;
            padding-top: 12px;
            border-top: 1px solid #e8e8e8;
            font-weight: 700;
            font-size: 18px;
          }
          
          .total-label {
            font-size: 14px;
            color: #666666;
          }
          
          .total-value {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
          }
          
          .total-row:last-child .total-label,
          .total-row:last-child .total-value {
            font-size: 18px;
            color: #000000;
          }
          
          .delivery-section {
            padding: 32px 24px;
            background: #ffffff;
          }
          
          .delivery-header {
            font-size: 11px;
            font-weight: 600;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
          }
          
          .delivery-detail {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.4;
          }
          
          .delivery-label {
            font-weight: 600;
            color: #1a1a1a;
            display: inline-block;
            min-width: 80px;
          }
          
          .delivery-value {
            color: #666666;
          }
          
          .footer {
            text-align: center;
            padding: 32px 24px;
            border-top: 1px solid #e8e8e8;
            background: #fafafa;
          }
          
          .footer-text {
            font-size: 12px;
            color: #888888;
            line-height: 1.4;
          }
          
          @media (max-width: 600px) {
            .email-container {
              margin: 0;
            }
            
            .receipt-header {
              padding: 32px 20px 24px;
            }
            
            .receipt-title {
              font-size: 24px;
            }
            
            .order-info,
            .items-section,
            .delivery-section,
            .footer {
              padding-left: 20px;
              padding-right: 20px;
            }
            
            .totals-section {
              padding: 20px;
            }
            
            .info-item {
              margin-bottom: 12px;
              padding-bottom: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="receipt-header">
            <div class="receipt-title">Receipt</div>
            <div class="receipt-subtitle">Order confirmation</div>
          </div>
          
          <div class="order-info">
            <div class="info-item">
              <div class="info-label">Order ID:</div>
              <div class="info-value">#${order.id}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Date:</div>
              <div class="info-value">${formatDate(order.createdAt)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Customer:</div>
              <div class="info-value">${order.user.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Status:</div>
              <div class="info-value" style="text-transform: capitalize;">${order.status}</div>
            </div>
          </div>

          <div class="items-section">
            <div class="section-header">Items Ordered</div>
            ${itemsHTML}
          </div>

          <div class="totals-section">
            <div class="total-row">
              <div class="total-label">Subtotal: </div>
              <div class="total-value">${formatCurrency(subtotal)}</div>
            </div>
            ${deliveryFee > 0 ? `
            <div class="total-row">
              <div class="total-label">Delivery Fee: </div>
              <div class="total-value">${formatCurrency(deliveryFee)}</div>
            </div>
            ` : ''}
            <div class="total-row">
              <div class="total-label">Total: </div>
              <div class="total-value">${formatCurrency(order.totalPrice)}</div>
            </div>
          </div>

          <div class="delivery-section">
            <div class="delivery-header">${order.deliveryType === 'delivery' ? 'Delivery Information' : 'Pickup Information'}</div>
            ${order.deliveryType === 'delivery' 
              ? `<div class="delivery-detail">
                   <span class="delivery-label">Address: </span>
                   <span class="delivery-value">${order.deliveryAddress}</span>
                 </div>`
              : `<div class="delivery-detail">
                   <span class="delivery-label">Time: </span>
                   <span class="delivery-value">${formatDate(order.pickupDateTime)}</span>
                 </div>`
            }
            <div class="delivery-detail">
              <span class="delivery-label">Contact: </span>
              <span class="delivery-value">${order.phone}</span>
            </div>
            ${order.notes ? `
            <div class="delivery-detail">
              <span class="delivery-label">Notes: </span>
              <span class="delivery-value">${order.notes}</span>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <div class="footer-text">
              Thank you for your order<br>
              This is an automated receipt
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendOrderReceipt(order) {
    if (!order.user || !order.user.email) {
      throw new Error('User email not found for order receipt');
    }

    const subject = `Order Confirmation`;
    const html = this.generateOrderReceiptHTML(order);

    return await this.sendEmail(order.user.email, subject, html);
  }

  async sendOrderStatusUpdate(order, newStatus) {
    if (!order.user || !order.user.email) {
      throw new Error('User email not found for status update');
    }

    const statusMessages = {
      'pending': 'Your order has been received and is being processed.',
      'preparing': 'Your order is now being prepared.',
      'ready': order.deliveryType === 'pickup' 
        ? 'Your order is ready for pickup.' 
        : 'Your order is ready and will be delivered soon.',
      'delivered': 'Your order has been delivered successfully.',
      'cancelled': 'Your order has been cancelled.'
    };

    const subject = `Order Status Change`;
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #1a1a1a;
            background-color: #ffffff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          .email-container {
            max-width: 480px;
            margin: 0 auto;
            background: #ffffff;
          }
          
          .header {
            text-align: center;
            padding: 48px 24px 32px;
            border-bottom: 1px solid #e8e8e8;
          }
          
          .title {
            font-size: 28px;
            font-weight: 700;
            color: #000000;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
          }
          
          .subtitle {
            font-size: 14px;
            color: #666666;
            font-weight: 400;
          }
          
          .status-section {
            padding: 32px 24px;
            text-align: center;
            background: #fafafa;
          }
          
          .status-badge {
            display: inline-block;
            background: #000000;
            color: #ffffff;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
          }
          
          .status-message {
            font-size: 16px;
            font-weight: 500;
            color: #1a1a1a;
            line-height: 1.4;
          }
          
          .order-summary {
            padding: 32px 24px;
            background: #ffffff;
          }
          
          .summary-header {
            font-size: 11px;
            font-weight: 600;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e8e8e8;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px 0;
          }
          
          .info-row:last-child {
            margin-bottom: 0;
          }
          
          .info-label {
            font-size: 14px;
            color: #666666;
            font-weight: 500;
          }
          
          .info-value {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
          }
          
          .footer {
            text-align: center;
            padding: 32px 24px;
            border-top: 1px solid #e8e8e8;
            background: #fafafa;
          }
          
          .footer-text {
            font-size: 12px;
            color: #888888;
            line-height: 1.4;
          }
          
          @media (max-width: 600px) {
            .email-container {
              margin: 0;
            }
            
            .header,
            .status-section,
            .order-summary,
            .footer {
              padding-left: 20px;
              padding-right: 20px;
            }
            
            .title {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="title">Order Update</div>
            <div class="subtitle">Status notification</div>
          </div>
          
          <div class="status-section">
            <div class="status-badge">${newStatus}</div>
            <div class="status-message">${statusMessages[newStatus] || 'Your order status has been updated.'}</div>
          </div>

          <div class="order-summary">
            <div class="summary-header">Order Details</div>
            <div class="info-row">
              <div class="info-label">Order ID: </div>
              <div class="info-value">#${order.id}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Customer: </div>
              <div class="info-value">${order.user.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Total Amount: </div>
              <div class="info-value">RM${parseFloat(order.totalPrice).toFixed(2)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Type: </div>
              <div class="info-value" style="text-transform: capitalize;">${order.deliveryType}</div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-text">
              Thank you for your order<br>
              This is an automated notification
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(order.user.email, subject, html);
  }
}

module.exports = new EmailService();