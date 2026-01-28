import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCopy, FiDownload, FiCheck, FiCpu } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { chatWithAI } from './services/aiService';
import './App.css';

// --- Helper Component for Code Blocks ---
const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const language = className ? className.replace('language-', '') : 'text';
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Map common languages to extensions
    const extensions = { javascript: 'js', python: 'py', html: 'html', css: 'css', json: 'json', react: 'jsx' };
    const ext = extensions[language] || 'txt';
    a.download = `code-snippet.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-header">
        <span className="lang-tag">{language}</span>
        <div className="code-actions">
          <button onClick={handleCopy} title="Copy Code">
            {copied ? <FiCheck color="#4ade80" /> : <FiCopy />}
          </button>
          <button onClick={handleDownload} title="Download File">
            <FiDownload />
          </button>
        </div>
      </div>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Code Assistant. Ask me to write Python, HTML, or React code.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please check your API Key." }]);
    } finally {
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
      <header className="header">
        <div className="logo-text">
          <FiCpu style={{ marginRight: '8px', marginBottom: '-2px' }} />
          DevChat AI
        </div>
      </header>

      <div className="chat-container">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`message ${msg.role}`}
            >
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    if (!inline) {
                      return <CodeBlock className={className} children={children} />;
                    }
                    return <code className="inline-code" {...props}>{children}</code>;
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="message assistant loading-dots">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask for code (e.g., 'Write a Python calculator')..."
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
