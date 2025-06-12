
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sendChatMessageToGemini, initializeGeminiChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import Button from './Button';
import TextArea from './TextArea';
import LoadingSpinner from './LoadingSpinner';
import ChatMessageBubble from './ChatMessageBubble';
import { GEMINI_API_KEY_ERROR_MESSAGE } from '../constants';
import { Part } from '@google/genai';

const GeminiChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    try {
      initializeGeminiChat();
      setIsApiKeyMissing(false);
       setMessages([{ 
           id: 'initial-ai-greeting', 
           text: "Hello! I'm your Gemini assistant, ready to chat. How can I assist you today?", 
           sender: 'ai', 
           timestamp: new Date() 
       }]);
    } catch (e: any) {
      if (e.message === GEMINI_API_KEY_ERROR_MESSAGE) {
        setError(GEMINI_API_KEY_ERROR_MESSAGE + " The chat functionality will be disabled.");
        setIsApiKeyMissing(true);
      } else {
        setError("Failed to initialize Gemini Chat: " + e.message);
      }
      console.error("Initialization Error:", e);
    }
  }, []);


  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isLoading || isApiKeyMissing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null); // Clear previous errors on new message

    try {
      const { text: aiResponseText, groundingChunks } = await sendChatMessageToGemini(userMessage.text);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: aiResponseText || "Sorry, I couldn't generate a response.",
        sender: 'ai',
        timestamp: new Date(),
        groundingChunks: groundingChunks,
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (err: any) {
      const errorMessageText = err.message || 'Failed to get response from Gemini. Please try again.';
      setError(errorMessageText);
      console.error("Send Message Error:",err);
      const errorMessageEntry: ChatMessage = {
          id: `error-${Date.now()}`,
          text: `⚠️ ${errorMessageText}`,
          sender: 'ai', 
          timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessageEntry]);
    } finally {
      setIsLoading(false);
      textAreaRef.current?.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessage, isLoading, isApiKeyMissing]); // Removed setMessages from dependencies

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isApiKeyMissing && messages.length === 0) { // Show full-page error only if initial setup failed badly
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-2xl text-center">
        <div className="p-6 bg-red-900 bg-opacity-60 border border-red-700 text-red-200 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-red-300">Gemini Chat Unavailable</h2>
          <p className="font-semibold">{GEMINI_API_KEY_ERROR_MESSAGE}</p>
          <p className="mt-2">Please ensure the <code className="bg-gray-700 px-1 rounded">API_KEY</code> environment variable is correctly configured for the application.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-[calc(100vh-150px)] max-w-3xl w-full mx-auto bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
      <header className="bg-gradient-to-r from-gray-800 via-gray-850 to-gray-900 p-4 text-white text-center border-b border-gray-700 shadow-md">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">Gemini AI Chat</h2>
      </header>
      
      <div className="flex-grow p-3 md:p-4 space-y-2 overflow-y-auto bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
          <div className="flex justify-start mb-4 ml-2">
            <div className="px-4 py-3 rounded-xl shadow-md bg-gray-700 text-gray-100 rounded-bl-none inline-flex items-center">
                <LoadingSpinner size="5" color="teal-400" className="mr-2"/> 
                <span className="text-sm text-gray-300">Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && !isApiKeyMissing && ( // Show non-blocking error for send failures
         <div className="p-2 bg-red-900 bg-opacity-70 border-t border-red-700 text-red-200 text-xs text-center">
          <p>{error}</p>
        </div>
      )}

      <div className="p-3 md:p-4 bg-gray-900 border-t border-gray-700">
        <div className={`flex items-end space-x-3 ${isApiKeyMissing ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <TextArea
            ref={textAreaRef}
            id="chatMessage"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isApiKeyMissing ? "Chat disabled: API Key missing" : "Type your message to Gemini..."}
            className="flex-grow resize-none"
            rows={1} // Auto-adjust height based on content up to a max
            style={{ maxHeight: '120px', minHeight: '40px' }} // Control min/max height
            disabled={isLoading || isApiKeyMissing}
          />
          <Button 
            onClick={handleSendMessage} 
            isLoading={isLoading} 
            disabled={isLoading || !currentMessage.trim() || isApiKeyMissing}
            variant="success"
            className="h-[40px] px-5 self-end" // Ensure button aligns with single-row textarea
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatPage;
