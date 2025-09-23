import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { MessageCircle, X, Send, RotateCcw } from "lucide-react";
import { useChatbot, ChatMessage } from "../hooks/useChatbot";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    sendMessage,
    startNewSession,
    clearMessages,
    isTyping
  } = useChatbot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    console.log('handleSendMessage called with:', inputValue);
    if (!inputValue.trim() || isLoading) {
      console.log('Message not sent - empty input or loading');
      return;
    }

    console.log('Calling sendMessage...');
    await sendMessage(inputValue);
    setInputValue("");
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return;
    await sendMessage(suggestion);
  };

  const handleNewSession = () => {
    startNewSession();
    clearMessages();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
        size="sm"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-80 sm:w-96 md:w-[28rem] h-[500px] sm:h-[550px] md:h-[600px] flex flex-col shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-amber-50 dark:bg-amber-900/30">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-amber-600 dark:bg-amber-500 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Virtual Assistant</h3>
            <p className="text-xs text-amber-600 dark:text-amber-400">Sterling & Associates</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewSession}
            className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-800 text-amber-600 dark:text-amber-400"
            title="New conversation"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">New conversation</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-800 text-amber-600 dark:text-amber-400"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close chat</span>
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "assistant"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm"
                    : "bg-amber-600 dark:bg-amber-500 text-white shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.message}</div>
              </div>
            </div>
            
            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && message.role === "assistant" && (
              <div className="flex flex-wrap gap-2 mt-2 ml-0">
                {message.suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs h-8 px-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-600"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {(isTyping || isLoading) && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-pulse delay-150"></div>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">Typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-amber-500 focus:ring-amber-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="h-10 w-10 p-0 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Powered by AI • Real-time responses
        </p>
      </div>
    </Card>
  );
}