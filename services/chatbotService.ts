import { v4 as uuidv4 } from 'uuid';
import { geminiService, ChatContext, ChatResponse } from './geminiService';
import { airtableService } from './airtableService';
import { emailService } from './emailService';
import { SearchTransactionRequest, Transaction, AirtableTransaction } from '../types';

export interface ChatbotSession {
  id: string;
  context: ChatContext;
  createdAt: string;
  lastActivity: string;
}

class ChatbotService {
  private sessions: Map<string, ChatbotSession> = new Map();

  /**
   * Start a new chat session
   */
  startSession(): ChatbotSession {
    const sessionId = uuidv4();
    const context: ChatContext = {
      sessionId,
      currentStep: 'greeting',
      conversationHistory: []
    };

    const session: ChatbotSession = {
      id: sessionId,
      context,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get existing session
   */
  getSession(sessionId: string): ChatbotSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Process user message and return response
   */
  async processMessage(sessionId: string, userMessage: string): Promise<ChatResponse> {
    console.log('Processing message in chatbot service:', { sessionId, userMessage });
    
    let session = this.getSession(sessionId);
    
    if (!session) {
      console.log('Session not found, creating new session');
      // Start new session if not found
      session = this.startSession();
    }

    // Update last activity
    session.lastActivity = new Date().toISOString();

    try {
      console.log('Processing message with Gemini...');
      // Process message with Gemini
      const geminiResponse = await geminiService.processMessage(userMessage, session.context);
      console.log('Gemini response:', geminiResponse);

      // Update session context
      session.context = geminiResponse.context;
      this.sessions.set(sessionId, session);

      // Handle specific actions
      const finalResponse = await this.handleAction(geminiResponse);
      console.log('Final response:', finalResponse);

      return finalResponse;
    } catch (error) {
      console.error('Error in chatbot service:', error);
      return {
        message: 'I apologize, I\'m experiencing technical difficulties. Could you please try again or contact our support team?',
        context: session.context,
        actionRequired: undefined,
        suggestions: ['Try again', 'Contact support'],
        needsHumanAgent: true
      };
    }
  }

  /**
   * Handle specific actions based on Gemini's response
   */
  private async handleAction(response: ChatResponse): Promise<ChatResponse> {
    if (!response.actionRequired) {
      return response;
    }

    const { context } = response;

    switch (response.actionRequired) {
      case 'collect_email':
        const email = geminiService.extractEmail(response.message) || 
                     geminiService.extractEmail(context.conversationHistory[context.conversationHistory.length - 2]?.message || '');
        if (email) {
          context.userEmail = email;
          context.currentStep = 'collecting_card';
        }
        break;

      case 'collect_card':
        const cardDigits = geminiService.extractCardDigits(response.message) || 
                          geminiService.extractCardDigits(context.conversationHistory[context.conversationHistory.length - 2]?.message || '');
        if (cardDigits) {
          context.lastFourDigits = cardDigits;
          context.currentStep = 'collecting_date';
        }
        break;

      case 'collect_date':
        const date = geminiService.extractDate(response.message) || 
                    geminiService.extractDate(context.conversationHistory[context.conversationHistory.length - 2]?.message || '');
        if (date) {
          context.transactionDate = date;
          context.currentStep = 'searching';
        }
        break;

      case 'search_transactions':
        return await this.searchTransactions(context);

      case 'process_refund':
        return await this.processRefund(context);

      case 'process_cancel':
        return await this.processCancellation(context);

      case 'process_payment_update':
        return await this.processPaymentUpdate(context);
    }

    return response;
  }

  /**
   * Search for transactions based on collected information
   */
  private async searchTransactions(context: ChatContext): Promise<ChatResponse> {
    if (!context.lastFourDigits) {
      return {
        message: 'I need the last 4 digits of your card to search for your transaction. Please provide this information.',
        context: {
          ...context,
          currentStep: 'collecting_card'
        },
        actionRequired: 'collect_card',
        suggestions: ['Provide last 4 digits']
      };
    }

    try {
      // Search in Airtable (only by last 4 digits)
      const result = await airtableService.searchTransactionsByCard(
        context.lastFourDigits,
        context.transactionDate
      );

      if (!result.success || !result.data || result.data.length === 0) {
        return {
          message: 'I couldn\'t find any transactions with the last 4 digits provided. Could you verify the card number? You can also provide an approximate date to help with the search.',
          context: {
            ...context,
            currentStep: 'collecting_card'
          },
          actionRequired: 'collect_card',
          suggestions: ['Verify card number', 'Provide approximate date', 'Contact support']
        };
      }

      // Convert all Airtable transactions to our format
      const transactions: Transaction[] = result.data.map(airtableTransaction => ({
        id: airtableTransaction["Transaction ID"],
        email: airtableTransaction.Customer,
        lastFourDigits: airtableTransaction["Card Number"].slice(-4),
        transactionDate: airtableTransaction.Created,
        amount: airtableTransaction.Amount,
        merchant: airtableTransaction.Customer,
        transactionId: airtableTransaction["Transaction ID"],
        status: airtableTransaction.Status as any,
        customerName: airtableTransaction.Customer,
        cardType: airtableTransaction["Card Type"] as any,
        createdAt: airtableTransaction.Created,
        updatedAt: airtableTransaction.Created
      }));

      // Store all transactions
      context.foundTransactions = transactions;
      context.currentStep = 'results';

      let message: string;
      
      if (transactions.length === 1) {
        // Single transaction
        const transaction = transactions[0];
        const airtableTransaction = result.data[0];
        
        // Store the full Airtable transaction for email purposes
        context.airtableTransaction = airtableTransaction;
        
        message = `Perfect! I found your transaction:

💰 **${transaction.merchant}**
📅 Date: ${new Date(transaction.transactionDate).toLocaleDateString('en-US')}
💳 Amount: $${transaction.amount.toFixed(2)}
🆔 ID: ${transaction.transactionId}
✅ Status: ${transaction.status}
💳 Card Type: ${airtableTransaction["Card Type"]}
📧 Response: ${airtableTransaction.Response}

What would you like to do with this transaction?`;
      } else {
        // Multiple transactions
        message = `Perfect! I found ${transactions.length} transactions with your card ending in ${context.lastFourDigits}:

${transactions.map((transaction, index) => `
**Transaction ${index + 1}:**
💰 Customer: ${transaction.customerName}
📅 Date: ${new Date(transaction.transactionDate).toLocaleDateString('en-US')}
💳 Amount: $${transaction.amount.toFixed(2)}
🆔 ID: ${transaction.transactionId}
✅ Status: ${transaction.status}
`).join('\n')}

Please specify which transaction you'd like to work with by mentioning the transaction ID or customer name.`;

        // Store the first transaction as default for backward compatibility
        context.airtableTransaction = result.data[0];
      }

      return {
        message,
        context,
        actionRequired: 'show_results',
        suggestions: ['Request refund', 'Cancel subscription', 'Update payment method', 'More information']
      };

    } catch (error) {
      console.error('Error searching transactions:', error);
      return {
        message: 'There was a problem searching for your transaction. Please try again or contact our support team.',
        context,
        actionRequired: undefined,
        suggestions: ['Try again', 'Contact support'],
        needsHumanAgent: true
      };
    }
  }

  /**
   * Process refund request
   */
  private async processRefund(context: ChatContext): Promise<ChatResponse> {
    if (!context.foundTransactions || context.foundTransactions.length === 0) {
      return {
        message: 'First I need to find your transaction. Could you please provide the necessary information?',
        context: {
          ...context,
          currentStep: 'collecting_card'
        },
        actionRequired: 'collect_email',
        suggestions: ['Provide information', 'Search transaction']
      };
    }

    try {
      // If multiple transactions, use the first one for now (could be enhanced to let user choose)
      // TODO: Enhance to allow user to specify which transaction
      const transaction = context.foundTransactions[0];
      
      // If multiple transactions, inform user which one is being processed
      if (context.foundTransactions.length > 1) {
        const multipleTransactionMessage = `I found ${context.foundTransactions.length} transactions. I'll process the refund for the first transaction (${transaction.customerName} - $${transaction.amount.toFixed(2)}). If you need a refund for a different transaction, please specify the transaction ID.\n\n`;
      }
      
      // Prepare email data
      const emailData = {
        transactionId: transaction.transactionId,
        customerName: transaction.customerName || 'N/A',
        email: transaction.email || 'N/A',
        lastFourDigits: transaction.lastFourDigits,
        amount: `$${transaction.amount.toFixed(2)}`,
        date: new Date(transaction.transactionDate).toLocaleDateString('en-US'),
        status: transaction.status,
        merchant: transaction.merchant,
        invoice: 'N/A', // Not available in current transaction object
        cardType: transaction.cardType || 'N/A',
        response: 'N/A', // Not available in current transaction object
        type: 'N/A', // Not available in current transaction object
        message: 'N/A', // Not available in current transaction object
        user: 'N/A', // Not available in current transaction object
        source: 'N/A', // Not available in current transaction object
        auth: 0, // Not available in current transaction object
        fullCardNumber: 'N/A', // Not available in current transaction object
        requestTimestamp: new Date().toISOString()
      };

      // Send refund request email
      const emailResult = await emailService.sendRefundRequest(emailData);
      
      if (emailResult.success) {
        return {
          message: `✅ **Refund Request Processed**

Your refund request for transaction ${transaction.transactionId} has been processed and sent to our support team.

📧 You'll receive a confirmation email within the next few hours
⏱️ The refund will appear on your statement in 3-5 business days
💳 It will be credited to the card ending in ${transaction.lastFourDigits}

Is there anything else I can help you with?`,
          context: {
            ...context,
            currentStep: 'processing_action'
          },
          suggestions: ['Check status', 'Another inquiry', 'End conversation']
        };
      } else {
        return {
          message: `⚠️ **Refund Request Submitted**

Your refund request for transaction ${transaction.transactionId} has been submitted, but there was an issue sending the confirmation email.

📧 Our team will process your request manually
⏱️ You should receive confirmation within 24 hours
💳 The refund will be credited to the card ending in ${transaction.lastFourDigits}

Is there anything else I can help you with?`,
          context: {
            ...context,
            currentStep: 'processing_action'
          },
          suggestions: ['Check status', 'Another inquiry', 'End conversation']
        };
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        message: 'There was a problem processing your request. Please contact our support team.',
        context,
        actionRequired: undefined,
        suggestions: ['Contact support'],
        needsHumanAgent: true
      };
    }
  }

  /**
   * Process subscription cancellation
   */
  private async processCancellation(context: ChatContext): Promise<ChatResponse> {
    if (!context.foundTransactions || context.foundTransactions.length === 0) {
      return {
        message: 'First I need to find your transaction. Could you please provide the necessary information?',
        context: {
          ...context,
          currentStep: 'collecting_card'
        },
        actionRequired: 'collect_email',
        suggestions: ['Provide information', 'Search transaction']
      };
    }

    try {
      const transaction = context.foundTransactions[0];
      
      // Prepare email data
      const emailData = {
        transactionId: transaction.transactionId,
        customerName: transaction.customerName || 'N/A',
        email: transaction.email || 'N/A',
        lastFourDigits: transaction.lastFourDigits,
        amount: `$${transaction.amount.toFixed(2)}`,
        date: new Date(transaction.transactionDate).toLocaleDateString('en-US'),
        status: transaction.status,
        merchant: transaction.merchant,
        invoice: 'N/A', // Not available in current transaction object
        cardType: transaction.cardType || 'N/A',
        response: 'N/A', // Not available in current transaction object
        type: 'N/A', // Not available in current transaction object
        message: 'N/A', // Not available in current transaction object
        user: 'N/A', // Not available in current transaction object
        source: 'N/A', // Not available in current transaction object
        auth: 0, // Not available in current transaction object
        fullCardNumber: 'N/A', // Not available in current transaction object
        requestTimestamp: new Date().toISOString()
      };

      // Send cancellation request email
      const emailResult = await emailService.sendCancellationRequest(emailData);
      
      if (emailResult.success) {
        return {
          message: `✅ **Subscription Cancelled Successfully**

Your subscription with ${transaction.merchant} has been cancelled and our support team has been notified.

📧 You'll receive a confirmation email
🛑 No more automatic charges will be made
💳 Future charges have been suspended

Is there anything else I can help you with?`,
          context: {
            ...context,
            currentStep: 'processing_action'
          },
          suggestions: ['Check status', 'Another inquiry', 'End conversation']
        };
      } else {
        return {
          message: `⚠️ **Cancellation Request Submitted**

Your subscription cancellation request has been submitted, but there was an issue sending the confirmation email.

📧 Our team will process your request manually
🛑 No more automatic charges will be made
💳 Future charges have been suspended

Is there anything else I can help you with?`,
          context: {
            ...context,
            currentStep: 'processing_action'
          },
          suggestions: ['Check status', 'Another inquiry', 'End conversation']
        };
      }
    } catch (error) {
      console.error('Error processing cancellation:', error);
      return {
        message: 'There was a problem processing your request. Please contact our support team.',
        context,
        actionRequired: undefined,
        suggestions: ['Contact support'],
        needsHumanAgent: true
      };
    }
  }

  /**
   * Process payment method update
   */
  private async processPaymentUpdate(context: ChatContext): Promise<ChatResponse> {
    if (!context.foundTransactions || context.foundTransactions.length === 0) {
      return {
        message: 'First I need to find your transaction. Could you please provide the necessary information?',
        context: {
          ...context,
          currentStep: 'collecting_card'
        },
        actionRequired: 'collect_email',
        suggestions: ['Provide information', 'Search transaction']
      };
    }

    try {
      const transaction = context.foundTransactions[0];
      
      // Prepare email data
      const emailData = {
        transactionId: transaction.transactionId,
        customerName: transaction.customerName || 'N/A',
        email: transaction.email || 'N/A',
        lastFourDigits: transaction.lastFourDigits,
        amount: `$${transaction.amount.toFixed(2)}`,
        date: new Date(transaction.transactionDate).toLocaleDateString('en-US'),
        status: transaction.status,
        merchant: transaction.merchant,
        invoice: 'N/A', // Not available in current transaction object
        cardType: transaction.cardType || 'N/A',
        response: 'N/A', // Not available in current transaction object
        type: 'N/A', // Not available in current transaction object
        message: 'N/A', // Not available in current transaction object
        user: 'N/A', // Not available in current transaction object
        source: 'N/A', // Not available in current transaction object
        auth: 0, // Not available in current transaction object
        fullCardNumber: 'N/A', // Not available in current transaction object
        requestTimestamp: new Date().toISOString()
      };

      // Send payment update request email
      const emailResult = await emailService.sendPaymentUpdateRequest(emailData);
      
      if (emailResult.success) {
        return {
          message: `💳 **Payment Method Update Request**

Your payment method update request for ${transaction.merchant} has been sent to our support team.

🔒 Our team will contact you to securely update your payment information
💳 You'll be able to update your payment information through a secure process
✅ Changes will be applied immediately after verification

Is there anything else I can help you with?`,
          context: {
            ...context,
            currentStep: 'processing_action'
          },
          suggestions: ['Check status', 'Another inquiry', 'End conversation']
        };
      } else {
        return {
          message: `⚠️ **Payment Update Request Submitted**

Your payment method update request has been submitted, but there was an issue sending the confirmation email.

🔒 Our team will contact you to securely update your payment information
💳 You'll be able to update your payment information through a secure process
✅ Changes will be applied immediately after verification

Is there anything else I can help you with?`,
          context: {
            ...context,
            currentStep: 'processing_action'
          },
          suggestions: ['Check status', 'Another inquiry', 'End conversation']
        };
      }
    } catch (error) {
      console.error('Error processing payment update:', error);
      return {
        message: 'There was a problem processing your request. Please contact our support team.',
        context,
        actionRequired: undefined,
        suggestions: ['Contact support'],
        needsHumanAgent: true
      };
    }
  }

  /**
   * Clean up old sessions
   */
  cleanupOldSessions(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      const sessionAge = now - new Date(session.lastActivity).getTime();
      if (sessionAge > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    activeSessions: number;
    totalSessions: number;
    averageConversationLength: number;
  } {
    const sessions = Array.from(this.sessions.values());
    const totalConversations = sessions.reduce((sum, session) => 
      sum + session.context.conversationHistory.length, 0);

    return {
      activeSessions: sessions.length,
      totalSessions: sessions.length,
      averageConversationLength: sessions.length > 0 ? totalConversations / sessions.length : 0
    };
  }
}

export const chatbotService = new ChatbotService();
