import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ChevronDown, RotateCcw, Zap, User } from 'lucide-react';

export default function MessageBubble({ msg, onRegenerate, isStreaming }) {
  const [copied, setCopied] = useState(false);
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract thinking blocks
  let text = msg.text || '';
  let thinkMatch = text.match(/<think>([\s\S]*?)(?:<\/think>|$)/i);
  let thinkingText = thinkMatch ? thinkMatch[1].trim() : null;
  let mainText = thinkMatch ? text.replace(thinkMatch[0], '').trim() : text;

  if (!mainText && thinkingText) {
    mainText = "_Reasoning complete._";
  }

  const isUser = msg.sender === 'user';
  const isError = mainText.startsWith('[SYSTEM ERROR]') || mainText.startsWith('[ERROR]');

  return (
    <div className="message-row">
      <div className="message-content-wrapper">
        <div className={`message-avatar ${isUser ? 'user' : 'assistant'}`}>
          {isUser ? <User size={14} /> : <Zap size={14} />}
        </div>

        <div className="message-body">
          <div className="message-sender-name">
            {isUser ? 'You' : 'Sogni'}
          </div>

          {/* Deep Thinking Accordion */}
          {thinkingText && !isUser && (
            <div className="thinking-block">
              <button
                className="thinking-toggle"
                onClick={() => setIsThinkingOpen(!isThinkingOpen)}
              >
                <ChevronDown
                  size={13}
                  style={{
                    transform: isThinkingOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease'
                  }}
                />
                Reasoning
              </button>

              {isThinkingOpen && (
                <div className="thinking-content">
                  {thinkingText}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`message-text ${isStreaming ? 'streaming-cursor' : ''}`}>
            {isUser ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>{mainText}</div>
            ) : isError ? (
              <div style={{ color: 'var(--accent-red)' }}>{mainText}</div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');

                    if (!inline && match) {
                      return (
                        <div className="code-block-wrapper">
                          <div className="code-block-header">
                            <span>{match[1]}</span>
                            <button
                              className="code-copy-btn"
                              onClick={() => handleCopy(codeString)}
                            >
                              {copied ? <><Check size={11}/> Copied</> : <><Copy size={11}/> Copy</>}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            {...props}
                            children={codeString}
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: 0,
                              padding: '1rem',
                              background: 'var(--bg-code)',
                              fontSize: '0.82rem'
                            }}
                          />
                        </div>
                      );
                    }
                    return (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    );
                  },
                  p: ({children}) => <p style={{ marginBottom: '0.75rem' }}>{children}</p>,
                  ul: ({children}) => <ul style={{ marginLeft: '1.25rem', marginBottom: '0.75rem', listStyle: 'disc' }}>{children}</ul>,
                  ol: ({children}) => <ol style={{ marginLeft: '1.25rem', marginBottom: '0.75rem', listStyle: 'decimal' }}>{children}</ol>,
                  li: ({children}) => <li style={{ marginBottom: '0.3rem' }}>{children}</li>,
                  a: ({children, href}) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>{children}</a>,
                  blockquote: ({children}) => <blockquote style={{ borderLeft: '3px solid var(--border-primary)', paddingLeft: '1rem', color: 'var(--text-secondary)', margin: '0.75rem 0' }}>{children}</blockquote>,
                  h1: ({children}) => <h1 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '0.5rem' }}>{children}</h1>,
                  h2: ({children}) => <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem', marginTop: '0.5rem' }}>{children}</h2>,
                  h3: ({children}) => <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '0.5rem' }}>{children}</h3>,
                  table: ({children}) => (
                    <div style={{ overflowX: 'auto', margin: '0.75rem 0', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>{children}</table>
                    </div>
                  ),
                  th: ({children}) => <th style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)', textAlign: 'left', fontWeight: 600 }}>{children}</th>,
                  td: ({children}) => <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-secondary)' }}>{children}</td>,
                }}
              >
                {mainText}
              </ReactMarkdown>
            )}
          </div>

          {/* Action bar for bot messages */}
          {!isUser && !isError && !isStreaming && mainText && (
            <div className="message-actions">
              <button
                className="action-btn"
                onClick={() => handleCopy(mainText)}
                title="Copy"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              {onRegenerate && (
                <button
                  className="action-btn"
                  onClick={() => onRegenerate(msg.id)}
                  title="Regenerate"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
