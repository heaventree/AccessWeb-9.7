import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useChatbot } from '../../hooks/useChatbot';
import { SuggestedActions } from './SuggestedActions';
import { MessageContent } from './MessageContent';

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, isLoading } = useChatbot();
  
  // Show suggested actions when there are no messages or after greeting
  const showSuggestions = messages.length === 0 || 
    (messages.length === 2 && messages[0].role === 'user' && 
     (messages[0].content.toLowerCase().includes('hi') || 
      messages[0].content.toLowerCase().includes('hello')));

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle suggested question selection
  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
        className="fixed bottom-4 right-20 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={toggleChat}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-20 z-40 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
            role="dialog"
            aria-labelledby="chat-title"
          >
            {/* Chat header */}
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h2 id="chat-title" className="font-semibold">Accessibility Support</h2>
              <button
                onClick={toggleChat}
                aria-label="Close chat"
                className="text-white hover:text-blue-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 my-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>How can I help you with web accessibility today?</p>
                  {/* Show suggested actions for empty chat */}
                  <SuggestedActions onSelect={handleSuggestedQuestion} />
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Bot avatar for assistant messages */}
                      {msg.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                          <Bot className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                      
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <MessageContent 
                          content={msg.content}
                          isAssistant={msg.role === 'assistant'} 
                        />
                      </div>
                      
                      {/* User avatar for user messages */}
                      {msg.role === 'user' && (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ml-2 flex-shrink-0">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Show suggestions after greeting */}
                  {showSuggestions && (
                    <SuggestedActions onSelect={handleSuggestedQuestion} />
                  )}
                </>
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-2">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={1}
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}