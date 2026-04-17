import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, PlusCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function ChatArea({
  activeSession,
  isTyping,
  isSearchingDocs,
  input,
  setInput,
  sendMessage,
  sessions
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages, isTyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRegenerate = () => {
    // Basic placeholder for regenerate logic triggering last prompt
    const userMessages = activeSession?.messages.filter(m => m.sender === 'user');
    if (userMessages && userMessages.length > 0) {
      const lastUserMsg = userMessages[userMessages.length - 1];
      sendMessage(lastUserMsg.text);
    }
  };

  return (
    <>
      {activeSession?.messages.length <= 1 ? (
        <motion.div 
          layout 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="welcome-screen flex-1 flex flex-col justify-center items-center"
        >
          <h1 className="text-4xl font-semibold mb-8 text-[var(--text-main)] tracking-tight">Welcome back!</h1>
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="welcome-suggestion" 
            onClick={() => sendMessage("What can you help me create?")}
          >
            What can you help me create?
          </motion.div>
        </motion.div>
      ) : (
        <div className="messages-area flex-1 overflow-y-auto p-8 flex flex-col items-center w-full" ref={scrollRef}>
          <AnimatePresence mode="popLayout">
            {activeSession?.messages.map((msg, idx) => {
              if (idx === 0) return null; // Skip boilerplate
              return (
                <MessageBubble 
                  key={msg.id} 
                  msg={msg} 
                  onRegenerate={handleRegenerate}
                />
              );
            })}
            {(isTyping || isSearchingDocs) && (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="message-row flex flex-col items-start w-full max-w-4xl mb-8"
              >
                <div className="bubble text-[var(--text-muted)]">
                  <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }} 
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                    {isSearchingDocs ? "Researching Sogni SDK Docs..." : "Sogni is thinking..."}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="input-container w-full flex justify-center p-8 relative z-20">
        <motion.div layout className="input-pill w-full max-w-4xl bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] rounded-full flex items-center px-5 py-3 gap-4 shadow-[var(--diffusion-shadow)] transition-colors duration-300 focus-within:border-white/20">
          <button className="input-action-btn flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <PlusCircle size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Send a message to Sogni..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1 bg-transparent border-none text-[var(--text-main)] text-base outline-none min-h-[24px]"
            style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }}
          />
          <button 
            className="send-btn-circle w-10 h-10 rounded-full flex items-center justify-center border shadow-[var(--glass-shadow)] transition-all"
            onClick={() => sendMessage()}
            disabled={isTyping || !input.trim()}
            style={{ 
              background: input.trim() ? 'white' : '#444', 
              color: input.trim() ? 'black' : 'var(--text-muted)',
              borderColor: 'var(--border-color)'
            }}
          >
            <Send size={16} />
          </button>
        </motion.div>
      </div>
    </>
  );
}
