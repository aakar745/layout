# 🚀 Production Webhook Deployment Guide

## ✅ **Pre-Deployment Checklist**

### **1. Environment Variables Verified**
Your production environment already has the correct webhook credentials:
```
PHONEPE_WEBHOOK_USERNAME=aakarbooking_webhook
PHONEPE_WEBHOOK_PASSWORD=AAKAr7896
```

### **2. Security Features Implemented**
- ✅ **Authentication Required**: No requests accepted without proper auth
- ✅ **Dual Auth Support**: Both Basic Auth and SHA256 signatures supported
- ✅ **No Hardcoded Credentials**: All credentials from environment variables
- ✅ **Startup Validation**: Server won't start without proper webhook credentials

---

## 🔧 **Deployment Steps**

### **Step 1: Deploy Updated Code**
```bash
# Deploy the updated publicServiceCharge.controller.ts with webhook security
# Deploy the updated server.ts with environment validation
```

### **Step 2: Configure PhonePe Dashboard**
1. **Login to PhonePe Merchant Dashboard**
2. **Navigate to Webhook Settings**
3. **Set Webhook URL**: `https://aakarbooking.com/api/public/service-charge/phonepe-callback`
4. **Configure Authentication**:
   - **Method**: Basic Auth
   - **Username**: `aakarbooking_webhook`
   - **Password**: `AAKAr7896`

### **Step 3: Test Production Webhook**
```bash
# Use the production webhook test
curl -X POST https://aakarbooking.com/api/public/service-charge/phonepe-callback \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWFrYXJib29raW5nX3dlYmhvb2s6QUFLQXI3ODk2" \
  -d '{
    "merchantOrderId": "TEST_PRODUCTION_WEBHOOK",
    "state": "COMPLETED",
    "amount": 100000,
    "paymentDetails": [{
      "transactionId": "TEST_PROD_TXN_001",
      "amount": 100000,
      "state": "SUCCESS"
    }]
  }'
```

---

## 🔍 **Production Verification**

### **Expected Webhook Flow:**
1. **User initiates payment** → PhonePe payment gateway
2. **Payment completed/failed** → PhonePe sends webhook to your server
3. **Webhook authentication** → Your server validates credentials
4. **Payment status update** → Service charge status updated in database
5. **Receipt generation** → PDF receipt generated and stored
6. **Notification sent** → User receives WhatsApp/Email notification

### **Monitoring Points:**
- ✅ Webhook authentication success/failure rates
- ✅ Payment status update accuracy
- ✅ Receipt generation success
- ✅ Notification delivery rates

---

## 🚨 **Troubleshooting Guide**

### **Common Issues & Solutions:**

#### **1. Webhook Authentication Failures**
```
❌ Error: "Webhook authentication failed"
✅ Solution: Verify PhonePe dashboard has correct credentials
```

#### **2. Service Charge Not Found**
```
❌ Error: "Service charge not found"
✅ Solution: Check merchantOrderId format matches your system
```

#### **3. Environment Variable Missing**
```
❌ Error: "Webhook credentials not configured"
✅ Solution: Verify environment variables are set in production
```

---

## 📊 **Success Metrics**

### **Expected Results:**
- **Webhook Success Rate**: >99%
- **Payment Status Accuracy**: 100%
- **Receipt Generation**: <2 seconds
- **Authentication Failures**: Only from invalid requests

### **Red Flags:**
- Multiple authentication failures from PhonePe IPs
- Payment status not updating within 30 seconds
- Missing receipts for completed payments
- Webhook timeouts or 5xx errors

---

## 🔐 **Security Notes**

### **Production Security Measures:**
1. **HTTPS Only**: All webhook URLs use HTTPS
2. **IP Whitelisting**: Consider restricting to PhonePe IP ranges
3. **Rate Limiting**: Monitor for unusual webhook volumes
4. **Audit Logging**: All webhook attempts are logged
5. **Credential Rotation**: Rotate webhook credentials quarterly

### **Emergency Contacts:**
- **PhonePe Support**: [merchant support contact]
- **System Admin**: [your contact]
- **Technical Lead**: [technical contact]

---

## ✅ **Deployment Verification**

After deployment, verify:
1. ✅ Server starts without errors
2. ✅ Webhook endpoint responds to test requests
3. ✅ Authentication properly validates
4. ✅ Payment status updates work
5. ✅ Receipt generation functions
6. ✅ Notifications are sent

**🎉 Your webhook security implementation is production-ready!**
