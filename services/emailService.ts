import emailjs from '@emailjs/browser';

interface RefundRequest {
  transactionId: string;
  customerName: string;
  email: string;
  userEmail?: string; // Add user email field
  lastFourDigits: string;
  amount: string;
  date: string;
  status: string;
  merchant: string;
  invoice: string;
  cardType: string;
  response: string;
  type: string;
  message: string;
  user: string;
  source: string;
  auth: number;
  fullCardNumber: string;
  requestTimestamp: string;
}

class EmailService {
  private recipientEmail = 'ortizalfano@gmail.com';
  private isConfigured = false;
  private serviceId: string;
  private templateId: string;
  private publicKey: string;

  constructor() {
    // Configurar EmailJS si tenemos las credenciales
    this.serviceId = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID || '';
    this.templateId = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID || '';
    this.publicKey = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY || '';

    if (this.serviceId && this.templateId && this.publicKey) {
      this.isConfigured = true;
      console.log('EmailJS configured successfully');
    } else {
      console.log('EmailJS credentials not found, using simulation mode');
    }
  }

  /**
   * Send refund request email
   */
  async sendRefundRequest(refundData: RefundRequest): Promise<{ success: boolean; error?: string }> {
    console.log('sendRefundRequest called with:', refundData);
    
    try {
      // Validate required fields
      if (!refundData || !refundData.transactionId) {
        throw new Error('Invalid refund data: missing transactionId');
      }

      const emailContent = this.generateRefundEmailContent(refundData);
      const subject = `Refund Request - Transaction ID: ${refundData.transactionId}`;
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        transaction_id: refundData.transactionId || 'N/A',
        customer_name: refundData.customerName || 'N/A',
        customer_email: refundData.email || 'N/A',
        user_email: refundData.userEmail || 'N/A', // Add user email to template
        card_last_four: refundData.lastFourDigits || 'N/A',
        amount: refundData.amount || 'N/A',
        transaction_date: refundData.date || 'N/A',
        status: refundData.status || 'N/A',
        merchant: refundData.merchant || 'N/A',
        invoice: refundData.invoice || 'N/A',
        card_type: refundData.cardType || 'N/A',
        response: refundData.response || 'N/A',
        type: refundData.type || 'N/A',
        message: refundData.message || 'N/A',
        user: refundData.user || 'N/A',
        source: refundData.source || 'N/A',
        auth: refundData.auth || 0,
        full_card_number: refundData.fullCardNumber || 'N/A',
        request_timestamp: refundData.requestTimestamp || new Date().toISOString(),
        request_type: 'Refund Request'
      };

      console.log('Sending email with template params:', templateParams);
      const result = await this.sendEmail(subject, emailContent, templateParams);
      console.log('Email send result:', result);
      
      return result;
    } catch (error) {
      console.error('Error sending refund request email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      };
    }
  }

  /**
   * Generate email content for refund request
   */
  private generateRefundEmailContent(data: RefundRequest): string {
    const requestDate = new Date(data.requestTimestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    return `
REFUND REQUEST - STERLING & ASSOCIATES

Request Details:
================
Request Date: ${requestDate}
Request Type: Refund Request

Transaction Information:
=======================
Transaction ID: ${data.transactionId}
Customer Name: ${data.customerName}
Customer Email: ${data.email}
User Email (for refund): ${data.userEmail || 'N/A'}
Card Ending in: ....${data.lastFourDigits}
Full Card Number: ${data.fullCardNumber}
Amount: ${data.amount}
Transaction Date: ${data.date}
Status: ${data.status}
Merchant: ${data.merchant}
Invoice: ${data.invoice}
Card Type: ${data.cardType}
Response: ${data.response}
Type: ${data.type}
Message: ${data.message}
User: ${data.user}
Source: ${data.source}
Auth: ${data.auth}

Action Required:
===============
Please process the refund request for the above transaction.

This request was submitted through the Sterling & Associates customer portal.

---
Sterling & Associates
Customer Support System
    `.trim();
  }

  /**
   * Send email using EmailJS or simulation
   */
  private async sendEmail(subject: string, content: string, templateParams: any = {}): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.isConfigured) {
        // Send real email using EmailJS
        const templateParamsWithDefaults = {
          to_email: this.recipientEmail,
          subject: subject,
          message: content,
          ...templateParams
        };

        const result = await emailjs.send(
          this.serviceId,
          this.templateId,
          templateParamsWithDefaults,
          this.publicKey
        );

        console.log('Email sent successfully via EmailJS:', result);
        return { success: true };
      } else {
        // Simulation mode - log to console
        console.log('=== EMAIL SIMULATION ===');
        console.log('To:', this.recipientEmail);
        console.log('Subject:', subject);
        console.log('Content:');
        console.log(content);
        console.log('Template Params:', templateParams);
        console.log('========================');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Check for specific EmailJS errors
      if (error && typeof error === 'object' && 'text' in error) {
        const emailJSError = error as { text: string; status: number };
        console.error('EmailJS Error:', emailJSError.text, 'Status:', emailJSError.status);
        
        // Return success false but don't break the UI
        return { 
          success: false, 
          error: `EmailJS Error: ${emailJSError.text}` 
        };
      }
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      };
    }
  }

  /**
   * Send cancellation request email
   */
  async sendCancellationRequest(cancellationData: RefundRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const emailContent = this.generateCancellationEmailContent(cancellationData);
      const subject = `Cancellation Request - Transaction ID: ${cancellationData.transactionId}`;
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        transaction_id: cancellationData.transactionId,
        customer_name: cancellationData.customerName,
        customer_email: cancellationData.email,
        card_last_four: cancellationData.lastFourDigits,
        amount: cancellationData.amount,
        transaction_date: cancellationData.date,
        status: cancellationData.status,
        merchant: cancellationData.merchant,
        invoice: cancellationData.invoice,
        card_type: cancellationData.cardType,
        response: cancellationData.response,
        type: cancellationData.type,
        message: cancellationData.message,
        user: cancellationData.user,
        source: cancellationData.source,
        auth: cancellationData.auth,
        full_card_number: cancellationData.fullCardNumber,
        request_timestamp: cancellationData.requestTimestamp,
        request_type: 'Cancellation Request'
      };

      return await this.sendEmail(subject, emailContent, templateParams);
    } catch (error) {
      console.error('Error sending cancellation request email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      };
    }
  }

  /**
   * Generate email content for cancellation request
   */
  private generateCancellationEmailContent(data: RefundRequest): string {
    const requestDate = new Date(data.requestTimestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    return `
CANCELLATION REQUEST - STERLING & ASSOCIATES

Request Details:
================
Request Date: ${requestDate}
Request Type: Cancellation Request

Transaction Information:
=======================
Transaction ID: ${data.transactionId}
Customer Name: ${data.customerName}
Customer Email: ${data.email}
Card Ending in: ....${data.lastFourDigits}
Full Card Number: ${data.fullCardNumber}
Amount: ${data.amount}
Transaction Date: ${data.date}
Status: ${data.status}
Merchant: ${data.merchant}
Invoice: ${data.invoice}
Card Type: ${data.cardType}
Response: ${data.response}
Type: ${data.type}
Message: ${data.message}
User: ${data.user}
Source: ${data.source}
Auth: ${data.auth}

Action Required:
===============
Please process the cancellation request for the above transaction.

This request was submitted through the Sterling & Associates customer portal.

---
Sterling & Associates
Customer Support System
    `.trim();
  }

  /**
   * Send payment update request email
   */
  async sendPaymentUpdateRequest(updateData: RefundRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const emailContent = this.generatePaymentUpdateEmailContent(updateData);
      const subject = `Payment Update Request - Transaction ID: ${updateData.transactionId}`;
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        transaction_id: updateData.transactionId,
        customer_name: updateData.customerName,
        customer_email: updateData.email,
        card_last_four: updateData.lastFourDigits,
        amount: updateData.amount,
        transaction_date: updateData.date,
        status: updateData.status,
        merchant: updateData.merchant,
        invoice: updateData.invoice,
        card_type: updateData.cardType,
        response: updateData.response,
        type: updateData.type,
        message: updateData.message,
        user: updateData.user,
        source: updateData.source,
        auth: updateData.auth,
        full_card_number: updateData.fullCardNumber,
        request_timestamp: updateData.requestTimestamp,
        request_type: 'Payment Update Request'
      };

      return await this.sendEmail(subject, emailContent, templateParams);
    } catch (error) {
      console.error('Error sending payment update request email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      };
    }
  }

  /**
   * Generate email content for payment update request
   */
  private generatePaymentUpdateEmailContent(data: RefundRequest): string {
    const requestDate = new Date(data.requestTimestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    return `
PAYMENT UPDATE REQUEST - STERLING & ASSOCIATES

Request Details:
================
Request Date: ${requestDate}
Request Type: Payment Update Request

Transaction Information:
=======================
Transaction ID: ${data.transactionId}
Customer Name: ${data.customerName}
Customer Email: ${data.email}
Card Ending in: ....${data.lastFourDigits}
Full Card Number: ${data.fullCardNumber}
Amount: ${data.amount}
Transaction Date: ${data.date}
Status: ${data.status}
Merchant: ${data.merchant}
Invoice: ${data.invoice}
Card Type: ${data.cardType}
Response: ${data.response}
Type: ${data.type}
Message: ${data.message}
User: ${data.user}
Source: ${data.source}
Auth: ${data.auth}

Action Required:
===============
Please process the payment update request for the above transaction.

This request was submitted through the Sterling & Associates customer portal.

---
Sterling & Associates
Customer Support System
    `.trim();
  }
}

// Create singleton instance
export const emailService = new EmailService();
export { EmailService };
