import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ChevronDown, RefreshCw, Edit2 } from 'lucide-react';

export default function MessageBubble({ msg, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract thinking blocks if present
  let text = msg.text || '';
  let thinkMatch = text.match(/<think>([\s\S]*?)(?:<\/think>|$)/i);
  let thinkingText = thinkMatch ? thinkMatch[1].trim() : null;
  let mainText = thinkMatch ? text.replace(thinkMatch[0], '').trim() : text;

  if (!mainText && thinkingText) {
    mainText = "Thought process recorded.";
  }

  const isUser = msg.sender === 'user';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`message-row flex flex-col w-full max-w-4xl mb-8 ${isUser ? 'items-end' : 'items-start'}`}
      style={{
        width: '100%',
        maxWidth: '800px',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start'
      }}
    >
      <div 
        className="bubble relative group"
        style={{
          padding: isUser ? '1rem 1.5rem' : '0.5rem 0',
          background: isUser ? 'var(--bg-card)' : 'transparent',
          border: isUser ? '1px solid var(--border-color)' : 'none',
          boxShadow: isUser ? 'var(--glass-shadow)' : 'none',
          borderRadius: '24px',
          borderBottomRightRadius: isUser ? '8px' : '24px',
          color: 'var(--text-main)',
          fontSize: '1.05rem',
          lineHeight: '1.6',
          maxWidth: '100%',
          width: '100%'
        }}
      >
        {/* Action Widgets on Hover */}
        <div 
          className="absolute opacity-0 group-hover:opacity-100 transition-opacity flex gap-2"
          style={{
            position: 'absolute',
            top: isUser ? '-40px' : '-35px',
            right: 0,
            opacity: 0,
            transition: 'opacity 0.2s',
            display: 'flex',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.style.opacity = ''}
        >
          {isUser ? (
            <button className="action-btn" onClick={() => {}} title="Edit message" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem 0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit2 size={14}/></button>
          ) : (
            <button className="action-btn" onClick={() => onRegenerate && onRegenerate()} title="Regenerate" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem 0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}><RefreshCw size={14}/></button>
          )}
          <button className="action-btn" onClick={() => handleCopy(text)} title="Copy" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem 0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
             {copied ? <Check size={14} color="var(--accent)" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Deep Reasoning Framer Accordion */}
        {thinkingText && !isUser && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div 
              onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-input)',
                padding: '0.5rem 1rem',
                borderRadius: '99px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                userSelect: 'none',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              <motion.div animate={{ rotate: isThinkingExpanded ? 180 : 0 }}>
                <ChevronDown size={14} />
              </motion.div>
              Deep Reasoning Process
            </div>
            
            <AnimatePresence>
              {isThinkingExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginTop: '0.75rem' }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    padding: '1rem',
                    borderLeft: '2px solid var(--border-color)',
                    marginLeft: '1rem',
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {thinkingText}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Markdown Render Engine */}
        {isUser ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{mainText}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                const codeString = String(children).replace(/\n$/, '');
                
                if (!inline && match) {
                  return (
                    <div style={{ margin: '1rem 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2d2d2d', padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                        <span>{match[1]}</span>
                        <button 
                          onClick={() => handleCopy(codeString)}
                          style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Copy size={12}/> Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
                        {...props}
                        children={codeString}
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0, padding: '1rem' }}
                      />
                    </div>
                  )
                }
                return (
                  <code {...props} className={className} style={{ background: 'var(--bg-input)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9em', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {children}
                  </code>
                )
              },
              p: ({children}) => <p style={{ marginBottom: '1rem' }}>{children}</p>,
              ul: ({children}) => <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', listStyle: 'disc' }}>{children}</ul>,
              ol: ({children}) => <ol style={{ marginLeft: '1.5rem', marginBottom: '1rem', listStyle: 'decimal' }}>{children}</ol>,
              a: ({children, href}) => <a href={href} style={{ color: '#38bdf8', textDecoration: 'underline' }}>{children}</a>,
              blockquote: ({children}) => <blockquote style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1rem', color: 'var(--text-muted)' }}>{children}</blockquote>
            }}
          >
            {mainText}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}
