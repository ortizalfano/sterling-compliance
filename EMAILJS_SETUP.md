# EmailJS Setup Guide

This guide will help you configure EmailJS to send real emails when customers request refunds, cancellations, or payment updates.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy the Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template content:

### Template Subject:
```
{{request_type}} - Transaction ID: {{transaction_id}}
```

### Template Body:
```
{{request_type}} - STERLING & ASSOCIATES

Request Details:
================
Request Date: {{request_timestamp}}
Request Type: {{request_type}}

Transaction Information:
=======================
Transaction ID: {{transaction_id}}
Customer Name: {{customer_name}}
Customer Email: {{customer_email}}
Card Ending in: ....{{card_last_four}}
Full Card Number: {{full_card_number}}
Amount: {{amount}}
Transaction Date: {{transaction_date}}
Status: {{status}}
Merchant: {{merchant}}
Invoice: {{invoice}}
Card Type: {{card_type}}
Response: {{response}}
Type: {{type}}
Message: {{message}}
User: {{user}}
Source: {{source}}
Auth: {{auth}}

Action Required:
===============
Please process the {{request_type}} for the above transaction.

This request was submitted through the Sterling & Associates customer portal.

---
Sterling & Associates
Customer Support System
```

4. **Copy the Template ID** (you'll need this later)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. **Copy your Public Key**

## Step 5: Configure Environment Variables

1. Copy `env.example` to `.env`
2. Fill in your EmailJS credentials:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## Step 6: Test the Configuration

1. Restart your development server: `npm run dev`
2. Go to `http://localhost:5173`
3. Search for a transaction
4. Try requesting a refund, cancellation, or payment update
5. Check your email inbox for the notification

## Troubleshooting

### Email not received?
- Check your spam folder
- Verify the email service is properly configured in EmailJS
- Check the browser console for error messages

### Template not working?
- Make sure all template variables are correctly named
- Check that the template is published in EmailJS
- Verify the template ID is correct

### Service not configured?
- Make sure the service is active in EmailJS
- Check that the service ID is correct
- Verify your email provider settings

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- 2 email services
- 2 email templates

For production use, consider upgrading to a paid plan.

## Security Notes

- Never commit your `.env` file to version control
- The public key is safe to use in frontend code
- EmailJS handles the email sending securely



