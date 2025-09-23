import { GoogleGenerativeAI } from '@google/generative-ai';
import { Transaction, SearchTransactionRequest, AirtableTransaction } from '../types';

export interface ChatContext {
  sessionId: string;
  userEmail?: string;
  lastFourDigits?: string;
  transactionDate?: string;
  amount?: string;
  orderNumber?: string;
  foundTransactions?: Transaction[];
  airtableTransaction?: AirtableTransaction;
  currentStep: 'greeting' | 'collecting_email' | 'collecting_card' | 'collecting_date' | 'searching' | 'results' | 'action_selection' | 'processing_action';
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
  }>;
}

export interface ChatResponse {
  message: string;
  context: ChatContext;
  actionRequired?: 'collect_email' | 'collect_card' | 'collect_date' | 'search_transactions' | 'show_results' | 'process_refund' | 'process_cancel' | 'process_payment_update';
  suggestions?: string[];
  needsHumanAgent?: boolean;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key';
    console.log('Initializing Gemini service with API key:', apiKey ? 'Present' : 'Missing');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Gemini service initialized successfully');
  }

  /**
   * Generate system prompt for the chatbot
   */
  private getSystemPrompt(): string {
    return `You are a virtual assistant specialized in helping Sterling & Associates customers find their transactions and resolve billing issues.

INSTRUCTIONS:
1. Be friendly, professional, and helpful
2. Communicate in natural English
3. Help collect information to search for transactions
4. Provide clear action options
5. If you can't find information, offer alternatives

CONVERSATION FLOW:
1. Greeting and explanation of how you can help
2. Collect last 4 digits of card (REQUIRED)
3. Optionally collect transaction date to narrow search
4. Search transactions using only card digits
5. Show results and action options

ACTION OPTIONS:
- Request refund
- Cancel subscription
- Update payment method
- Get more information

RESPONSES:
- Be concise but informative
- Use appropriate emojis
- Provide clear options
- If you don't understand something, ask for clarification

RESPONSE FORMAT:
Always end your response indicating the next step or available options.`;
  }

  /**
   * Process user message and return AI response
   */
  async processMessage(
    userMessage: string,
    context: ChatContext
  ): Promise<ChatResponse> {
    try {
      console.log('Processing message with Gemini:', { userMessage, context });
      
      // Build conversation history for context
      const conversationHistory = context.conversationHistory
        .map(msg => `${msg.role}: ${msg.message}`)
        .join('\n');

      // Create the prompt with context
      const prompt = `
${this.getSystemPrompt()}

CURRENT CONTEXT:
- Current step: ${context.currentStep}
- Email collected: ${context.userEmail || 'No'}
- Last 4 digits: ${context.lastFourDigits || 'No'}
- Date: ${context.transactionDate || 'No'}
- Transactions found: ${context.foundTransactions?.length || 0}

CONVERSATION HISTORY:
${conversationHistory}

USER MESSAGE: ${userMessage}

Respond naturally and helpfully. Indicate what information you need next or what options are available.`;

      console.log('Sending prompt to Gemini...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiMessage = response.text();
      console.log('Gemini response received:', aiMessage);

      // Update context with new message
      const updatedContext: ChatContext = {
        ...context,
        conversationHistory: [
          ...context.conversationHistory,
          { role: 'user', message: userMessage, timestamp: new Date().toISOString() },
          { role: 'assistant', message: aiMessage, timestamp: new Date().toISOString() }
        ]
      };

      // Determine next action based on context and message
      const actionRequired = this.determineNextAction(userMessage, updatedContext);

      // Generate suggestions based on current step
      const suggestions = this.generateSuggestions(updatedContext);

      return {
        message: aiMessage,
        context: updatedContext,
        actionRequired,
        suggestions,
        needsHumanAgent: this.shouldEscalateToHuman(userMessage, updatedContext)
      };

    } catch (error) {
      console.error('Error processing message with Gemini:', error);
      
      return {
        message: 'I apologize, I\'m experiencing technical difficulties. Could you please try again or contact our support team?',
        context: context,
        actionRequired: undefined,
        suggestions: ['Try again', 'Contact support'],
        needsHumanAgent: true
      };
    }
  }

  /**
   * Determine what action is required based on the message and context
   */
  private determineNextAction(userMessage: string, context: ChatContext): ChatResponse['actionRequired'] {
    const message = userMessage.toLowerCase();

    // Check if user provided email
    if (this.containsEmail(userMessage) && !context.userEmail) {
      return 'collect_email';
    }

    // Check if user provided card digits
    if (this.containsCardDigits(userMessage) && !context.lastFourDigits) {
      return 'collect_card';
    }

    // Check if user provided date
    if (this.containsDate(userMessage) && !context.transactionDate) {
      // If we already have card digits, search immediately after collecting date
      if (context.lastFourDigits) {
        return 'search_transactions';
      }
      return 'collect_date';
    }

    // Check if user wants to search and we have the required information
    if (context.lastFourDigits && (message.includes('search') || message.includes('find') || message.includes('transaction') || message.includes('look') || message.includes('help'))) {
      return 'search_transactions';
    }

    // Check for action requests
    if (message.includes('refund') || message.includes('return')) {
      return 'process_refund';
    }

    if (message.includes('cancel') || message.includes('suspend')) {
      return 'process_cancel';
    }

    if (message.includes('update') || message.includes('change') || message.includes('payment')) {
      return 'process_payment_update';
    }

    return undefined;
  }

  /**
   * Generate contextual suggestions for the user
   */
  private generateSuggestions(context: ChatContext): string[] {
    switch (context.currentStep) {
      case 'greeting':
        return ['Find my transaction', 'Help with a charge', 'General information'];
      
      case 'collecting_email':
        return ['Provide my email', 'Why do you need my email?'];
      
      case 'collecting_card':
        return ['Provide last 4 digits', 'Where do I find this?'];
      
      case 'collecting_date':
        return ['Provide date', 'Approximate date is fine'];
      
      case 'searching':
        return ['Wait for results', 'Provide more information'];
      
      case 'results':
        return ['Request refund', 'Cancel subscription', 'Update payment'];
      
      default:
        return ['Help', 'Contact support'];
    }
  }

  /**
   * Check if message contains an email
   */
  private containsEmail(message: string): boolean {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    return emailRegex.test(message);
  }

  /**
   * Check if message contains card digits
   */
  private containsCardDigits(message: string): boolean {
    const cardRegex = /\b\d{4}\b/;
    return cardRegex.test(message);
  }

  /**
   * Check if message contains a date
   */
  private containsDate(message: string): boolean {
    const dateRegex = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/;
    return dateRegex.test(message);
  }

  /**
   * Determine if conversation should be escalated to human agent
   */
  private shouldEscalateToHuman(message: string, context: ChatContext): boolean {
    const message_lower = message.toLowerCase();
    
    // Check for frustration indicators
    const frustrationKeywords = ['frustrated', 'angry', 'mad', 'not working', 'terrible', 'awful'];
    if (frustrationKeywords.some(keyword => message_lower.includes(keyword))) {
      return true;
    }

    // Check for complex requests
    const complexKeywords = ['lawsuit', 'lawyer', 'legal', 'complaint', 'sue'];
    if (complexKeywords.some(keyword => message_lower.includes(keyword))) {
      return true;
    }

    // Check conversation length
    if (context.conversationHistory.length > 20) {
      return true;
    }

    return false;
  }

  /**
   * Extract email from message
   */
  extractEmail(message: string): string | null {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = message.match(emailRegex);
    return match ? match[0] : null;
  }

  /**
   * Extract card digits from message
   */
  extractCardDigits(message: string): string | null {
    const cardRegex = /\b\d{4}\b/;
    const match = message.match(cardRegex);
    return match ? match[0] : null;
  }

  /**
   * Extract date from message
   */
  extractDate(message: string): string | null {
    const dateRegex = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/;
    const match = message.match(dateRegex);
    return match ? match[0] : null;
  }
}

export const geminiService = new GeminiService();
