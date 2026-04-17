import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Layout, Cpu, Info, Search, PlusCircle, Trash2, MessageSquare, Key, User, Lock, LogIn, Menu, X } from 'lucide-react';
import { SogniClient } from '@sogni-ai/sogni-client';
import { getResponse } from './constants/sdk-info';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

// --- CORS PROXY PATCH ---
// Intercept all requests to https://api.sogni.ai and redirect them to Vite's proxy 
// to bypass the browser's local development CORS restrictions.
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  if (typeof resource === 'string' && resource.startsWith('https://api.sogni.ai')) {
    resource = resource.replace('https://api.sogni.ai', '/sogni-api');
  } else if (resource instanceof Request && resource.url.startsWith('https://api.sogni.ai')) {
    resource = new Request(resource.url.replace('https://api.sogni.ai', '/sogni-api'), resource);
  }
  return originalFetch(resource, config);
};
// ------------------------

const TURNSTILE_SITE_KEY = '0x4AAAAAAC-9sNk_20dEkOAn';

function TurnstileWidget({ onVerify }) {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (window.turnstile && widgetRef.current) {
      window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => onVerify(token),
        theme: 'dark'
      });
    }
  }, []);

  return <div ref={widgetRef} style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}></div>;
}

function AuthScreen({ onAuthenticate }) {
  const [authType, setAuthType] = useState('apikey'); // 'apikey' or 'login'
  const [isSignup, setIsSignup] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let client;
      if (isSignup) {
        if (!username || !email || !password) throw new Error("All fields are required");
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        if (!turnstileToken) throw new Error("Please provide a Turnstile token");

        client = await SogniClient.createInstance({ appId: 'sogni-helper-app-1', network: 'fast' });
        await client.account.create({
          username,
          email,
          password,
          turnstileToken,
          referralCode
        });
        // Save for persistence
        localStorage.setItem('sogni_auth', JSON.stringify({ authType: 'login', username, password }));
      } else if (authType === 'apikey') {
        if (!apiKey.trim()) throw new Error("API Key is required");
        client = await SogniClient.createInstance({
          appId: 'sogni-helper-app-1',
          apiKey: apiKey,
          network: 'fast'
        });
        localStorage.setItem('sogni_auth', JSON.stringify({ authType: 'apikey', apiKey }));
      } else {
        if (!username.trim() || !password.trim()) throw new Error("Username and Password are required");
        client = await SogniClient.createInstance({
          appId: 'sogni-helper-app-1',
          network: 'fast'
        });
        await client.account.login(username, password);
        localStorage.setItem('sogni_auth', JSON.stringify({ authType: 'login', username, password }));
      }
      onAuthenticate(client);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: isSignup ? '450px' : '400px', background: 'rgba(10, 11, 16, 0.9)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--neon-shadow)', backdropFilter: 'blur(10px)' }}
      >
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
          <Terminal className="text-accent-primary" />
          {isSignup ? 'CREATE SOGNI ACCOUNT' : 'SOGNI AI LOGIN'}
        </div>

        {!isSignup && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setAuthType('apikey')}
              style={{ flex: 1, background: authType === 'apikey' ? 'rgba(99, 102, 241, 0.2)' : 'transparent', border: '1px solid', borderColor: authType === 'apikey' ? 'var(--accent-primary)' : 'var(--glass-border)', color: authType === 'apikey' ? 'var(--accent-primary)' : 'var(--text-muted)', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Key size={18} /> API Key
            </button>
            <button
              type="button"
              onClick={() => setAuthType('login')}
              style={{ flex: 1, background: authType === 'login' ? 'rgba(168, 85, 247, 0.2)' : 'transparent', border: '1px solid', borderColor: authType === 'login' ? 'var(--accent-secondary)' : 'var(--glass-border)', color: authType === 'login' ? 'var(--accent-secondary)' : 'var(--text-muted)', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            >
              <User size={18} /> Account
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

          {isSignup ? (
            <>
              <div className="input-wrapper">
                <User size={18} color="var(--text-muted)" />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="input-wrapper">
                <Search size={18} color="var(--text-muted)" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-wrapper">
                <Lock size={18} color="var(--text-muted)" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="input-wrapper">
                <Lock size={18} color="var(--text-muted)" />
                <input type="password" placeholder="Re-enter Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="input-wrapper">
                <PlusCircle size={18} color="var(--text-muted)" />
                <input type="text" placeholder="Referral Code (Optional)" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
              </div>
              <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />
            </>
          ) : (
            authType === 'apikey' ? (
              <div className="input-wrapper">
                <Key size={18} color="var(--text-muted)" />
                <input
                  type="password"
                  placeholder="Sogni API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="input-wrapper">
                  <User size={18} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="input-wrapper">
                  <Lock size={18} color="var(--text-muted)" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )
          )}

          <button
            type="submit"
            disabled={isLoading || (isSignup && !turnstileToken)}
            style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', padding: '1rem', border: 'none', borderRadius: '12px', cursor: (isLoading || (isSignup && !turnstileToken)) ? 'not-allowed' : 'pointer', fontWeight: 600, marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: (isSignup && !turnstileToken) ? 0.5 : 1 }}
          >
            {isLoading ? 'Processing...' : (isSignup ? 'Register Account' : <><LogIn size={18} /> Enter Supernet</>)}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function App() {
  const [sogniClient, setSogniClient] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      const authData = localStorage.getItem('sogni_auth');
      if (authData) {
        try {
          const { authType, apiKey, username, password } = JSON.parse(authData);
          let client;
          if (authType === 'apikey') {
            client = await SogniClient.createInstance({ appId: 'sogni-helper-app-1', apiKey, network: 'fast' });
          } else if (authType === 'login') {
            client = await SogniClient.createInstance({ appId: 'sogni-helper-app-1', network: 'fast' });
            await client.account.login(username, password);
          }
          if (client) setSogniClient(client);
        } catch (e) {
          console.error("Auto-login failed", e);
          localStorage.removeItem('sogni_auth');
        }
      }
      setIsInitializing(false);
    };
    autoLogin();
  }, []);

  if (isInitializing) {
    return <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>Initializing Sogni SDK...</div>;
  }

  if (!sogniClient) {
    return <AuthScreen onAuthenticate={(client) => setSogniClient(client)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('sogni_auth');
    setSogniClient(null);
  };

  return <ChatApp sogni={sogniClient} onLogout={handleLogout} />;
}

function ChatApp({ sogni, onLogout }) {
  const defaultMessage = { id: 1, text: "Welcome to Sogni SDK Helper. How can I assist?", sender: 'bot' };

  const getInitialSessions = () => {
    try {
      const saved = localStorage.getItem('sogni_sessions');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return [{ id: Date.now().toString(), name: "New Chat", messages: [defaultMessage] }];
  };

  const [sessions, setSessions] = useState(getInitialSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const savedId = localStorage.getItem('sogni_active_session');
    const initSessions = getInitialSessions();
    if (savedId && initSessions.find(s => s.id === savedId)) return savedId;
    return initSessions[0].id;
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chatCurrency, setChatCurrency] = useState('sparks');
  const scrollRef = useRef(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('sogni_sessions', JSON.stringify(sessions));
    localStorage.setItem('sogni_active_session', activeSessionId);
  }, [sessions, activeSessionId]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, activeSessionId, isTyping]);

  const updateSessionMessages = (sessionId, newMessages) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: newMessages } : s));
  };

  const updateSessionName = (sessionId, newName) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, name: newName } : s));
  };

  const createNewChat = () => {
    const newSession = { id: Date.now().toString(), name: "New Chat", messages: [defaultMessage] };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const deleteChat = (e, id) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    if (updated.length === 0) {
      const newSession = { id: Date.now().toString(), name: "New Chat", messages: [defaultMessage] };
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    } else {
      setSessions(updated);
      if (activeSessionId === id) setActiveSessionId(updated[0].id);
    }
  };

  const generateAITitle = async (userText, sessionId) => {
    if (!sogni) {
      console.warn("Title generation skipped: SogniClient not available");
      return;
    }

    try {
      const res = await sogni.chat.completions.create({
        model: 'qwen3.5-35b-a3b-gguf-q4km',
        messages: [
          {
            role: 'system',
            content: `Generate a 2-3 word chat title. Return ONLY the title text.`
          },
          { role: 'user', content: userText }
        ],
        max_tokens: 20
      });

      let titleText = res?.choices?.[0]?.message?.content
        || res?.message?.content
        || res?.content
        || res?.text;

      if (typeof titleText === 'string' && titleText.length > 0) {
        // Strip think tags
        let mainTitle = titleText.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();
        // Remove quotes and clean up
        mainTitle = mainTitle.replace(/['"]+|^TITLE:|^Title:|\.$/g, '').trim();

        if (mainTitle && mainTitle.length > 1) {
          updateSessionName(sessionId, mainTitle);
          console.log(`Generated title for ${sessionId}: ${mainTitle}`);
        }
      }
    } catch (e) {
      console.error("Title generation failed", e);
    }
  };

  const sendMessage = async (textToUse) => {
    const messageText = typeof textToUse === 'string' ? textToUse : input;
    if (!messageText || !messageText.trim()) return;

    const currentSessionId = activeSessionId;
    const currentMessages = sessions.find(s => s.id === currentSessionId).messages;
    const isFirstUserMessage = currentMessages.length === 1;

    const newMessages = [...currentMessages, { id: Date.now(), text: messageText, sender: 'user' }];
    updateSessionMessages(currentSessionId, newMessages);
    setInput('');
    setIsTyping(true);

    if (isFirstUserMessage) {
      // Running Title Generation Non-Blocking
      generateAITitle(messageText, currentSessionId);
    }

    try {
      if (!sogni) throw new Error("SogniClient not initialized");

      const response = await sogni.chat.completions.create({
        model: 'qwen3.5-35b-a3b-gguf-q4km',
        messages: [
          { role: 'system', content: 'You are an AI assistant for the Sogni SDK. Provide concise helpful answers.' },
          ...newMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
        ],
        max_tokens: 4096
      });

      // Robustly extract the text from various known Sogni/OpenAI variants
      let botText = response?.choices?.[0]?.message?.content
        || response?.message?.content
        || response?.content
        || response?.text;

      if (typeof botText !== 'string') {
        botText = "The Sogni model responded, but the data format was unreadable. Check proxy configurations.";
      } else {
        // Strip think tags for a cleaner UI response
        botText = botText.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();
      }

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, { id: Date.now() + 1, text: botText, sender: 'bot' }] };
        }
        return s;
      }));
    } catch (err) {
      console.error("Supernet connection failure:", err);
      let errorMsg = err.message || "An unknown network error occurred.";
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, { id: Date.now() + 1, text: `[SYSTEM ERROR] Failed to connect to Sogni Supernet: ${errorMsg}`, sender: 'bot' }] };
        }
        return s;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleNavClick = (label) => {
    sendMessage(`Tell me about ${label} in Sogni SDK`);
  };

  return (
    <div className="app-container">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarHidden={isSidebarHidden}
        setIsSidebarHidden={setIsSidebarHidden}
        createNewChat={createNewChat}
        setActiveSessionId={setActiveSessionId}
        deleteChat={deleteChat}
      />

      <main className="chat-main">
        <header className="top-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            {isSidebarHidden && (
              <Layout size={20} color="var(--text-muted)" style={{ cursor: 'pointer', marginRight: '1rem', display: window.innerWidth < 768 ? 'none' : 'block' }} onClick={() => setIsSidebarHidden(false)} />
            )}
            <span>Sogni SDK Helper Agent</span>
          </div>
          <div className="header-right" style={{ position: 'relative' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              soft4211 <User size={16} />
            </div>
            {isDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', whiteSpace: 'nowrap', zIndex: 50, boxShadow: 'var(--diffusion-shadow)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Select Chat Currency</div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="currency"
                    checked={chatCurrency === 'sparks'}
                    onChange={() => setChatCurrency('sparks')}
                  />
                  <span>Sparks (Preferred)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="currency"
                    checked={chatCurrency === 'sogni'}
                    onChange={() => setChatCurrency('sogni')}
                  />
                  <span>Sogni Tokens</span>
                </label>

                <button
                  onClick={onLogout}
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                >
                  Logout & Clear Cache
                </button>
              </div>
            )}
          </div>
        </header>

        <ChatArea
          activeSession={activeSession}
          isTyping={isTyping}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          sessions={sessions}
        />

        <div className="swipe-bar"></div>
        <div className="alpha-label">ALPHA V1.1.0</div>
      </main>
    </div>
  );
}

export default App;
