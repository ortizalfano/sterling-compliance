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
  step: 'greeting' | 'collecting_card' | 'collecting_date' | 'searching' | 'results' | 'processing';
  lastFourDigits?: string;
  transactionDate?: string;
  foundTransactions?: Transaction[];
  selectedTransaction?: Transaction;
  airtableTransaction?: AirtableTransaction;
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
        return this.handleCardCollection(message, state);

      case 'collecting_date':
        return this.handleDateCollection(message, state);

      case 'searching':
        return await this.handleSearching(message, state);

      case 'results':
        return this.handleResults(message, state);

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
        message: `Hello! 👋 I'm your virtual assistant for Sterling & Associates. I can help you find your transactions and resolve billing issues.

To get started, I'll need the **last 4 digits of your card**. This is the only required information.

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
   * Handle card collection step
   */
  private handleCardCollection(message: string, state: ChatbotState): ChatbotResponse {
    const cardDigits = this.extractCardDigits(message);
    
    if (cardDigits) {
      return {
        message: `Perfect! I have your card ending in **${cardDigits}**.

Now I can search for your transactions. If you remember the approximate date of your transaction, you can provide it to help narrow down the results (this is optional).

You can provide the date in any of these formats:
• MM/DD/YYYY (e.g., 01/15/2025)
• Month Day, Year (e.g., January 15, 2025)
• Just the month and year (e.g., January 2025)

Or you can just say "search" or "find my transaction" to search with just the card digits.`,
        suggestions: ['Search now', 'I remember the date', 'Skip date'],
        state: { ...state, lastFourDigits: cardDigits, step: 'collecting_date' }
      };
    }

    return {
      message: `I need the **last 4 digits of your card** to search for your transaction. Please provide exactly 4 digits (numbers only).

For example: 1234`,
      suggestions: ['I have my card ready'],
      state: { ...state, step: 'collecting_card' }
    };
  }

  /**
   * Handle date collection step
   */
  private async handleDateCollection(message: string, state: ChatbotState): Promise<ChatbotResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Check if user wants to skip date or search now
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || 
        lowerMessage.includes('skip') || lowerMessage.includes('no date') ||
        lowerMessage.includes('don\'t remember') || lowerMessage.includes('dont remember')) {
      
      // Execute search immediately
      return await this.executeSearch(state);
    }

    // Try to extract date
    const date = this.extractDate(message);
    if (date) {
      // Execute search immediately
      return await this.executeSearch({ ...state, transactionDate: date });
    }

    return {
      message: `I understand you want to provide a date, but I couldn't parse the date format you used.

Please provide the date in one of these formats:
• MM/DD/YYYY (e.g., 01/15/2025)
• Month Day, Year (e.g., January 15, 2025)
• Just the month and year (e.g., January 2025)

Or you can say "search" to search without a specific date.`,
      suggestions: ['Search without date', 'Try again with date'],
      state: { ...state, step: 'collecting_date' }
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
        date: state.transactionDate,
        searchType: 'byCard'
      });
      
      // Search in Airtable
      const result = await airtableService.searchTransactionsByCard(
        state.lastFourDigits,
        state.transactionDate
      );

      console.log('📊 Search result:', result);
      console.log('📊 Result success:', result.success);
      console.log('📊 Result data length:', result.data?.length || 0);
      console.log('📊 Result error:', result.error);

      if (!result.success || !result.data || result.data.length === 0) {
        // Debug: Try a broader search to see what's available
        console.log('🔍 No results found, trying broader search...');
        
        // Try search without date filter to see if there are any transactions with these digits
        const broaderResult = await airtableService.searchTransactionsByCard(state.lastFourDigits);
        console.log('🔍 Broader search result:', broaderResult);
        
        // Run comprehensive tests
        const testResults = await this.testSearchCombinations(state.lastFourDigits);
        
        let debugMessage = `I couldn't find any transactions with the card ending in **${state.lastFourDigits}**${state.transactionDate ? ` for the date **${state.transactionDate}**` : ''}.

**Debug Info:**
• Search parameters: ${JSON.stringify({ lastFourDigits: state.lastFourDigits, date: state.transactionDate })}
• Broader search (without date): ${broaderResult.success ? `Found ${broaderResult.data?.length || 0} transactions` : `Error: ${broaderResult.error}`}

${testResults}`;

        if (broaderResult.success && broaderResult.data && broaderResult.data.length > 0) {
          debugMessage += `\n\n**Available transactions with these digits:**`;
          broaderResult.data.slice(0, 3).forEach((transaction, index) => {
            debugMessage += `\n• Transaction ${index + 1}: ${transaction.customerName || transaction.Customer} - $${transaction.amount || transaction.Amount} - ${new Date(transaction.transactionDate || transaction.Created).toLocaleDateString()}`;
          });
        }

        debugMessage += `\n\nPlease verify:
• The last 4 digits are correct
• The date is correct (if provided)

Would you like to try again with different information?`;

        return {
          message: debugMessage,
          suggestions: ['Try different card digits', 'Try different date', 'Contact support'],
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
   * Handle results step
   */
  private handleResults(message: string, state: ChatbotState): ChatbotResponse {
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
      return {
        message: 'I\'ll process your refund request now.',
        suggestions: [],
        state: { ...state, step: 'processing' }
      };
    }

    if (lowerMessage.includes('cancel') || lowerMessage.includes('subscription')) {
      return {
        message: 'I\'ll process your cancellation request now.',
        suggestions: [],
        state: { ...state, step: 'processing' }
      };
    }

    if (lowerMessage.includes('update') || lowerMessage.includes('payment method')) {
      return {
        message: 'I\'ll process your payment method update request now.',
        suggestions: [],
        state: { ...state, step: 'processing' }
      };
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
  private async handleProcessing(message: string, state: ChatbotState): Promise<ChatbotResponse> {
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

    const lowerMessage = message.toLowerCase();
    const transaction = state.selectedTransaction;

    try {
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
      let actionType;

      if (lowerMessage.includes('refund') || lowerMessage.includes('money back')) {
        emailResult = await emailService.sendRefundRequest(emailData);
        actionType = 'refund';
      } else if (lowerMessage.includes('cancel') || lowerMessage.includes('subscription')) {
        emailResult = await emailService.sendCancellationRequest(emailData);
        actionType = 'cancellation';
      } else if (lowerMessage.includes('update') || lowerMessage.includes('payment method')) {
        emailResult = await emailService.sendPaymentUpdateRequest(emailData);
        actionType = 'payment update';
      } else {
        return {
          message: 'I\'m not sure what action you want to take. Please specify if you want a refund, cancellation, or payment method update.',
          suggestions: ['Request refund', 'Cancel subscription', 'Update payment method'],
          state: { ...state, step: 'results' }
        };
      }

      if (emailResult.success) {
        return {
          message: `✅ **${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Request Processed**

Your ${actionType} request for transaction ${transaction.transactionId} has been processed and sent to our support team.

📧 You'll receive a confirmation email within the next few hours
⏱️ The ${actionType} will be processed in 3-5 business days
💳 It will be applied to the card ending in ${transaction.lastFourDigits}

Is there anything else I can help you with?`,
          suggestions: ['Check status', 'Another inquiry', 'End conversation'],
          state: { ...state, step: 'greeting' } // Reset to greeting for new inquiries
        };
      } else {
        return {
          message: `⚠️ **${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Request Submitted**

Your ${actionType} request for transaction ${transaction.transactionId} has been submitted, but there was an issue sending the confirmation email.

📧 Our team will process your request manually
⏱️ You should receive confirmation within 24 hours
💳 The ${actionType} will be applied to the card ending in ${transaction.lastFourDigits}

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
   * Test different search combinations to debug data issues
   */
  private async testSearchCombinations(lastFourDigits: string): Promise<string> {
    console.log('🧪 Testing different search combinations...');
    
    const results = {
      withDate: null as any,
      withoutDate: null as any,
      differentDigits: null as any
    };
    
    try {
      // Test with date
      console.log('🧪 Testing with date...');
      results.withDate = await airtableService.searchTransactionsByCard(lastFourDigits, '2025-07-06');
      
      // Test without date
      console.log('🧪 Testing without date...');
      results.withoutDate = await airtableService.searchTransactionsByCard(lastFourDigits);
      
      // Test with different digits (1234 -> 1235)
      console.log('🧪 Testing with different digits...');
      const altDigits = lastFourDigits.slice(0, 3) + (parseInt(lastFourDigits.slice(-1)) + 1).toString();
      results.differentDigits = await airtableService.searchTransactionsByCard(altDigits);
      
      console.log('🧪 Test results:', results);
      
      return `**Search Test Results:**
• With date: ${results.withDate.success ? `${results.withDate.data?.length || 0} found` : results.withDate.error}
• Without date: ${results.withoutDate.success ? `${results.withoutDate.data?.length || 0} found` : results.withoutDate.error}
• Different digits (${altDigits}): ${results.differentDigits.success ? `${results.differentDigits.data?.length || 0} found` : results.differentDigits.error}`;
      
    } catch (error) {
      console.error('🧪 Test error:', error);
      return `Test failed: ${error}`;
    }
  }

  /**
   * Extract date from message
   */
  private extractDate(message: string): string | null {
    // Try various date formats
    const formats = [
      // MM/DD/YYYY
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      // Month DD, YYYY
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/i,
      // Month YYYY
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i
    ];

    for (const format of formats) {
      const match = message.match(format);
      if (match) {
        return match[0];
      }
    }

    return null;
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
