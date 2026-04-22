import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Terminal, Layout, Cpu, Info, Search, PlusCircle, Trash2, MessageSquare, Key, User, Lock, LogIn, Menu, X, Zap, Sun, Moon } from 'lucide-react';
import { SogniClient } from '@sogni-ai/sogni-client';
import { getResponse } from './constants/sdk-info';
import { SOGNI_KNOWLEDGE_BASE } from './constants/sogni-knowledge';
import sogniDocs from './constants/sogni-docs.json';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import soulRaw from './soul.md?raw';
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
    // Log signup-related requests for debugging
    if (url.includes('/account/')) {
      console.log('[CORS Proxy]', url, '→', newUrl);
      if (config?.body) {
        try {
          const parsed = JSON.parse(config.body);
          console.log('[CORS Proxy] Body keys:', Object.keys(parsed));
          if (parsed.turnstileToken) {
            console.log('[CORS Proxy] turnstileToken present, length:', parsed.turnstileToken.length);
          }
        } catch(e) { /* not JSON */ }
      }
    }
    if (resource instanceof Request) {
      resource = new Request(newUrl, resource);
    } else {
      resource = newUrl;
    }
  }
  return originalFetch(resource, config);
};
// ------------------------


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
  },
  {
    type: 'function',
    function: {
      name: 'generate_visual_aid',
      description: 'Generates a high-quality visual infographic or image about a Sogni SDK topic or general request. Support for 80+ models and custom dimensions.',
      parameters: {
        type: 'object',
        properties: {
          topic: { type: 'string', description: 'The topic or concept to visualize (e.g. "Authorization Flow", "Project Lifecycle")' },
          prompt_override: { type: 'string', description: 'Optional: Direct prompt if the user wants something specific instead of a generic visual aid.' },
          modelId: { type: 'string', description: 'Optional: Specific model for backward compatibility (defaults to flux1-schnell-fp8). Supports 80+ models.' },
          width: { type: 'number', description: 'Optional: Image width (default 1024)' },
          height: { type: 'number', description: 'Optional: Image height (default 1024)' },
          is_infographic: { type: 'boolean', description: 'If true, applies professional infographic prompt engineering. Default true.' }
        },
        required: ['topic']
      }
    }
  }
];


function AuthScreen({ onAuthenticate }) {
  const [authType, setAuthType] = useState('apikey');
  const [apiKey, setApiKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let client;
      if (authType === 'apikey') {
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
        const loginData = await client.account.login(username, password);
        localStorage.setItem('sogni_auth', JSON.stringify({ authType: 'login', token: loginData.token, refreshToken: loginData.refreshToken }));
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
          <h2>Welcome back</h2>
          <p>Sign in to Sogni SDK Helper</p>
        </div>

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

        <form className="auth-form" onSubmit={handleAuth}>
          {error && <div className="auth-error">{error}</div>}

          {authType === 'apikey' ? (
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
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Connecting…' : <><LogIn size={16} /> Sign in</>}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a href="https://app.sogni.ai/create?code=soft4211" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Sign Up on Sogni ↗
          </a>
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
          const { authType, apiKey, token, refreshToken } = JSON.parse(authData);
          let client;
          if (authType === 'apikey') {
            client = await SogniClient.createInstance({ appId: 'sogni-helper-app-1', apiKey, network: 'fast' });
          } else if (authType === 'login' && token && refreshToken) {
            client = await SogniClient.createInstance({ appId: 'sogni-helper-app-1', network: 'fast' });
            await client.setTokens({ token, refreshToken });
          } else if (authType === 'login') {
             throw new Error("Old session format. Please login again.");
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
  const [selectedModel, setSelectedModel] = useState('qwen3.6-35b-a3b-gguf-iq4xs');

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
    const newSession = { id: Date.now().toString(), name: 'New Chat', autoTitle: true, messages: [defaultMessage] };
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
        model: selectedModel,
        messages: [
          { role: 'user', content: `Generate a short, clear title for this conversation.\n\nConstraints:\n- 3 to 6 words\n- No punctuation\n- No filler words\n- Focus on core topic or goal\n- Use natural phrasing\n\nConversation:\n${userText}\n\nReturn only the title.` }
        ],
        max_tokens: 30,
        temperature: 0.3,
        stream: false
      });

      const msg = extractMessage(res);
      let titleText = msg?.content || '';
      if (titleText) {
        // Strip thinking blocks
        let mainTitle = titleText.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();
        // Clean up any conversational prefixes or formatting
        mainTitle = mainTitle.replace(/^(here is the title|title|chat title|suggested title|the title is)[\s]*:?\s*/i, '').trim();
        mainTitle = mainTitle.replace(/^['"`]+|['"`]+$/g, '').trim();
        mainTitle = mainTitle.replace(/[.!?,;:]+$/g, '').trim();
        // Take only the first line if multi-line
        mainTitle = mainTitle.split('\n')[0].trim();
        
        if (!mainTitle || mainTitle.length <= 1) {
          // Fallback: use first words of user's message
          const extractedUserPrompt = userText.split('\n')[0].replace('User: ', '').trim();
          mainTitle = extractedUserPrompt.substring(0, 25) + (extractedUserPrompt.length > 25 ? '...' : '');
        }

        if (mainTitle.length > 40) mainTitle = mainTitle.substring(0, 40).trim();

        if (mainTitle && mainTitle.length > 1) {
          setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, name: mainTitle, autoTitle: false } : s));
        }
      }
    } catch (e) {
      console.error('[Title] Generation failed:', e);
      // Fallback: use user's message as title
      const fallback = userText.split('\n')[0].replace('User: ', '').trim();
      const shortTitle = fallback.substring(0, 25) + (fallback.length > 25 ? '...' : '');
      if (shortTitle) {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, name: shortTitle, autoTitle: false } : s));
      }
    }
  };

  const sendMessage = async (textToUse, isRegenerate = false, targetMsgId = null) => {
    const currentSessionId = activeSessionId;
    const currentSession = sessions.find(s => s.id === currentSessionId);
    let currentMessages = [...currentSession.messages];
    let messageText = '';

    if (isRegenerate && targetMsgId) {
      const msgIndex = currentMessages.findIndex(m => m.id === targetMsgId);
      if (msgIndex !== -1) {
        currentMessages = currentMessages.slice(0, msgIndex);
      }
      const lastUserMsg = currentMessages.slice().reverse().find(m => m.sender === 'user');
      if (!lastUserMsg) return; // Nothing to regenerate
      messageText = lastUserMsg.text;
      updateSessionMessages(currentSessionId, currentMessages);
    } else {
      messageText = typeof textToUse === 'string' ? textToUse : input;
      if (!messageText || !messageText.trim()) return;
      currentMessages.push({ id: Date.now(), text: messageText, sender: 'user' });
      updateSessionMessages(currentSessionId, currentMessages);
      setInput('');
    }

    const isFirstUserMessage = currentMessages.length === 2 && !isRegenerate;
    setIsTyping(true);
    setStreamingText('');

    // Title generation moved to occurs AFTER response generation

    try {
      if (!sogni) throw new Error("SogniClient not initialized");

      let apiMessages = [
        { role: 'system', content: `${soulRaw}\nYou have access to the complete 64-volume Sogni SDK Documentation via tools. If a question is highly technical, use the 'search_sogni_docs' or 'read_sogni_doc' tool before answering. If you cannot find the answer in the documentation, you MUST answer from your own intellect and general knowledge. Do not apologize for missing docs, just provide the best answer you can.\n\nQuick Context:\n${SOGNI_KNOWLEDGE_BASE}` },
        ...currentMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
      ];

      let isLooping = true;
      let finalBotText = "";
      let loopCount = 0;
      const MAX_TOOL_LOOPS = 6;

      while (isLooping && loopCount < MAX_TOOL_LOOPS) {
        loopCount++;

        const requestConfig = {
          model: selectedModel,
          messages: apiMessages,
          max_tokens: 8192,
          stream: false,
          think: true,
          taskProfile: 'reasoning'
        };

        // Allow tools for normal loops, but force a normal response on the final loop
        if (loopCount < MAX_TOOL_LOOPS) {
          requestConfig.tools = SOGNI_DOC_TOOLS;
          requestConfig.tool_choice = 'auto';
        } else {
          apiMessages.push({
            role: 'user',
            content: '[SYSTEM NOTIFICATION]: You have reached the maximum number of searches. Please provide your final answer now based on the gathered information or your own intellect. Do not attempt to use any more tools.'
          });
        }

        const response = await sogni.chat.completions.create(requestConfig);

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
              result = results.length > 0 ? results.slice(0, 4).join('\n\n') : 'No matching documentation found. Try a different search query or use your own knowledge.';
            } else if (funcName === 'list_sogni_docs') {
              result = JSON.stringify(Object.keys(sogniDocs));
            } else if (funcName === 'read_sogni_doc') {
              result = sogniDocs[args.filename] || 'Document not found.';
            } else if (funcName === 'generate_visual_aid') {
              const { topic, prompt_override, modelId, width, height, is_infographic = true } = args;
              
              const finalModelId = modelId || 'flux2-dev'; // Upgraded to Pro model
              const finalWidth = width || 1024;
              const finalHeight = height || 1024;
              
              // Nano Banana 3 Pro (Gemini 3 Pro) quality prompt engineering
              let positivePrompt = prompt_override || `A professional, world-class minimalist infographic about: ${topic}. 
              Clean typographic layout, perfectly readable text, high-contrast flat vector design. 
              Minimalist aesthetic, deep blue and white Sogni branding, ultra-sharp precision, vector graphics, 8k resolution.
              Ensure all text is correctly spelled and clearly presented in an organized diagram.`;
              
              if (is_infographic && !prompt_override) {
                 positivePrompt += " minimalist corporate style, data visualization masterpiece, award-winning graphic design.";
              }

              try {
                const projectProps = {
                  type: 'image',
                  modelId: finalModelId,
                  positivePrompt,
                  numberOfMedia: 1,
                  // Best params for Flux 2 Dev
                  steps: modelId ? (finalModelId.includes('schnell') ? 4 : 30) : 30,
                  guidance: modelId ? (finalModelId.includes('schnell') ? 1.0 : 8.0) : 8.0,
                  width: finalWidth,
                  height: finalHeight,
                  sizePreset: 'custom',
                  outputFormat: 'jpg'
                };

                const project = await sogni.projects.create(projectProps);
                
                const urls = await project.waitForCompletion();
                if (urls && urls.length > 0) {
                  result = `Successfully generated a "Pro" visual aid using ${finalModelId}.\n\n![Visual Aid - ${topic}](${urls[0]})\n\n*(Note: This high-fidelity infographic was generated using best-in-class parameters (30 steps, 8.0 guidance) on the Sogni Supernet)*`;
                } else {
                  result = "The image was generated but no URL was returned. It might have been filtered for safety.";
                }
              } catch (e) {
                console.error("Generation failed:", e);
                // Fallback attempt to flux1-dev-fp8 if flux2-dev failed
                if (finalModelId === 'flux2-dev') {
                   try {
                     const fallbackProject = await sogni.projects.create({
                        type: 'image',
                        modelId: 'flux1-dev-fp8', // Fallback to known high-fidelity ID
                        positivePrompt: positivePrompt,
                        numberOfMedia: 1,
                        steps: 30,
                        guidance: 8.0,
                        width: finalWidth,
                        height: finalHeight,
                        sizePreset: 'custom',
                        outputFormat: 'jpg'
                     });
                     const fallbackUrls = await fallbackProject.waitForCompletion();
                     if (fallbackUrls?.[0]) {
                        result = `Successfully generated a high-fidelity visual aid (via fallback model flux1-dev-fp8).\n\n![Visual Aid - ${topic}](${fallbackUrls[0]})`;
                     } else {
                        result = "Fallback generation failed to return an image.";
                     }
                   } catch(err2) {
                     result = `Primary and fallback generation failed: ${err2.message}`;
                   }
                } else {
                  result = `Failed to generate visual aid: ${e.message || 'Unknown error'}`;
                }
              }
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

      setIsSearching(false);
      setStreamingText('');
      fetchBalances();

      let botText = finalBotText;
      if (typeof botText !== 'string') {
        botText = "The Sogni model responded, but the data format was unreadable.";
      }
      
      // Safety check: If images were generated in this turn but not included in botText, append them
      if (typeof botText === 'string') {
        const toolMessages = apiMessages.filter(m => m.role === 'tool');
        toolMessages.forEach(tm => {
          if (tm.content && tm.content.includes('![Visual Aid')) {
            const imgMatch = tm.content.match(/!\[Visual Aid - [^\]]*\]\([^\)]+\)/g);
            if (imgMatch) {
              imgMatch.forEach(tag => {
                if (!botText.includes(tag)) {
                  botText += "\n\n" + tag;
                }
              });
            }
          }
        });
      }

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

  const computeContextWindow = () => {
    const baseText = `${soulRaw}\n${SOGNI_KNOWLEDGE_BASE}`;
    const sessionText = activeSession?.messages?.map(m => m.text).join(' ') || '';
    const totalChars = baseText.length + sessionText.length;
    // Rough estimation: ~4 chars per token on average for English
    const tokens = Math.ceil(totalChars / 4);
    if (tokens > 1000) return (tokens / 1000).toFixed(1) + 'k';
    return tokens;
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
            <div style={{ marginLeft: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px' }}>
              Ctx Window: {computeContextWindow()} / 262k
            </div>
          </div>
          <div className="header-right">
            <select 
              className="model-selector" 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--surface-sunken)', color: 'var(--text-primary)', border: '1px solid var(--border)', marginRight: '1rem', fontSize: '0.85rem' }}
            >
              <option value="qwen3.6-35b-a3b-gguf-iq4xs">Qwen 3.6 35B</option>
              <option value="qwen3.5-35b-a3b-gguf-q4km">Qwen 3.5 Normal</option>
              <option value="qwen3.5-35b-a3b-abliterated-gguf-q4km">Qwen 3.5 Unrestricted</option>
            </select>
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
