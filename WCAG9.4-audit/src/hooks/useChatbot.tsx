import { useState, useCallback, useEffect } from 'react';
import { Message, ChatSettings } from '../types/chat';

// Initial chat settings with sensible defaults
const defaultSettings: ChatSettings = {
  greeting: "Hi there! How can I help you with your accessibility questions today?",
  enableAutoSuggestions: true,
  enableContentScanning: true,
  scanningFrequency: 'daily',
  aiModel: 'gpt-3.5',
  maxHistoryLength: 50,
  autoLearningEnabled: true,
};

// Load settings from localStorage or use defaults
const loadSettings = (): ChatSettings => {
  try {
    const saved = localStorage.getItem('chatbot-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  } catch (error) {
    console.error('Error loading chatbot settings:', error);
    return defaultSettings;
  }
};

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>(loadSettings);
  
  // Load chat history from localStorage on initial mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatbot-messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        // Only store the last N messages based on settings
        const messagesForStorage = messages.slice(-settings.maxHistoryLength);
        localStorage.setItem('chatbot-messages', JSON.stringify(messagesForStorage));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages, settings.maxHistoryLength]);
  
  // Mock API response generation (in a real app, this would call your API)
  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert user message to lowercase for easier matching
    const message = userMessage.toLowerCase();
    
    // Basic greetings
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! How can I assist you with accessibility today?";
    }
    
    // How it works questions
    if (message.includes('how') && (message.includes('work') || message.includes('use') || message.includes('help'))) {
      return "I'm your accessibility assistant! I can answer questions about WCAG standards, provide guidance on making your site more accessible, and help you navigate our accessibility toolkit. Just type your question, and I'll do my best to assist you.";
    }
    
    // WCAG related questions
    if (message.includes('wcag')) {
      return "WCAG (Web Content Accessibility Guidelines) are developed through the W3C process in cooperation with individuals and organizations around the world, with a goal of providing a single shared standard for web content accessibility that meets the needs of individuals, organizations, and governments internationally.";
    }
    
    // Contrast related questions
    if (message.includes('contrast')) {
      return "Sufficient color contrast is important for users with low vision. WCAG 2.1 requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. You can use our color contrast checker tool to verify your color choices.";
    }
    
    // Keyboard accessibility
    if (message.includes('keyboard')) {
      return "Keyboard accessibility is one of the most important aspects of web accessibility. Many users with motor disabilities rely on a keyboard or keyboard-like device. Our platform can help you test keyboard navigation and identify issues.";
    }
    
    // Toolbar questions
    if ((message.includes('toolbar') || message.includes('tool')) && message.includes('accessibility')) {
      return "The accessibility toolbar at the bottom right of your screen (green glasses icon) provides tools to customize your experience, including text size adjustment, contrast options, and focus highlighting. Click it to explore all available accessibility features.";
    }
    
    // What is this app
    if (message.includes('what') && (message.includes('app') || message.includes('website') || message.includes('tool'))) {
      return "This is the WCAG 9.4 Accessibility Audit platform, a comprehensive toolkit that helps developers and content creators ensure their websites meet accessibility standards. We provide testing tools, guidance resources, and monitoring capabilities to make the web more accessible to everyone.";
    }
    
    // Default response for other queries
    return "Thank you for your question. Our accessibility experts are continually improving this assistant. For detailed information on this topic, you might want to check our knowledge base or WCAG resources section.";
  };
  
  // Function to send a message
  const sendMessage = useCallback(async (content: string) => {
    // Add user message to the chat
    const userMessage: Message = { role: 'user', content, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    
    // Generate bot response
    setIsLoading(true);
    try {
      // Log user query for analytics (in a real app, this would be server-side)
      console.log('[Chatbot Analytics] User query:', content);
      
      const responseContent = await generateBotResponse(content);
      
      // Add bot response to the chat
      const botMessage: Message = { 
        role: 'assistant', 
        content: responseContent, 
        timestamp: new Date().toISOString() 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.', 
        timestamp: new Date().toISOString() 
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update settings
  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // Persist settings to localStorage
      localStorage.setItem('chatbot-settings', JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  // Clear chat history
  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('chatbot-messages');
  }, []);
  
  return { 
    messages, 
    sendMessage, 
    isLoading, 
    settings,
    updateSettings,
    clearHistory
  };
}