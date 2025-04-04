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
  
  // Function to calculate dynamic typing delay based on response length
  const calculateTypingDelay = (response: string): number => {
    // Base delay of 1000ms + additional time for longer responses
    // This creates a more natural feel where longer responses take more time
    const baseDelay = 1000;
    const charsPerSecond = 20; // Simulating typing speed
    const length = response.length;
    
    // Cap the maximum delay at 3500ms to keep it responsive
    return Math.min(baseDelay + (length / charsPerSecond) * 100, 3500);
  };

  // Generate bot response with markdown formatting
  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Convert user message to lowercase for easier matching
    const message = userMessage.toLowerCase();
    let response = "";
    
    // Basic greetings
    if (message.includes('hello') || message.includes('hi')) {
      response = "Hello! How can I assist you with accessibility today?";
    }
    
    // How it works questions
    else if (message.includes('how') && (message.includes('work') || message.includes('use') || message.includes('help'))) {
      response = "I'm your accessibility assistant! I can answer questions about:\n\n" +
        "- **WCAG standards** and compliance requirements\n" +
        "- Guidance on making your site more accessible\n" +
        "- Help navigating our accessibility toolkit\n\n" +
        "Just type your question, and I'll do my best to assist you!";
    }
    
    // WCAG related questions
    else if (message.includes('wcag') && message.includes('compliance')) {
      response = "**WCAG Compliance** refers to meeting the requirements set by the Web Content Accessibility Guidelines.\n\n" +
        "These guidelines are organized into three levels of conformance:\n\n" +
        "- **Level A**: Basic accessibility requirements that must be met\n" +
        "- **Level AA**: The level most organizations should strive for, addressing major barriers\n" +
        "- **Level AAA**: The highest level, providing enhanced accessibility\n\n" +
        "Many organizations aim for WCAG 2.1 AA compliance, which covers a wide range of accessibility needs. Our platform can help you test your site against these guidelines.";
    }
    
    // General WCAG questions
    else if (message.includes('wcag')) {
      response = "**WCAG** (Web Content Accessibility Guidelines) are developed through the W3C process in cooperation with individuals and organizations around the world.\n\n" +
        "The guidelines are organized around four principles, often called **POUR**:\n\n" +
        "1. **Perceivable** - Information must be presentable in ways users can perceive\n" +
        "2. **Operable** - User interface and navigation must be operable\n" +
        "3. **Understandable** - Information and operation must be understandable\n" +
        "4. **Robust** - Content must be robust enough to work with assistive technologies\n\n" +
        "The current versions are WCAG 2.1 (published 2018) and WCAG 2.2 (published 2023).";
    }
    
    // Contrast related questions
    else if (message.includes('contrast')) {
      response = "**Color contrast** is important for users with low vision.\n\n" +
        "WCAG 2.1 requires these minimum contrast ratios:\n" +
        "- Normal text (below 18pt): **4.5:1**\n" +
        "- Large text (18pt or 14pt bold and above): **3:1**\n" +
        "- User interface components and graphical objects: **3:1**\n\n" +
        "You can use our color contrast checker tool to verify your color choices. Simply select your foreground and background colors, and we'll calculate the ratio for you.";
    }
    
    // Keyboard accessibility
    else if (message.includes('keyboard')) {
      response = "**Keyboard accessibility** is one of the most important aspects of web accessibility.\n\n" +
        "Many users with motor disabilities rely on a keyboard or keyboard-like device. This includes:\n\n" +
        "- People who use mouth sticks, head wands, or single-switch devices\n" +
        "- People with tremors who find using a mouse difficult\n" +
        "- People using screen readers\n\n" +
        "Key requirements include:\n" +
        "- All functionality must be available via keyboard\n" +
        "- No keyboard traps\n" +
        "- Logical tab order\n" +
        "- Visible focus indicators\n\n" +
        "Our platform can help you test keyboard navigation and identify issues.";
    }
    
    // Toolbar questions
    else if ((message.includes('toolbar') || message.includes('tool')) && message.includes('accessibility')) {
      response = "The **accessibility toolbar** (green glasses icon at the bottom right) provides tools to customize your experience, including:\n\n" +
        "- Text size adjustment\n" +
        "- Contrast options (high contrast, inverted colors)\n" +
        "- Focus highlighting\n" +
        "- Reading guides\n" +
        "- Animation controls\n\n" +
        "Click it to explore all available accessibility features. You can toggle features on and off as needed.";
    }
    
    // Form accessibility
    else if (message.includes('form') && message.includes('access')) {
      response = "**Accessible forms** are crucial for allowing all users to input information. Key requirements include:\n\n" +
        "1. **Proper labels** for all form controls, explicitly associated using `for` attributes\n" +
        "2. **Clear instructions** for completing fields, especially for formatting requirements\n" +
        "3. **Error identification** that doesn't rely solely on color\n" +
        "4. **Error suggestions** to help users correct mistakes\n" +
        "5. **Keyboard accessibility** for all form interactions\n" +
        "6. Logical **tab order** through the form\n" +
        "7. No **time limits** that cannot be adjusted or extended\n\n" +
        "Our tool can help identify many common form accessibility issues.";
    }
    
    // What is this app
    else if (message.includes('what') && (message.includes('app') || message.includes('website') || message.includes('tool'))) {
      response = "This is the **WCAG 9.4 Accessibility Audit** platform, a comprehensive toolkit that helps developers and content creators ensure their websites meet accessibility standards.\n\n" +
        "Our platform provides:\n\n" +
        "- **Testing tools** for automated accessibility checks\n" +
        "- **Guidance resources** on implementing accessibility best practices\n" +
        "- **Monitoring capabilities** to track accessibility over time\n" +
        "- **Detailed reports** to help prioritize fixes\n\n" +
        "Our goal is to make the web more accessible to everyone, regardless of ability or disability.";
    }
    
    // Default response for other queries
    else {
      response = "Thank you for your question. Our accessibility experts are continually improving this assistant.\n\n" +
        "For detailed information on this topic, you might want to check our knowledge base or WCAG resources section. If you have a specific accessibility question, please feel free to ask in more detail.";
    }

    // Add a slight delay that varies based on response length to simulate thinking/typing
    const delay = calculateTypingDelay(response);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return response;
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