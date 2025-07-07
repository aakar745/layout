# PhonePe Payment Gateway Integration

This document explains how to configure and use the PhonePe payment gateway alongside Razorpay in the Exhibition Management System.

## Overview

The system now supports both Razorpay and PhonePe payment gateways for service charges. You can configure which payment gateway to use per exhibition, with PhonePe set as the default.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# PhonePe Configuration
PHONEPE_CLIENT_ID=your_phonepe_client_id
PHONEPE_CLIENT_SECRET=your_phonepe_client_secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_ENV=SANDBOX
# For development mode, use: phonepe_test_development_mode
PHONEPE_CALLBACK_USERNAME=your_callback_username
PHONEPE_CALLBACK_PASSWORD=your_callback_password

# Existing Razorpay Configuration (still required)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
# For development mode, use: rzp_test_development_mode
```

## Configuration

### 1. Development Mode Setup

For development and testing, use these values:

```env
# PhonePe Development Mode
PHONEPE_CLIENT_ID=phonepe_test_development_mode
PHONEPE_CLIENT_SECRET=test_secret
PHONEPE_ENV=SANDBOX

# Razorpay Development Mode
RAZORPAY_KEY_ID=rzp_test_development_mode
RAZORPAY_KEY_SECRET=test_secret
```

### 2. Production Mode Setup

For production, obtain your credentials from:

- **PhonePe**: PhonePe Business Dashboard
- **Razorpay**: Razorpay Dashboard

```env
# PhonePe Production
PHONEPE_CLIENT_ID=your_actual_phonepe_client_id
PHONEPE_CLIENT_SECRET=your_actual_phonepe_client_secret
PHONEPE_ENV=PRODUCTION
PHONEPE_CALLBACK_USERNAME=your_callback_username
PHONEPE_CALLBACK_PASSWORD=your_callback_password

# Razorpay Production
RAZORPAY_KEY_ID=your_actual_razorpay_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_key_secret
```

## How It Works

### Payment Gateway Selection

1. **Default**: PhonePe is set as the default payment gateway
2. **Per Exhibition**: Each exhibition can have its own payment gateway configuration
3. **Fallback**: If PhonePe is not configured, the system falls back to Razorpay

### Payment Flow

#### PhonePe Flow:
1. User fills service charge form
2. System creates PhonePe order
3. User redirected to PhonePe payment page
4. After payment, user redirected back to success page
5. System verifies payment via PhonePe callback

#### Razorpay Flow:
1. User fills service charge form
2. System creates Razorpay order
3. Razorpay popup opens for payment
4. System verifies payment via Razorpay webhook
5. User sees success page

## Exhibition Configuration

### Service Charge Configuration

When setting up service charges for an exhibition, you can configure:

```javascript
serviceChargeConfig: {
  isEnabled: true,
  title: "Service Charges",
  description: "Pay service charges for stall positioning and setup",
  paymentGateway: "phonepe", // or "razorpay"
  serviceTypes: [...],
  // PhonePe specific configuration
  phonePeConfig: {
    clientId: "your_phonepe_client_id",
    env: "SANDBOX" // or "PRODUCTION"
  },
  // Razorpay specific configuration
  razorpayKeyId: "your_razorpay_key_id"
}
```

### Admin Interface

The admin can configure payment gateways through the exhibition settings:

1. Go to Exhibition Settings
2. Navigate to Service Charges section
3. Select Payment Gateway (PhonePe or Razorpay)
4. Configure gateway-specific settings

## API Endpoints

### New PhonePe Endpoints

- `POST /api/public/service-charge/phonepe-callback` - Handle PhonePe payment callbacks
- `POST /api/public/service-charge/verify-phonepe-payment` - Verify PhonePe payment status

### Existing Endpoints (Updated)

- `GET /api/public/service-charge/config/:exhibitionId` - Now includes payment gateway configuration
- `POST /api/public/service-charge/create-order` - Creates order for selected payment gateway
- `POST /api/public/service-charge/verify-payment` - Razorpay payment verification

## Database Schema Updates

### Exhibition Model

```javascript
serviceChargeConfig: {
  // ... existing fields
  paymentGateway: 'razorpay' | 'phonepe', // Default: 'phonepe'
  phonePeConfig: {
    clientId: String,
    env: 'SANDBOX' | 'PRODUCTION'
  }
}
```

### Service Charge Model

```javascript
// New fields added
paymentGateway: 'razorpay' | 'phonepe',
phonePeOrderId: String,
phonePeTransactionId: String,
phonePeMerchantTransactionId: String,
```

## Frontend Changes

### Payment Form

The payment form now:
- Detects the configured payment gateway
- Shows appropriate payment method information
- Handles both PhonePe and Razorpay payment flows
- Displays correct development mode messages

### Payment Button

The payment button dynamically shows:
- "Pay via PhonePe Rs. X,XXX" (for PhonePe)
- "Pay via Razorpay Rs. X,XXX" (for Razorpay)
- "Simulate PhonePe/Razorpay Payment Rs. X,XXX" (for development mode)

## Testing

### Development Mode Testing

1. Set environment variables for development mode
2. Create service charge with test data
3. Payment will be simulated automatically
4. Check database for payment records

### Production Testing

1. Use PhonePe/Razorpay test credentials
2. Make actual test payments
3. Verify payment callbacks
4. Check receipt generation

## Security Considerations

1. **Environment Variables**: Never commit actual credentials to version control
2. **Callback Security**: PhonePe callbacks are verified using signature validation
3. **Payment Verification**: Always verify payments server-side
4. **Development Mode**: Clearly indicate when in development mode

## Troubleshooting

### Common Issues

1. **Payment Gateway Not Working**: Check environment variables and credentials
2. **Callback Failures**: Verify callback URL configuration
3. **Payment Verification Failed**: Check signature validation
4. **Development Mode Issues**: Ensure correct test credentials

### Debug Information

- Check console logs for payment gateway initialization
- Verify API responses in network tab
- Check database for payment records
- Review error messages in backend logs

## Migration Guide

If you're upgrading from Razorpay-only setup:

1. Add new environment variables
2. Update exhibition service charge configurations
3. Test payment flows
4. Update admin interface (if needed)

The system maintains backward compatibility - existing Razorpay configurations continue to work. 