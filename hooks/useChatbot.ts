import { useState, useEffect, useCallback } from 'react';
import { programmaticChatbotService, ChatbotSession, ChatbotResponse } from '../services/programmaticChatbotService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
  suggestions?: string[];
  isLoading?: boolean;
}

export interface UseChatbotReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  session: ChatbotSession | null;
  sendMessage: (message: string) => Promise<void>;
  startNewSession: () => void;
  clearMessages: () => void;
  isTyping: boolean;
}

export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<ChatbotSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize chatbot session
  useEffect(() => {
    if (!session) {
      const newSession = programmaticChatbotService.startSession();
      setSession(newSession);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        message: 'Hello! 👋 I\'m your virtual assistant for Sterling & Associates. I can help you find your transactions and resolve billing issues. How can I assist you today?',
        timestamp: new Date().toISOString(),
        suggestions: ['Find my transaction', 'Help with a charge', 'Request refund']
      };
      
      setMessages([welcomeMessage]);
    }
  }, [session]);

  // Send message to chatbot
  const sendMessage = useCallback(async (message: string) => {
    if (!session || isLoading) return;

    console.log('Sending message:', message);
    console.log('Session:', session);

    const userMessageId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Process message with programmatic chatbot
      console.log('Processing message with programmatic chatbot service...');
      const response: ChatbotResponse = await programmaticChatbotService.processMessage(session.id, message);
      console.log('Programmatic chatbot response:', response);
      
      // Update session
      setSession(prev => prev ? { ...prev, state: response.state } : null);

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        message: response.message,
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions,
        isLoading: false
      };

      // Add assistant message
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        message: 'I apologize, there was a problem processing your message. Please try again.',
        timestamp: new Date().toISOString(),
        suggestions: ['Try again', 'Contact support']
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [session, isLoading]);

  // Start new session
  const startNewSession = useCallback(() => {
    const newSession = programmaticChatbotService.startSession();
    setSession(newSession);
    
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      message: 'Hello! 👋 I\'m your virtual assistant for Sterling & Associates. I can help you find your transactions and resolve billing issues. How can I assist you today?',
      timestamp: new Date().toISOString(),
      suggestions: ['Find my transaction', 'Help with a charge', 'Request refund']
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    session,
    sendMessage,
    startNewSession,
    clearMessages,
    isTyping
  };
}
