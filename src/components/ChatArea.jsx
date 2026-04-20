import React, { useRef, useEffect } from 'react';
import { Send, ArrowUp, Loader } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function ChatArea({
  activeSession,
  isTyping,
  isSearching,
  streamingText,
  input,
  setInput,
  sendMessage,
}) {
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages, isTyping, isSearching, streamingText]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  };

  const handleRegenerate = () => {
    sendMessage(null, true);
  };

  const suggestions = [
    { text: "What can Sogni SDK do?", icon: "🚀" },
    { text: "How do I generate images?", icon: "🎨" },
    { text: "Explain ACE-Step audio", icon: "🎵" },
    { text: "List available models", icon: "📋" }
  ];

  const isWelcome = activeSession?.messages.length <= 1;

  return (
    <>
      {isWelcome ? (
        <div className="welcome-screen">
          <h1>What can I help with?</h1>
          <p>Ask me anything about the Sogni SDK — image generation, video, audio, models, and the Supernet.</p>
          <div className="suggestions-grid">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="welcome-suggestion"
                onClick={() => sendMessage(s.text)}
              >
                <span style={{ marginRight: '0.5rem' }}>{s.icon}</span>
                {s.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="messages-area" ref={scrollRef}>
          {activeSession?.messages.map((msg, idx) => {
            if (idx === 0) return null;
            return (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onRegenerate={handleRegenerate}
              />
            );
          })}

          {/* Streaming message */}
          {streamingText && (
            <MessageBubble
              msg={{ id: 'streaming', text: streamingText, sender: 'bot' }}
              isStreaming={true}
            />
          )}

          {/* Step indicators */}
          {(isTyping || isSearching) && !streamingText && (
            <div className="message-row">
              <div className="message-content-wrapper">
                <div className="message-avatar assistant">
                  <Loader size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
                </div>
                <div className="message-body">
                  <div className="message-sender-name">Sogni</div>
                  {isSearching ? (
                    <div className="step-indicator searching">
                      <div className="step-icon">
                        <Loader size={14} />
                      </div>
                      <span>Searching documentation…</span>
                    </div>
                  ) : (
                    <div className="typing-indicator">
                      <div className="typing-dots">
                        <span></span><span></span><span></span>
                      </div>
                      <span>Thinking…</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Bar */}
      <div className="input-container">
        <div className="input-box">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Message Sogni…"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={isTyping || !input.trim()}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
