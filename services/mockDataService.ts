import { 
  Transaction, 
  Merchant, 
  SearchTransactionRequest, 
  SearchTransactionResponse,
  TransactionStatus,
  CardType,
  MerchantCategory,
  RefundStatus
} from '../types';

// Mock data for testing
const mockTransactions: Transaction[] = [
  {
    id: '1',
    email: 'juan.perez@gmail.com',
    lastFourDigits: '1234',
    transactionDate: '2025-01-15',
    amount: 49.99,
    merchant: 'TechFlow Solutions',
    transactionId: 'SA04149207',
    status: TransactionStatus.COMPLETED,
    customerName: 'Juan Pérez',
    cardType: CardType.VISA,
    refundStatus: RefundStatus.NONE,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    email: 'maria.garcia@hotmail.com',
    lastFourDigits: '5678',
    transactionDate: '2025-01-14',
    amount: 29.99,
    merchant: 'Digital Services Inc',
    transactionId: 'SA04149208',
    status: TransactionStatus.COMPLETED,
    customerName: 'María García',
    cardType: CardType.MASTERCARD,
    refundStatus: RefundStatus.NONE,
    createdAt: '2025-01-14T14:20:00Z',
    updatedAt: '2025-01-14T14:20:00Z'
  },
  {
    id: '3',
    email: 'carlos.lopez@yahoo.com',
    lastFourDigits: '9012',
    transactionDate: '2025-01-13',
    amount: 99.99,
    merchant: 'Cloud Solutions Pro',
    transactionId: 'SA04149209',
    status: TransactionStatus.PENDING,
    customerName: 'Carlos López',
    cardType: CardType.AMERICAN_EXPRESS,
    refundStatus: RefundStatus.NONE,
    createdAt: '2025-01-13T09:15:00Z',
    updatedAt: '2025-01-13T09:15:00Z'
  },
  {
    id: '4',
    email: 'ana.martinez@gmail.com',
    lastFourDigits: '3456',
    transactionDate: '2025-01-12',
    amount: 19.99,
    merchant: 'Software Plus',
    transactionId: 'SA04149210',
    status: TransactionStatus.COMPLETED,
    customerName: 'Ana Martínez',
    cardType: CardType.VISA,
    refundStatus: RefundStatus.REQUESTED,
    createdAt: '2025-01-12T16:45:00Z',
    updatedAt: '2025-01-12T16:45:00Z'
  }
];

const mockMerchants: Merchant[] = [
  {
    id: '1',
    merchantName: 'TechFlow Solutions',
    merchantCode: 'TFS001',
    description: 'Software development and cloud solutions provider',
    category: MerchantCategory.SOFTWARE,
    isActive: true
  },
  {
    id: '2',
    merchantName: 'Digital Services Inc',
    merchantCode: 'DSI002',
    description: 'Digital marketing and web services',
    category: MerchantCategory.SERVICES,
    isActive: true
  },
  {
    id: '3',
    merchantName: 'Cloud Solutions Pro',
    merchantCode: 'CSP003',
    description: 'Cloud infrastructure and hosting services',
    category: MerchantCategory.SOFTWARE,
    isActive: true
  },
  {
    id: '4',
    merchantName: 'Software Plus',
    merchantCode: 'SP004',
    description: 'Software licensing and subscriptions',
    category: MerchantCategory.SUBSCRIPTION,
    isActive: true
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockDataService {
  /**
   * Search for transactions based on provided criteria
   */
  static async searchTransactions(
    searchRequest: SearchTransactionRequest
  ): Promise<SearchTransactionResponse> {
    await delay(800); // Simulate API call delay
    
    const { email, lastFourDigits, transactionDate, amount, orderNumber } = searchRequest;
    
    // Filter transactions based on search criteria
    let filteredTransactions = mockTransactions.filter(transaction => {
      // Email match (case insensitive, partial match)
      const emailMatch = transaction.email.toLowerCase().includes(email.toLowerCase());
      
      // Last four digits exact match
      const lastFourMatch = transaction.lastFourDigits === lastFourDigits;
      
      // Date match (exact date or within a day range)
      const transactionDateObj = new Date(transaction.transactionDate);
      const searchDateObj = new Date(transactionDate);
      const dateMatch = Math.abs(transactionDateObj.getTime() - searchDateObj.getTime()) < 24 * 60 * 60 * 1000; // Within 24 hours
      
      // Optional amount match (within 5% tolerance)
      let amountMatch = true;
      if (amount) {
        const searchAmount = parseFloat(amount.replace(/[^0-9.-]/g, ''));
        const tolerance = Math.abs(transaction.amount - searchAmount) / transaction.amount;
        amountMatch = tolerance <= 0.05; // 5% tolerance
      }
      
      // Optional order number match
      let orderMatch = true;
      if (orderNumber) {
        orderMatch = transaction.transactionId.toLowerCase().includes(orderNumber.toLowerCase()) ||
                    transaction.merchant.toLowerCase().includes(orderNumber.toLowerCase());
      }
      
      return emailMatch && lastFourMatch && dateMatch && amountMatch && orderMatch;
    });
    
    // Sort by most recent first
    filteredTransactions.sort((a, b) => 
      new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    );
    
    return {
      transactions: filteredTransactions,
      totalCount: filteredTransactions.length,
      hasMore: false
    };
  }
  
  /**
   * Get transaction by ID
   */
  static async getTransactionById(id: string): Promise<Transaction | null> {
    await delay(300);
    
    const transaction = mockTransactions.find(t => t.id === id);
    return transaction || null;
  }
  
  /**
   * Get all merchants
   */
  static async getMerchants(): Promise<Merchant[]> {
    await delay(500);
    
    return mockMerchants.filter(merchant => merchant.isActive);
  }
  
  /**
   * Get merchant by ID
   */
  static async getMerchantById(id: string): Promise<Merchant | null> {
    await delay(200);
    
    const merchant = mockMerchants.find(m => m.id === id);
    return merchant || null;
  }
  
  /**
   * Simulate a refund request
   */
  static async requestRefund(transactionId: string, reason?: string): Promise<boolean> {
    await delay(1000);
    
    const transaction = mockTransactions.find(t => t.transactionId === transactionId);
    if (transaction && transaction.status === TransactionStatus.COMPLETED) {
      transaction.refundStatus = RefundStatus.REQUESTED;
      transaction.updatedAt = new Date().toISOString();
      return true;
    }
    
    return false;
  }
  
  /**
   * Simulate subscription cancellation
   */
  static async cancelSubscription(transactionId: string): Promise<boolean> {
    await delay(800);
    
    const transaction = mockTransactions.find(t => t.transactionId === transactionId);
    if (transaction) {
      transaction.status = TransactionStatus.FAILED; // Simulate cancellation
      transaction.updatedAt = new Date().toISOString();
      return true;
    }
    
    return false;
  }
  
  /**
   * Get transaction statistics
   */
  static async getTransactionStats(): Promise<{
    totalTransactions: number;
    completedTransactions: number;
    pendingTransactions: number;
    refundRequests: number;
  }> {
    await delay(400);
    
    const total = mockTransactions.length;
    const completed = mockTransactions.filter(t => t.status === TransactionStatus.COMPLETED).length;
    const pending = mockTransactions.filter(t => t.status === TransactionStatus.PENDING).length;
    const refundRequests = mockTransactions.filter(t => t.refundStatus === RefundStatus.REQUESTED).length;
    
    return {
      totalTransactions: total,
      completedTransactions: completed,
      pendingTransactions: pending,
      refundRequests
    };
  }
}




