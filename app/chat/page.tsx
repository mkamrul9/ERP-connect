'use client';

import { useState, useRef, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { Send, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hi! I am the ERP-connect internal ERP assistant. How can I help you today?', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // Add user message
    const userMsg: Message = { id: Date.now(), text, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), text: data.reply || "I didn't understand that.", isUser: false }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), text: "Oops! My server connection dropped. Are you sure the backend is running?", isUser: false }]);
    }
  };

  return (
    <>
      <Topbar title="ERP Assistant" />
      
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 56px)', background: 'var(--bg)' }}>
        
        {/* Messages Area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: msg.isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '10px' }}>
              
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.isUser ? 'var(--primary)' : 'var(--card)', border: msg.isUser ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.isUser ? '#fff' : 'var(--primary)' }}>
                {msg.isUser ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: '18px', background: msg.isUser ? 'var(--primary)' : 'var(--card)', color: msg.isUser ? '#ffffff' : 'var(--text)', border: msg.isUser ? 'none' : '1px solid var(--border)', borderBottomRightRadius: msg.isUser ? '4px' : '18px', borderBottomLeftRadius: msg.isUser ? '18px' : '4px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {msg.text}
              </div>

            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Bot size={18} />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '18px', background: 'var(--card)', border: '1px solid var(--border)', borderBottomLeftRadius: '4px', display: 'flex', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', background: 'var(--muted)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }} />
                <span style={{ width: '6px', height: '6px', background: 'var(--muted)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }} />
                <span style={{ width: '6px', height: '6px', background: 'var(--muted)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px 20px', background: 'var(--card)', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask the ERP Assistant..."
            style={{ flex: 1, padding: '12px 20px', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', fontSize: '0.95rem' }}
          />
          <button 
            onClick={sendMessage}
            style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          >
            <Send size={20} style={{ marginLeft: '4px' }} />
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}} />
      </div>
    </>
  );
}
