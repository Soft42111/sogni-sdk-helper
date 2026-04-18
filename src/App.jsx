import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Terminal, Layout, Cpu, Info, Search, PlusCircle, Trash2, MessageSquare, Key, User, Lock, LogIn, Menu, X, Zap, Sun, Moon } from 'lucide-react';
import { SogniClient } from '@sogni-ai/sogni-client';
import { getResponse } from './constants/sdk-info';
import { SOGNI_KNOWLEDGE_BASE } from './constants/sogni-knowledge';
import sogniDocs from './constants/sogni-docs.json';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

// --- CORS PROXY PATCH ---
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const getUrl = (r) => {
    if (typeof r === 'string') return r;
    if (r instanceof URL) return r.toString();
    if (r instanceof Request) return r.url;
    return '';
  };

  const url = getUrl(resource);
  if (url.startsWith('https://api.sogni.ai')) {
    const newUrl = url.replace('https://api.sogni.ai', '/sogni-api');
    if (resource instanceof Request) {
      resource = new Request(newUrl, resource);
    } else {
      resource = newUrl;
    }
  }
  return originalFetch(resource, config);
};
// ------------------------

const TURNSTILE_SITE_KEY = '0x4AAAAAAC-9sNk_20dEkOAn';

const SOGNI_DOC_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_sogni_docs',
      description: 'Search documentation via keyword/phrase. Returns concise, relevant excerpts. Always try searching FIRST before listing or reading full pages.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Specific keyword or phrase to search for (e.g. "image generation", "ACE_STEP")' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_sogni_docs',
      description: 'Returns a list of all documentation filenames. Use this to browse available volume topics.',
      parameters: { type: 'object', properties: {} }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_sogni_doc',
      description: 'Reads the FULL content of a documentation volume by its exact filename. High context cost—use sparingly.',
      parameters: {
        type: 'object',
        properties: {
          filename: { type: 'string', description: 'The exact filename (e.g. "VOL_01_MANIFESTO.md")' }
        },
        required: ['filename']
      }
    }
  }
];

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
  const [authType, setAuthType] = useState('apikey');
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
        if (!turnstileToken) throw new Error("Please complete the verification");

        client = await SogniClient.createInstance({ appId: 'sogni-helper-app-1', network: 'fast' });
        const result = await client.account.register({
          username, email, password, turnstileToken, referralCode
        });

        if (result?.error) throw new Error(result.error);
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
      console.error("Auth Exception:", err);
      const errorMsg = err.payload?.message || err.message || 'Authentication failed.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">
          <div className="auth-title-icon">
            <Zap size={20} />
          </div>
          <h2>{isSignup ? 'Create Account' : 'Welcome back'}</h2>
          <p>{isSignup ? 'Sign up for Sogni Supernet' : 'Sign in to Sogni SDK Helper'}</p>
        </div>

        {!isSignup && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${authType === 'apikey' ? 'active' : ''}`}
              onClick={() => setAuthType('apikey')}
            >
              <Key size={14} /> API Key
            </button>
            <button
              type="button"
              className={`auth-tab ${authType === 'login' ? 'active' : ''}`}
              onClick={() => setAuthType('login')}
            >
              <User size={14} /> Account
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={handleAuth}>
          {error && <div className="auth-error">{error}</div>}

          {isSignup ? (
            <>
              <div className="input-wrapper">
                <User size={16} color="var(--text-tertiary)" />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="input-wrapper">
                <Search size={16} color="var(--text-tertiary)" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-wrapper">
                <Lock size={16} color="var(--text-tertiary)" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="input-wrapper">
                <Lock size={16} color="var(--text-tertiary)" />
                <input type="password" placeholder="Re-enter Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="input-wrapper">
                <PlusCircle size={16} color="var(--text-tertiary)" />
                <input type="text" placeholder="Referral Code (Optional)" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
              </div>
              <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />
            </>
          ) : (
            authType === 'apikey' ? (
              <div className="input-wrapper">
                <Key size={16} color="var(--text-tertiary)" />
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
                  <User size={16} color="var(--text-tertiary)" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="input-wrapper">
                  <Lock size={16} color="var(--text-tertiary)" />
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
            className="auth-submit-btn"
            disabled={isLoading || (isSignup && !turnstileToken)}
          >
            {isLoading ? 'Connecting…' : (isSignup ? 'Create Account' : <><LogIn size={16} /> Sign in</>)}
          </button>
        </form>

        <div className="auth-footer">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [sogniClient, setSogniClient] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sogni_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sogni_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

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
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        Connecting to Sogni Supernet…
      </div>
    );
  }

  if (!sogniClient) {
    return <AuthScreen onAuthenticate={(client) => setSogniClient(client)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('sogni_auth');
    setSogniClient(null);
  };

  return <ChatApp sogni={sogniClient} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />;
}

function ChatApp({ sogni, onLogout, theme, toggleTheme }) {
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
  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [balances, setBalances] = useState({ sparks: '0.00', sogni: '0.00' });

  const fetchBalances = async () => {
    if (!sogni) return;
    try {
      const b = await sogni.account.accountBalance();
      setBalances({
        sparks: parseFloat(b.settledSpark || 0).toFixed(2),
        sogni: parseFloat(b.settledSogni || 0).toFixed(2)
      });
    } catch (e) {
      console.warn("Could not fetch balances", e);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [sogni]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('sogni_sessions', JSON.stringify(sessions));
    localStorage.setItem('sogni_active_session', activeSessionId);
  }, [sessions, activeSessionId]);

  const updateSessionMessages = (sessionId, newMessages) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: newMessages } : s));
  };

  const createNewChat = () => {
    let title = window.prompt("What is the title of this chat (leave blank for AI to generate)?");
    if (title === null) return; // User cancelled
    
    title = title.trim();
    let autoTitle = false;
    if (!title) {
      title = "New Chat";
      autoTitle = true;
    }
    if (title.length > 30) title = title.substring(0, 30) + '...';

    const newSession = { id: Date.now().toString(), name: title, autoTitle: autoTitle, messages: [defaultMessage] };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const renameChat = (e, id) => {
    e.stopPropagation();
    const sessionToRename = sessions.find(s => s.id === id);
    if (!sessionToRename) return;
    
    let newTitle = window.prompt("Enter new chat name:", sessionToRename.name);
    if (newTitle !== null) {
      newTitle = newTitle.trim();
      if (newTitle.length > 30) newTitle = newTitle.substring(0, 30) + '...';
      if (newTitle) {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, name: newTitle } : s));
      }
    }
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

  // Safely extract a message from the Sogni API response
  const extractMessage = (response) => {
    if (response?.choices?.[0]?.message) return response.choices[0].message;
    if (response?.message) return response.message;
    if (response?.content) return response;
    if (response?.text) return { content: response.text };
    return null;
  };

  const generateAITitle = async (userText, sessionId) => {
    if (!sogni) return;
    try {
      const res = await sogni.chat.completions.create({
        model: 'qwen3.5-35b-a3b-gguf-q4km',
        messages: [
          { role: 'system', content: 'Generate a very short 2-4 word title for a chat conversation. Return ONLY the title text, nothing else. No quotes, no prefix, no explanation. Do not use <think> tags.' },
          { role: 'user', content: userText }
        ],
        max_tokens: 20
      });

      const msg = extractMessage(res);
      let titleText = msg?.content || '';
      if (titleText) {
        // Strip thinking blocks if the model still sends them
        let mainTitle = titleText.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();
        // Clean up any quotes or prefixes
        mainTitle = mainTitle.replace(/^['"`]+|['"`]+$/g, '').trim();
        mainTitle = mainTitle.replace(/^(TITLE|Title|title)\s*:\s*/i, '').trim();
        mainTitle = mainTitle.replace(/\.+$/, '').trim();
        if (mainTitle && mainTitle.length > 1 && mainTitle.length < 60) {
          setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, name: mainTitle } : s));
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
    setStreamingText('');

    // Title generation moved to occurs AFTER response generation

    try {
      if (!sogni) throw new Error("SogniClient not initialized");

      let apiMessages = [
        { role: 'system', content: `You are the Sogni SDK Expert Assistant. You have access to the complete 64-volume Sogni SDK Documentation via tools. If a question is highly technical, use the 'read_sogni_doc' tool to fetch the exact specs before answering.\n\nQuick Context:\n${SOGNI_KNOWLEDGE_BASE}` },
        ...newMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
      ];

      let isLooping = true;
      let finalBotText = "";
      let loopCount = 0;
      const MAX_TOOL_LOOPS = 5;

      while (isLooping && loopCount < MAX_TOOL_LOOPS) {
        loopCount++;

        // Always use non-streaming to ensure perfectly stable full message response
        const response = await sogni.chat.completions.create({
          model: 'qwen3.5-35b-a3b-gguf-q4km',
          messages: apiMessages,
          tools: SOGNI_DOC_TOOLS,
          tool_choice: 'auto',
          max_tokens: 4096,
          stream: false
        });

        const message = extractMessage(response);
        if (!message) {
          console.error('Unexpected API response shape:', response);
          finalBotText = "The Sogni Supernet returned an unexpected response. Please try again.";
          isLooping = false;
          break;
        }

        if (message.tool_calls && message.tool_calls.length > 0) {
          setIsSearching(true);
          apiMessages.push(message);

          for (const toolCall of message.tool_calls) {
            const funcName = toolCall.function?.name;
            let args = {};
            try { args = JSON.parse(toolCall.function?.arguments || '{}'); } catch (e) { /* ignore */ }
            let result = '';

            if (funcName === 'search_sogni_docs') {
              const q = (args.query || '').toLowerCase();
              const results = [];
              for (const [filename, content] of Object.entries(sogniDocs)) {
                const idx = content.toLowerCase().indexOf(q);
                if (filename.toLowerCase().includes(q) || idx !== -1) {
                  const start = Math.max(0, idx !== -1 ? idx - 150 : 0);
                  const end = Math.min(content.length, idx !== -1 ? idx + 500 : 500);
                  results.push(`[File: ${filename}]\n...${content.substring(start, end)}...`);
                }
              }
              result = results.length > 0 ? results.slice(0, 4).join('\n\n') : 'No matching documentation found. Try a different search query or list the docs.';
            } else if (funcName === 'list_sogni_docs') {
              result = JSON.stringify(Object.keys(sogniDocs));
            } else if (funcName === 'read_sogni_doc') {
              result = sogniDocs[args.filename] || 'Document not found.';
            } else {
              result = 'Unknown tool: ' + funcName;
            }

            apiMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: result
            });
          }
        } else {
          finalBotText = '';
          if (message.reasoning) {
            finalBotText += `<think>\n${message.reasoning}\n</think>\n`;
          }
          finalBotText += message.content || '';
          isLooping = false;
        }
      }

      if (loopCount >= MAX_TOOL_LOOPS && isLooping) {
        finalBotText = 'I researched the documentation but hit the maximum lookup limit. Here is what I found so far — please try a more specific question.';
      }

      setIsSearching(false);
      setStreamingText('');
      fetchBalances();

      let botText = finalBotText;
      if (typeof botText !== 'string') {
        botText = "The Sogni model responded, but the data format was unreadable.";
      }
      
      // Do NOT strip <think> here so MessageBubble can display it
      botText = botText.trim();

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, { id: Date.now() + 1, text: botText, sender: 'bot' }] };
        }
        return s;
      }));

      if (isFirstUserMessage) {
        const currentSession = sessions.find(s => s.id === currentSessionId);
        if (currentSession?.autoTitle || currentSession?.name === "New Chat") {
          generateAITitle(`User: ${messageText}\nAI: ${botText}`, currentSessionId);
        }
      }
    } catch (err) {
      console.error("Supernet connection failure:", err);
      let errorMsg = err.message || "An unknown network error occurred.";
      setStreamingText('');
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, { id: Date.now() + 1, text: `[SYSTEM ERROR] Failed to connect to Sogni Supernet: ${errorMsg}`, sender: 'bot' }] };
        }
        return s;
      }));
    } finally {
      setIsTyping(false);
      setStreamingText('');
    }
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
        renameChat={renameChat}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
      />

      <main className="chat-main">
        <header className="top-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="model-badge">
              <span className="dot"></span>
              Sogni SDK Helper
            </div>
          </div>
          <div className="header-right">
            <button className="header-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <ChatArea
          activeSession={activeSession}
          isTyping={isTyping}
          isSearching={isSearching}
          streamingText={streamingText}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </main>
    </div>
  );
}

export default App;
