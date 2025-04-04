import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../types/chat';

// Simple implementation for now
export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = (content: string) => {
    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // Add to messages
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot response
    setIsLoading(true);
    
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: uuidv4(),
        role: 'bot',
        content: 'Thank you for your message. This is a placeholder response while our chat system is being implemented.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
}