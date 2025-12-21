const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const Order = require('../models-mysql/Order');
const { auth, authorize } = require('../middleware/auth-mysql');

// Test email endpoint (development only)
router.post('/test', auth, authorize('admin'), async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to || !subject || !message) {
      return res.status(400).json({ 
        message: 'Missing required fields: to, subject, message' 
      });
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Email</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.4; 
            color: #000; 
            background: #fff;
          }
          .container { 
            max-width: 500px; 
            margin: 0 auto; 
            padding: 40px 20px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding-bottom: 20px;
            border-bottom: 2px solid #000;
          }
          .header h1 { 
            font-size: 24px; 
            font-weight: 600; 
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .content { 
            background: #f8f8f8; 
            padding: 30px; 
            margin: 30px 0; 
            border-left: 4px solid #000;
          }
          .message { 
            font-size: 16px; 
            margin-bottom: 20px;
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e0e0e0; 
            color: #666; 
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Test Email</h1>
          </div>
          
          <div class="content">
            <div class="message">${message}</div>
          </div>

          <div class="footer">
            <p>This is a test email from the system</p>
            <p>Sent at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await emailService.sendEmail(to, subject, html);
    
    if (result.success) {
      res.json({ 
        message: 'Test email sent successfully', 
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send test email', 
        error: result.error 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Resend order receipt
router.post('/resend-receipt/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user can access this order
    if (req.user.role === 'customer' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await emailService.sendOrderReceipt(order);
    
    if (result.success) {
      res.json({ 
        message: 'Order receipt resent successfully', 
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to resend order receipt', 
        error: result.error 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;