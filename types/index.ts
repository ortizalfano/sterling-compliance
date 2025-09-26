// Core entity types
export interface Transaction {
  id: string;
  email: string;
  lastFourDigits: string;
  transactionDate: string;
  amount: number;
  merchant: string;
  transactionId: string;
  status: TransactionStatus;
  customerName?: string;
  cardType?: CardType;
  refundStatus?: RefundStatus;
  createdAt: string;
  updatedAt: string;
}

// Airtable Transaction Record (matches the 14 fields specified + 5 refund tracking fields)
export interface AirtableTransaction {
  Created: string; // Date with time
  Invoice: string; // Single line text
  Customer: string; // Single line text
  "Card Number": string; // Single line text
  "Card Type": CardTypeAirtable; // Single select (Visa, Master, Amex, Discover)
  Auth: number; // Number (integer)
  "Transaction ID": string; // Single line text (unique identifier)
  Message: string; // Long text
  User: string; // Single line text
  Source: string; // Single line text
  Response: ResponseType; // Single select (Approved, Declined)
  Status: StatusType; // Single select (Pending, Completed, Refunded)
  Type: TransactionType; // Single select (Credit Card Sale, Refund, Other)
  Amount: number; // Currency (USD)
  // Refund tracking fields
  refund_status?: RefundStatusAirtable; // Single select (None, Requested, Approved, Rejected, Processed)
  refund_request_date?: string; // Date when customer requested refund
  refund_request_email?: string; // Email used to request refund
  refund_approval_date?: string; // Date when team approved/rejected refund
  refund_notes?: string; // Team notes about the refund
}

export interface Merchant {
  id: string;
  merchantName: string;
  merchantCode: string;
  description?: string;
  category: MerchantCategory;
  isActive: boolean;
}

export interface CustomerInquiry {
  id: string;
  email: string;
  inquiryType: InquiryType;
  status: InquiryStatus;
  description: string;
  createdAt: string;
  resolvedAt?: string;
  transactionId?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userMessage: string;
  botResponse: string;
  timestamp: string;
  transactionId?: string;
  responseTime: number;
}

// Enums
export enum TransactionStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  FAILED = 'Failed',
  REFUNDED = 'Refunded'
}

export enum RefundStatus {
  NONE = 'None',
  REQUESTED = 'Requested',
  APPROVED = 'Approved',
  DENIED = 'Denied'
}

// Airtable-specific refund status enum
export enum RefundStatusAirtable {
  NONE = 'None',
  REQUESTED = 'Requested',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PROCESSED = 'Processed'
}

export enum CardType {
  VISA = 'Visa',
  MASTERCARD = 'Mastercard',
  AMERICAN_EXPRESS = 'American Express',
  DISCOVER = 'Discover',
  OTHER = 'Other'
}

export enum MerchantCategory {
  SOFTWARE = 'Software',
  ECOMMERCE = 'E-commerce',
  SUBSCRIPTION = 'Subscription',
  DIGITAL_CONTENT = 'Digital Content',
  SERVICES = 'Services',
  OTHER = 'Other'
}

export enum InquiryType {
  REFUND = 'Refund',
  CANCEL = 'Cancel',
  UPDATE_PAYMENT = 'Update Payment',
  GENERAL = 'General'
}

export enum InquiryStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

// Airtable-specific enums
export enum CardTypeAirtable {
  VISA = 'Visa',
  MASTER = 'Master',
  AMEX = 'Amex',
  DISCOVER = 'Discover'
}

export enum ResponseType {
  APPROVED = 'Approved',
  DECLINED = 'Declined'
}

export enum StatusType {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  REFUNDED = 'Refunded'
}

export enum TransactionType {
  CREDIT_CARD_SALE = 'Credit Card Sale',
  REFUND = 'Refund',
  OTHER = 'Other'
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchTransactionRequest {
  email: string;
  lastFourDigits: string;
  transactionDate: string;
  amount?: string;
  orderNumber?: string;
}

export interface SearchTransactionResponse {
  transactions: Transaction[];
  totalCount: number;
  hasMore: boolean;
}

// Form types
export interface TransactionSearchForm {
  email: string;
  lastFour: string;
  transactionDate: string;
  amount: string;
  orderNumber: string;
}

// Chat types
export interface ChatSession {
  id: string;
  userId?: string;
  startedAt: string;
  lastActivity: string;
  transactionId?: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  transactionId?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  suggestions?: string[];
  needsHumanAgent?: boolean;
}


