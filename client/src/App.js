import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const App = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const newChat = [...chat, { role: 'user', text: userMessage }];
    setChat(newChat);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/chat', {
        message: userMessage
      });
      setChat([...newChat, { role: 'bot', text: res.data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setChat([...newChat, { role: 'bot', text: 'Error: Could not get response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChat([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          
          {/* Header */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="mb-0">AI Chat Assistant</h4>
              {chat.length > 0 && (
                <button 
                  onClick={clearChat}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-muted mb-0">Chat with your local AI assistant</p>
          </div>

          {/* Chat Area */}
          <div 
            className="border rounded mb-3 p-3 bg-light" 
            style={{ 
              height: '400px', 
              overflowY: 'auto',
              backgroundColor: '#f9f9f9'
            }}
          >
            {chat.length === 0 ? (
              <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                <div className="text-center">
                  <p className="mb-1">No messages yet</p>
                  <p className="small">Type a message to start chatting</p>
                </div>
              </div>
            ) : (
              <div>
                {chat.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`mb-3 ${msg.role === 'user' ? 'text-end' : ''}`}
                  >
                    <div className="small text-secondary mb-1">
                      {msg.role === 'user' ? 'You' : 'AI'}
                    </div>
                    <div
                      className={`p-3 rounded ${msg.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-white border'
                        }`}
                    >
                      {msg.role === 'bot' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="mb-3">
                    <div className="small text-secondary mb-1">AI</div>
                    <div className="p-3 rounded bg-white border">
                      <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border rounded p-3 bg-white">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
              <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </div>
            <div className="small text-muted mt-2">
              Press Enter to send message
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;