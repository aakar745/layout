/**
 * Production Webhook Health Monitor
 * 
 * This script monitors webhook health and sends alerts for issues.
 * Run this periodically (every 5-10 minutes) in production.
 */

const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const CHECK_INTERVAL_MINUTES = 10;
const ALERT_EMAIL = process.env.ADMIN_EMAIL || 'admin@aakarbooking.com';

// Email configuration for alerts
const emailTransporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Monitor webhook health metrics
 */
async function monitorWebhookHealth() {
  try {
    console.log('🔍 [WEBHOOK MONITOR] Starting health check...');
    
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    
    const ServiceCharge = mongoose.model('ServiceCharge', {
      merchantOrderId: String,
      paymentStatus: String,
      createdAt: Date,
      updatedAt: Date,
      webhookReceived: Boolean,
      webhookReceivedAt: Date
    });
    
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - (CHECK_INTERVAL_MINUTES * 60 * 1000));
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
    
    // Check for payments stuck in PENDING status
    const stuckPayments = await ServiceCharge.find({
      paymentStatus: 'PENDING',
      createdAt: { $lt: tenMinutesAgo }
    }).limit(10);
    
    // Check webhook processing rate in last hour
    const totalPayments = await ServiceCharge.countDocuments({
      createdAt: { $gte: oneHourAgo }
    });
    
    const webhookProcessed = await ServiceCharge.countDocuments({
      createdAt: { $gte: oneHourAgo },
      webhookReceived: true
    });
    
    const webhookSuccessRate = totalPayments > 0 ? (webhookProcessed / totalPayments) * 100 : 100;
    
    // Check for recent authentication failures (from logs)
    const authFailures = await checkAuthenticationFailures();
    
    // Generate health report
    const healthReport = {
      timestamp: now.toISOString(),
      stuckPaymentsCount: stuckPayments.length,
      webhookSuccessRate: webhookSuccessRate.toFixed(2),
      totalPayments: totalPayments,
      webhookProcessed: webhookProcessed,
      authFailures: authFailures,
      status: 'HEALTHY'
    };
    
    // Determine overall health status
    if (stuckPayments.length > 5) {
      healthReport.status = 'CRITICAL';
      healthReport.alerts = ['Too many stuck payments'];
    } else if (webhookSuccessRate < 95) {
      healthReport.status = 'WARNING';
      healthReport.alerts = ['Low webhook success rate'];
    } else if (authFailures > 10) {
      healthReport.status = 'WARNING';
      healthReport.alerts = ['High authentication failure rate'];
    }
    
    // Log health status
    console.log('📊 [WEBHOOK HEALTH]', JSON.stringify(healthReport, null, 2));
    
    // Send alerts if needed
    if (healthReport.status !== 'HEALTHY') {
      await sendHealthAlert(healthReport);
    }
    
    // Log stuck payments for investigation
    if (stuckPayments.length > 0) {
      console.log('⚠️ [STUCK PAYMENTS] Found stuck payments:');
      stuckPayments.forEach(payment => {
        console.log(`   - Order: ${payment.merchantOrderId}, Status: ${payment.paymentStatus}, Created: ${payment.createdAt}`);
      });
    }
    
    await mongoose.disconnect();
    return healthReport;
    
  } catch (error) {
    console.error('❌ [WEBHOOK MONITOR] Health check failed:', error);
    
    // Send critical alert
    await sendHealthAlert({
      timestamp: new Date().toISOString(),
      status: 'CRITICAL',
      error: error.message,
      alerts: ['Webhook monitoring system failure']
    });
    
    throw error;
  }
}

/**
 * Check authentication failures from application logs
 */
async function checkAuthenticationFailures() {
  // This would typically read from your log files or log aggregation system
  // For now, return 0 as placeholder
  return 0;
}

/**
 * Send health alert email
 */
async function sendHealthAlert(healthReport) {
  try {
    const subject = `🚨 Webhook Health Alert - ${healthReport.status}`;
    const htmlContent = `
      <h2>🚨 Webhook Health Alert</h2>
      <p><strong>Status:</strong> ${healthReport.status}</p>
      <p><strong>Timestamp:</strong> ${healthReport.timestamp}</p>
      
      ${healthReport.alerts ? `
      <h3>Alerts:</h3>
      <ul>
        ${healthReport.alerts.map(alert => `<li>${alert}</li>`).join('')}
      </ul>
      ` : ''}
      
      ${healthReport.stuckPaymentsCount ? `
      <p><strong>Stuck Payments:</strong> ${healthReport.stuckPaymentsCount}</p>
      ` : ''}
      
      ${healthReport.webhookSuccessRate ? `
      <p><strong>Webhook Success Rate:</strong> ${healthReport.webhookSuccessRate}%</p>
      <p><strong>Total Payments (1h):</strong> ${healthReport.totalPayments}</p>
      <p><strong>Webhooks Processed (1h):</strong> ${healthReport.webhookProcessed}</p>
      ` : ''}
      
      ${healthReport.error ? `
      <h3>Error Details:</h3>
      <pre>${healthReport.error}</pre>
      ` : ''}
      
      <hr>
      <p><small>Generated by Webhook Health Monitor at ${new Date().toISOString()}</small></p>
    `;
    
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ALERT_EMAIL,
      subject: subject,
      html: htmlContent
    });
    
    console.log('📧 [WEBHOOK MONITOR] Alert email sent successfully');
    
  } catch (error) {
    console.error('❌ [WEBHOOK MONITOR] Failed to send alert email:', error);
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  console.log('🚀 [WEBHOOK MONITOR] Starting webhook health monitoring...');
  
  monitorWebhookHealth()
    .then(report => {
      console.log('✅ [WEBHOOK MONITOR] Health check completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ [WEBHOOK MONITOR] Health check failed:', error);
      process.exit(1);
    });
}

module.exports = { monitorWebhookHealth };