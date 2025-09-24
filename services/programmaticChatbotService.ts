import { v4 as uuidv4 } from 'uuid';
import { airtableService } from './airtableService';
import { emailService } from './emailService';
import { Transaction, AirtableTransaction } from '../types';

export interface ChatbotSession {
  id: string;
  state: ChatbotState;
  createdAt: string;
  lastActivity: string;
}

export interface ChatbotState {
  step: 'greeting' | 'collecting_card' | 'searching' | 'results' | 'collecting_email' | 'processing';
  lastFourDigits?: string;
  foundTransactions?: Transaction[];
  selectedTransaction?: Transaction;
  airtableTransaction?: AirtableTransaction;
  userEmail?: string;
  pendingAction?: 'refund' | 'cancel' | 'update';
}

export interface ChatbotResponse {
  message: string;
  suggestions?: string[];
  state: ChatbotState;
}

class ProgrammaticChatbotService {
  private sessions: Map<string, ChatbotSession> = new Map();

  /**
   * Start a new chat session
   */
  startSession(): ChatbotSession {
    const sessionId = uuidv4();
    const state: ChatbotState = {
      step: 'greeting'
    };

    const session: ChatbotSession = {
      id: sessionId,
      state,
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
  async processMessage(sessionId: string, userMessage: string): Promise<ChatbotResponse> {
    console.log('Processing message in programmatic chatbot:', { sessionId, userMessage });
    
    let session = this.getSession(sessionId);
    
    if (!session) {
      console.log('Session not found, creating new session');
      session = this.startSession();
    }

    // Update last activity
    session.lastActivity = new Date().toISOString();

    try {
      const response = await this.handleMessage(userMessage.trim(), session.state);
      
      // Update session state
      session.state = response.state;
      this.sessions.set(sessionId, session);

      return response;
    } catch (error) {
      console.error('Error in programmatic chatbot service:', error);
      return {
        message: 'I apologize, I\'m experiencing technical difficulties. Could you please try again or contact our support team?',
        suggestions: ['Try again', 'Contact support'],
        state: session.state
      };
    }
  }

  /**
   * Handle user message based on current state
   */
  private async handleMessage(message: string, state: ChatbotState): Promise<ChatbotResponse> {
    switch (state.step) {
      case 'greeting':
        return this.handleGreeting(message, state);

      case 'collecting_card':
        return await this.handleCardCollection(message, state);

      case 'searching':
        return await this.handleSearching(message, state);

      case 'results':
        return await this.handleResults(message, state);

      case 'collecting_email':
        return await this.handleEmailCollection(message, state);

      case 'processing':
        return await this.handleProcessing(message, state);

      default:
        return {
          message: 'I\'m not sure how to help with that. Let me start over.',
          suggestions: ['Start over'],
          state: { step: 'greeting' }
        };
    }
  }

  /**
   * Handle greeting step
   */
  private handleGreeting(message: string, state: ChatbotState): ChatbotResponse {
    // Check if user is asking for help or wants to find a transaction
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('transaction') || lowerMessage.includes('purchase') || 
        lowerMessage.includes('charge') || lowerMessage.includes('refund') ||
        lowerMessage.includes('help') || lowerMessage.includes('find')) {
      
      return {
        message: `Hello! 👋 I'm your virtual assistant for Sterling & Associates. I can help you find your transactions.

I'll search for your transaction using the **last 4 digits of your card** - just like our main search form.

Please provide the last 4 digits of the card you used for the transaction.`,
        suggestions: ['I have my card ready', 'How do I find my card?'],
        state: { ...state, step: 'collecting_card' }
      };
    }

    // Default greeting
    return {
      message: `Hello! 👋 I'm your virtual assistant for Sterling & Associates. I can help you find your transactions and resolve billing issues.

To get started, I'll need the **last 4 digits of your card**. This is the only required information.

Please provide the last 4 digits of the card you used for the transaction.`,
      suggestions: ['I have my card ready', 'How do I find my card?'],
      state: { ...state, step: 'collecting_card' }
    };
  }

  /**
   * Handle card collection step - now searches directly
   */
  private async handleCardCollection(message: string, state: ChatbotState): Promise<ChatbotResponse> {
    const cardDigits = this.extractCardDigits(message);
    
    if (cardDigits) {
      // Search directly without asking for date
      console.log('🔍 Searching directly with card digits:', cardDigits);
      return await this.executeSearch({ ...state, lastFourDigits: cardDigits });
    }

    return {
      message: `I need the **last 4 digits of your card** to search for your transaction. Please provide exactly 4 digits (numbers only).

For example: 1234`,
      suggestions: ['I have my card ready'],
      state: { ...state, step: 'collecting_card' }
    };
  }


  /**
   * Execute the actual search in Airtable
   */
  private async executeSearch(state: ChatbotState): Promise<ChatbotResponse> {
    if (!state.lastFourDigits) {
      return {
        message: 'I seem to have lost your card information. Let me start over.',
        suggestions: ['Start over'],
        state: { step: 'greeting' }
      };
    }

    try {
      console.log('🔍 Executing search with:', { 
        lastFourDigits: state.lastFourDigits, 
        searchType: 'byCardOnly'
      });
      
      // Search in Airtable (without date filter)
      const result = await airtableService.searchTransactionsByCard(
        state.lastFourDigits
      );

      console.log('📊 Search result:', result);
      console.log('📊 Result success:', result.success);
      console.log('📊 Result data length:', result.data?.length || 0);
      console.log('📊 Result error:', result.error);

      if (!result.success || !result.data || result.data.length === 0) {
        return {
          message: `I couldn't find any transactions with the card ending in **${state.lastFourDigits}**.

Please verify that the last 4 digits are correct. You can try again with different digits.`,
          suggestions: ['Try different card digits', 'Contact support'],
          state: { ...state, step: 'collecting_card' }
        };
      }

      // Convert Airtable transactions to our format
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

      console.log('Converted transactions:', transactions);

      // Store transactions and airtable data
      state.foundTransactions = transactions;
      state.airtableTransaction = result.data[0]; // For email purposes

      if (transactions.length === 1) {
        // Single transaction
        const transaction = transactions[0];
        const airtableTransaction = result.data[0];
        
        return {
          message: `Perfect! I found your transaction:

💰 **Customer:** ${transaction.customerName}
📅 **Date:** ${new Date(transaction.transactionDate).toLocaleDateString('en-US')}
💳 **Amount:** $${transaction.amount.toFixed(2)}
🆔 **ID:** ${transaction.transactionId}
✅ **Status:** ${transaction.status}
💳 **Card Type:** ${airtableTransaction["Card Type"]}
📧 **Response:** ${airtableTransaction.Response}

What would you like to do with this transaction?`,
          suggestions: ['Request refund', 'Cancel subscription', 'Update payment method', 'More information'],
          state: { ...state, selectedTransaction: transaction, step: 'results' }
        };
      } else {
        // Multiple transactions
        const transactionList = transactions.map((transaction, index) => 
          `**Transaction ${index + 1}:**
💰 Customer: ${transaction.customerName}
📅 Date: ${new Date(transaction.transactionDate).toLocaleDateString('en-US')}
💳 Amount: $${transaction.amount.toFixed(2)}
🆔 ID: ${transaction.transactionId}
✅ Status: ${transaction.status}`
        ).join('\n\n');

        return {
          message: `Perfect! I found **${transactions.length} transactions** with your card ending in **${state.lastFourDigits}**:

${transactionList}

Please specify which transaction you'd like to work with by mentioning:
• The transaction ID (e.g., "4140055796")
• The customer name (e.g., "Eloise Carlisle")
• The transaction number (e.g., "Transaction 1")`,
          suggestions: transactions.map((_, index) => `Transaction ${index + 1}`),
          state: { ...state, step: 'results' }
        };
      }

    } catch (error) {
      console.error('Error searching transactions:', error);
      return {
        message: 'There was a problem searching for your transaction. Please try again or contact our support team.',
        suggestions: ['Try again', 'Contact support'],
        state: { ...state, step: 'collecting_card' }
      };
    }
  }

  /**
   * Handle searching step - this should not be used anymore, search is executed automatically
   */
  private async handleSearching(message: string, state: ChatbotState): Promise<ChatbotResponse> {
    // This should not happen anymore since search is executed automatically
    return await this.executeSearch(state);
  }

  /**
   * Handle email collection step
   */
  private async handleEmailCollection(message: string, state: ChatbotState): Promise<ChatbotResponse> {
    // Extract email from message
    const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    
    if (emailMatch) {
      const email = emailMatch[0];
      console.log('📧 Email collected:', email);
      
      // Validate email format
      if (!email.includes('@') || !email.includes('.')) {
        return {
          message: 'Please provide a valid email address. For example: user@example.com',
          suggestions: [],
          state: { ...state, step: 'collecting_email' }
        };
      }
      
      // Process the pending action with the email
      return await this.handleProcessing(state.pendingAction || 'refund', { 
        ...state, 
        userEmail: email,
        step: 'processing'
      });
    }
    
    return {
      message: 'I need a valid email address to proceed with your request. Please provide your email address (e.g., user@example.com):',
      suggestions: [],
      state: { ...state, step: 'collecting_email' }
    };
  }

  /**
   * Handle results step
   */
  private async handleResults(message: string, state: ChatbotState): Promise<ChatbotResponse> {
    if (!state.foundTransactions || state.foundTransactions.length === 0) {
      return {
        message: 'I seem to have lost your transaction information. Let me start over.',
        suggestions: ['Start over'],
        state: { step: 'greeting' }
      };
    }

    const lowerMessage = message.toLowerCase();

    // Check for action requests
    if (lowerMessage.includes('refund') || lowerMessage.includes('money back')) {
      // For refunds, collect email first
      return {
        message: `Great! I'll help you with your refund request.

To process your refund, I need your email address where we can send the confirmation.

Please provide your email address:`,
        suggestions: [],
        state: { ...state, step: 'collecting_email', pendingAction: 'refund' }
      };
    }

    if (lowerMessage.includes('cancel') || lowerMessage.includes('subscription')) {
      // Execute cancellation processing immediately (no email needed)
      return await this.handleProcessing('cancel', state);
    }

    if (lowerMessage.includes('update') || lowerMessage.includes('payment method')) {
      // Execute payment update processing immediately (no email needed)
      return await this.handleProcessing('update', state);
    }

    // Handle transaction selection for multiple transactions
    if (state.foundTransactions.length > 1) {
      const selectedTransaction = this.selectTransaction(message, state.foundTransactions);
      if (selectedTransaction) {
        state.selectedTransaction = selectedTransaction;
        return {
          message: `Perfect! I've selected this transaction:

💰 **Customer:** ${selectedTransaction.customerName}
📅 **Date:** ${new Date(selectedTransaction.transactionDate).toLocaleDateString('en-US')}
💳 **Amount:** $${selectedTransaction.amount.toFixed(2)}
🆔 **ID:** ${selectedTransaction.transactionId}
✅ **Status:** ${selectedTransaction.status}

What would you like to do with this transaction?`,
          suggestions: ['Request refund', 'Cancel subscription', 'Update payment method', 'More information'],
          state: { ...state, step: 'results' }
        };
      }
    }

    return {
      message: 'What would you like to do with your transaction? I can help you with refunds, cancellations, or payment method updates.',
      suggestions: ['Request refund', 'Cancel subscription', 'Update payment method', 'More information'],
      state: { ...state, step: 'results' }
    };
  }

  /**
   * Handle processing step
   */
  private async handleProcessing(actionType: string, state: ChatbotState): Promise<ChatbotResponse> {
    if (!state.selectedTransaction && state.foundTransactions) {
      state.selectedTransaction = state.foundTransactions[0];
    }

    if (!state.selectedTransaction) {
      return {
        message: 'I seem to have lost your transaction information. Let me start over.',
        suggestions: ['Start over'],
        state: { step: 'greeting' }
      };
    }

    const transaction = state.selectedTransaction;

    try {
      console.log('🔧 Processing action:', actionType, 'for transaction:', transaction.transactionId);
      
      // Prepare email data
      const emailData = {
        transactionId: transaction.transactionId,
        customerName: transaction.customerName || 'N/A',
        email: transaction.email || 'N/A',
        userEmail: state.userEmail || '', // Include user email
        lastFourDigits: transaction.lastFourDigits,
        amount: `$${transaction.amount.toFixed(2)}`,
        date: new Date(transaction.transactionDate).toLocaleDateString('en-US'),
        status: transaction.status,
        merchant: transaction.merchant,
        invoice: 'N/A',
        cardType: transaction.cardType || 'N/A',
        response: 'N/A',
        type: 'N/A',
        message: 'N/A',
        user: 'N/A',
        source: 'N/A',
        auth: 0,
        fullCardNumber: 'N/A',
        requestTimestamp: new Date().toISOString()
      };

      let emailResult;
      let actionDescription;

      if (actionType === 'refund') {
        console.log('📧 Sending refund request email...');
        emailResult = await emailService.sendRefundRequest(emailData);
        actionDescription = 'refund';
      } else if (actionType === 'cancel') {
        console.log('📧 Sending cancellation request email...');
        emailResult = await emailService.sendCancellationRequest(emailData);
        actionDescription = 'cancellation';
      } else if (actionType === 'update') {
        console.log('📧 Sending payment update request email...');
        emailResult = await emailService.sendPaymentUpdateRequest(emailData);
        actionDescription = 'payment update';
      } else {
        return {
          message: 'I\'m not sure what action you want to take. Please specify if you want a refund, cancellation, or payment method update.',
          suggestions: ['Request refund', 'Cancel subscription', 'Update payment method'],
          state: { ...state, step: 'results' }
        };
      }

      console.log('📧 Email result:', emailResult);

      if (emailResult.success) {
        return {
          message: `✅ **${actionDescription.charAt(0).toUpperCase() + actionDescription.slice(1)} Request Processed**

Your ${actionDescription} request for transaction ${transaction.transactionId} has been processed and sent to our support team.

📧 You'll receive a confirmation email within the next few hours
⏱️ The ${actionDescription} will be processed in 3-5 business days
💳 It will be applied to the card ending in ${transaction.lastFourDigits}

Is there anything else I can help you with?`,
          suggestions: ['Check status', 'Another inquiry', 'End conversation'],
          state: { ...state, step: 'greeting' } // Reset to greeting for new inquiries
        };
      } else {
        return {
          message: `⚠️ **${actionDescription.charAt(0).toUpperCase() + actionDescription.slice(1)} Request Submitted**

Your ${actionDescription} request for transaction ${transaction.transactionId} has been submitted, but there was an issue sending the confirmation email.

📧 Our team will process your request manually
⏱️ You should receive confirmation within 24 hours
💳 The ${actionDescription} will be applied to the card ending in ${transaction.lastFourDigits}

Is there anything else I can help you with?`,
          suggestions: ['Check status', 'Another inquiry', 'End conversation'],
          state: { ...state, step: 'greeting' } // Reset to greeting for new inquiries
        };
      }

    } catch (error) {
      console.error('Error processing request:', error);
      return {
        message: 'There was a problem processing your request. Please contact our support team.',
        suggestions: ['Contact support', 'Try again'],
        state: { ...state, step: 'results' }
      };
    }
  }

  /**
   * Select transaction from multiple transactions based on user input
   */
  private selectTransaction(message: string, transactions: Transaction[]): Transaction | null {
    const lowerMessage = message.toLowerCase();

    // Check for transaction ID
    for (const transaction of transactions) {
      if (lowerMessage.includes(transaction.transactionId.toLowerCase())) {
        return transaction;
      }
    }

    // Check for customer name
    for (const transaction of transactions) {
      if (transaction.customerName && lowerMessage.includes(transaction.customerName.toLowerCase())) {
        return transaction;
      }
    }

    // Check for transaction number (Transaction 1, Transaction 2, etc.)
    const transactionMatch = lowerMessage.match(/transaction\s*(\d+)/);
    if (transactionMatch) {
      const index = parseInt(transactionMatch[1]) - 1;
      if (index >= 0 && index < transactions.length) {
        return transactions[index];
      }
    }

    return null;
  }

  /**
   * Extract card digits from message
   */
  private extractCardDigits(message: string): string | null {
    // Look for 4 consecutive digits
    const match = message.match(/\b(\d{4})\b/);
    return match ? match[1] : null;
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
  } {
    return {
      activeSessions: this.sessions.size,
      totalSessions: this.sessions.size
    };
  }
}

export const programmaticChatbotService = new ProgrammaticChatbotService();
