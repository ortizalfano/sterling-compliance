import { AirtableTransaction, ApiResponse, RefundStatusAirtable } from '../types';

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

interface AirtableRecord {
  id: string;
  fields: AirtableTransaction;
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

class AirtableService {
  private config: AirtableConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_AIRTABLE_API_KEY || '',
      baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
      tableName: import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Transactions'
    };
    
    this.baseUrl = `https://api.airtable.com/v0/${this.config.baseId}/${this.config.tableName}`;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Search transactions by last 4 digits only
   */
  async searchTransactionsByCard(lastFourDigits: string, transactionDate?: string): Promise<ApiResponse<AirtableTransaction[]>> {
    try {
      console.log('🔧 AirtableService.searchTransactionsByCard called with:', { lastFourDigits, transactionDate });
      
      if (!this.config.apiKey || !this.config.baseId) {
        console.log('❌ Airtable configuration missing:', { 
          hasApiKey: !!this.config.apiKey, 
          hasBaseId: !!this.config.baseId,
          apiKey: this.config.apiKey ? '***' + this.config.apiKey.slice(-4) : 'missing',
          baseId: this.config.baseId ? '***' + this.config.baseId.slice(-4) : 'missing'
        });
        return {
          success: false,
          error: 'Airtable configuration missing. Please check your environment variables.'
        };
      }

      // Build filter formula for Airtable - search for last 4 digits at the end of the field
      // Since the format is xxxxxxxxxxxx1234, we need to check if the field ends with the 4 digits
      let filterFormula = `RIGHT({Card Number}, 4) = "${lastFourDigits}"`;
      let dateFilter = '';
      
      if (transactionDate) {
        // Parse date correctly - handle MM/DD/YYYY format
        let date: Date;
        if (transactionDate.includes('/')) {
          const parts = transactionDate.split('/');
          if (parts.length === 3) {
            // Handle MM/DD/YYYY format
            const [month, day, year] = parts;
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            console.log('🔧 Date parsing MM/DD/YYYY:', { 
              input: transactionDate, 
              parts, 
              month: parseInt(month), 
              day: parseInt(day), 
              year: parseInt(year),
              parsed: date,
              iso: date.toISOString()
            });
          } else {
            date = new Date(transactionDate);
          }
        } else {
          date = new Date(transactionDate);
        }
        
        // Validate date
        if (isNaN(date.getTime())) {
          console.log('❌ Invalid date format:', transactionDate);
          // Don't add date filter if invalid
        } else {
          const isoDate = date.toISOString().split('T')[0];
          console.log('🔧 Parsed date:', { input: transactionDate, parsed: date, iso: isoDate });
          
          // Use simple date filtering approach
          const startOfDay = `${isoDate}T00:00:00.000Z`;
          const endOfDay = `${isoDate}T23:59:59.999Z`;
          // Use simpler syntax without complex AND operations
          dateFilter = `, {Created} >= "${startOfDay}", {Created} <= "${endOfDay}"`;
        }
      }
      
      filterFormula += dateFilter;

      console.log('🔧 Filter formula:', filterFormula);

      const params = new URLSearchParams({
        filterByFormula: filterFormula,
        maxRecords: '100'
      });

      const url = `${this.baseUrl}?${params}`;
      console.log('🔧 Request URL:', url);

      const response = await fetch(url, {
        headers: this.getHeaders()
      });

      console.log('🔧 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Airtable API error details:', { status: response.status, statusText: response.statusText, body: errorText });
        throw new Error(`Airtable API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: AirtableResponse = await response.json();
      
      const transactions = data.records.map(record => record.fields);

      return {
        success: true,
        data: transactions
      };

    } catch (error) {
      console.error('Error searching transactions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search transactions'
      };
    }
  }

  /**
   * Search transactions by email and last 4 digits (legacy method)
   */
  async searchTransactions(email: string, lastFourDigits: string, transactionDate?: string): Promise<ApiResponse<AirtableTransaction[]>> {
    try {
      if (!this.config.apiKey || !this.config.baseId) {
        return {
          success: false,
          error: 'Airtable configuration missing. Please check your environment variables.'
        };
      }

      // Build filter formula for Airtable
      let filterFormula = `AND({Customer} = "${email}", RIGHT({Card Number}, 4) = "${lastFourDigits}")`;
      
      if (transactionDate) {
        const date = new Date(transactionDate);
        const isoDate = date.toISOString().split('T')[0];
        filterFormula += `, AND(IS_SAME({Created}, "${isoDate}", "day"))`;
      }

      const params = new URLSearchParams({
        filterByFormula: filterFormula,
        maxRecords: '100'
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data: AirtableResponse = await response.json();
      
      const transactions = data.records.map(record => record.fields);

      return {
        success: true,
        data: transactions
      };

    } catch (error) {
      console.error('Error searching transactions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search transactions'
      };
    }
  }

  /**
   * Get transaction by Transaction ID
   */
  async getTransactionById(transactionId: string): Promise<ApiResponse<AirtableTransaction | null>> {
    try {
      if (!this.config.apiKey || !this.config.baseId) {
        return {
          success: false,
          error: 'Airtable configuration missing. Please check your environment variables.'
        };
      }

      const filterFormula = `{Transaction ID} = "${transactionId}"`;
      const params = new URLSearchParams({
        filterByFormula: filterFormula,
        maxRecords: '1'
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data: AirtableResponse = await response.json();
      
      if (data.records.length === 0) {
        return {
          success: true,
          data: null
        };
      }

      return {
        success: true,
        data: data.records[0].fields
      };

    } catch (error) {
      console.error('Error getting transaction by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transaction'
      };
    }
  }

  /**
   * Create a new transaction record
   */
  async createTransaction(transaction: Omit<AirtableTransaction, 'Created'>): Promise<ApiResponse<AirtableTransaction>> {
    try {
      if (!this.config.apiKey || !this.config.baseId) {
        return {
          success: false,
          error: 'Airtable configuration missing. Please check your environment variables.'
        };
      }

      const record = {
        fields: {
          ...transaction,
          Created: new Date().toISOString()
        }
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ records: [record] })
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const createdTransaction = data.records[0].fields as AirtableTransaction;

      return {
        success: true,
        data: createdTransaction
      };

    } catch (error) {
      console.error('Error creating transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create transaction'
      };
    }
  }

  /**
   * Update an existing transaction
   */
  async updateTransaction(recordId: string, updates: Partial<AirtableTransaction>): Promise<ApiResponse<AirtableTransaction>> {
    try {
      if (!this.config.apiKey || !this.config.baseId) {
        return {
          success: false,
          error: 'Airtable configuration missing. Please check your environment variables.'
        };
      }

      const record = {
        id: recordId,
        fields: updates
      };

      const response = await fetch(this.baseUrl, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ records: [record] })
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const updatedTransaction = data.records[0].fields as AirtableTransaction;

      return {
        success: true,
        data: updatedTransaction
      };

    } catch (error) {
      console.error('Error updating transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update transaction'
      };
    }
  }

  /**
   * Test connection to Airtable
   */
  async testConnection(): Promise<ApiResponse<boolean>> {
    try {
      if (!this.config.apiKey || !this.config.baseId) {
        return {
          success: false,
          error: 'Airtable configuration missing. Please check your environment variables.'
        };
      }

      const response = await fetch(`${this.baseUrl}?maxRecords=1`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      return {
        success: true,
        data: true
      };

    } catch (error) {
      console.error('Error testing Airtable connection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to Airtable'
      };
    }
  }

  /**
   * Check if a refund has already been requested for a transaction
   */
  async checkRefundStatus(transactionId: string): Promise<ApiResponse<{
    hasRefundRequest: boolean;
    refundStatus?: RefundStatusAirtable;
    refundRequestDate?: string;
    refundRequestEmail?: string;
    canRequestRefund: boolean;
  }>> {
    try {
      if (!this.config.apiKey || !this.config.baseId) {
        return {
          success: false,
          error: 'Airtable configuration missing. Please check your environment variables.'
        };
      }

      const filterFormula = `{Transaction ID} = "${transactionId}"`;
      const params = new URLSearchParams({
        filterByFormula: filterFormula,
        maxRecords: '1'
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data: AirtableResponse = await response.json();
      
      if (data.records.length === 0) {
        return {
          success: true,
          data: {
            hasRefundRequest: false,
            canRequestRefund: true
          }
        };
      }

      const transaction = data.records[0].fields;
      const refundStatus = transaction.refund_status as RefundStatusAirtable;
      const hasRefundRequest = refundStatus && refundStatus !== RefundStatusAirtable.NONE;
      
      // Can request refund if no request exists or if previous request was rejected
      const canRequestRefund = !hasRefundRequest || refundStatus === RefundStatusAirtable.REJECTED;

      return {
        success: true,
        data: {
          hasRefundRequest,
          refundStatus,
          refundRequestDate: transaction.refund_request_date,
          refundRequestEmail: transaction.refund_request_email,
          canRequestRefund
        }
      };

    } catch (error) {
      console.error('Error checking refund status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check refund status'
      };
    }
  }

  /**
   * Request a refund for a transaction (sets status to Requested)
   */
  async requestRefund(transactionId: string, userEmail: string): Promise<ApiResponse<AirtableTransaction>> {
    try {
      if (!this.config.apiKey || !this.config.baseId) {
        return {
          success: false,
          error: 'Airtable configuration missing. Please check your environment variables.'
        };
      }

      // First, get the record ID for the transaction
      const transactionResponse = await this.getTransactionById(transactionId);
      if (!transactionResponse.success || !transactionResponse.data) {
        return {
          success: false,
          error: 'Transaction not found'
        };
      }

      // Get the record ID from the search
      const filterFormula = `{Transaction ID} = "${transactionId}"`;
      const params = new URLSearchParams({
        filterByFormula: filterFormula,
        maxRecords: '1'
      });

      const searchResponse = await fetch(`${this.baseUrl}?${params}`, {
        headers: this.getHeaders()
      });

      if (!searchResponse.ok) {
        throw new Error(`Airtable API error: ${searchResponse.status} ${searchResponse.statusText}`);
      }

      const searchData: AirtableResponse = await searchResponse.json();
      if (searchData.records.length === 0) {
        return {
          success: false,
          error: 'Transaction record not found'
        };
      }

      const recordId = searchData.records[0].id;
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Update the transaction with refund request data
      const record = {
        id: recordId,
        fields: {
          refund_status: RefundStatusAirtable.REQUESTED,
          refund_request_date: currentDate,
          refund_request_email: userEmail
        }
      };

      const response = await fetch(this.baseUrl, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ records: [record] })
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const updatedTransaction = data.records[0].fields as AirtableTransaction;

      return {
        success: true,
        data: updatedTransaction
      };

    } catch (error) {
      console.error('Error requesting refund:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to request refund'
      };
    }
  }
}

// Create singleton instance
export const airtableService = new AirtableService();
export { AirtableService };

