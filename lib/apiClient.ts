import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp to prevent caching
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
        
        // Log request in development
        if (import.meta.env.DEV) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (import.meta.env.DEV) {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response) {
          const { status, data } = error.response;
          
          switch (status) {
            case 400:
              console.error('❌ Bad Request:', data.message || 'Invalid request');
              break;
            case 401:
              console.error('❌ Unauthorized:', 'Please check your credentials');
              break;
            case 403:
              console.error('❌ Forbidden:', 'Access denied');
              break;
            case 404:
              console.error('❌ Not Found:', 'Resource not found');
              break;
            case 429:
              console.error('❌ Rate Limited:', 'Too many requests, please try again later');
              break;
            case 500:
              console.error('❌ Server Error:', 'Internal server error');
              break;
            default:
              console.error('❌ API Error:', data.message || 'Unknown error');
          }
        } else if (error.request) {
          console.error('❌ Network Error:', 'No response received from server');
        } else {
          console.error('❌ Request Setup Error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError<T>(error: any): ApiResponse<T> {
    if (error.response?.data) {
      return {
        success: false,
        error: error.response.data.message || 'API request failed',
        data: undefined,
      };
    }

    if (error.request) {
      return {
        success: false,
        error: 'Network error - please check your connection',
        data: undefined,
      };
    }

    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      data: undefined,
    };
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization header
   */
  removeAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * Update base URL
   */
  updateBaseURL(newBaseURL: string) {
    this.baseURL = newBaseURL;
    this.client.defaults.baseURL = newBaseURL;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };





