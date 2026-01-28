import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiImage, FiMessageSquare } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { chatWithAI, generateImage } from './services/aiService';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI assistant. Chat with me or switch mode to generate images.', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat' or 'image'
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (mode === 'image') {
        // IMAGE GENERATION MODE
        const imageUrl = generateImage(userMessage.content);
        
        // Simulate a small delay for "processing" feel
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: imageUrl, 
            type: 'image',
            prompt: userMessage.content
          }]);
          setIsLoading(false);
        }, 1500);

      } else {
        // CHAT MODE
        const response = await chatWithAI([...messages, userMessage]);
        setMessages(prev => [...prev, { role: 'assistant', content: response, type: 'text' }]);
        setIsLoading(false);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please try again.", type: 'text' }]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="logo-text">AI Premium</div>
        <div className="mode-badge">
          {mode === 'chat' ? 'Conversation' : 'Image Gen'}
        </div>
      </header>

      {/* Chat Area */}
      <div className="chat-container">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`message ${msg.role}`}
            >
              {msg.type === 'image' ? (
                <div>
                  <p style={{marginBottom: '5px', fontSize: '0.8rem', opacity: 0.7}}>Generated: {msg.prompt}</p>
                  <img 
                    src={msg.content} 
                    alt="Generated Art" 
                    className="generated-image" 
                    onLoad={scrollToBottom}
                  />
                </div>
              ) : (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              )}
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="message assistant loading-dots"
            >
              <span>.</span><span>.</span><span>.</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-wrapper">
          {/* Mode Toggle Button */}
          <button 
            className={`toggle-btn ${mode === 'chat' ? 'active' : ''}`}
            onClick={() => setMode('chat')}
            title="Chat Mode"
          >
            <FiMessageSquare size={20} />
          </button>
          
          <button 
            className={`toggle-btn ${mode === 'image' ? 'active' : ''}`}
            onClick={() => setMode('image')}
            title="Image Generation Mode"
          >
            <FiImage size={20} />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={mode === 'chat' ? "Ask anything..." : "Describe image to generate..."}
            rows={1}
          />

          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
