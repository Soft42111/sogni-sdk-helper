import { PlusCircle, X, Trash2, Sun, Moon, LogOut, Zap } from 'lucide-react';

export default function Sidebar({
  sessions,
  activeSessionId,
  isSidebarOpen,
  setIsSidebarOpen,
  isSidebarHidden,
  setIsSidebarHidden,
  createNewChat,
  setActiveSessionId,
  deleteChat,
  theme,
  toggleTheme,
  onLogout
}) {
  if (isSidebarHidden && window.innerWidth >= 768) {
    return null;
  }

  return (
    <>
      {isSidebarOpen && (
        <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Zap size={16} />
            </div>
            Sogni AI
          </div>
          <button className="mobile-close" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={() => { createNewChat(); setIsSidebarOpen(false); }}>
          <PlusCircle size={16} /> New chat
        </button>

        <div className="chat-list">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`chat-item ${activeSessionId === session.id ? 'active' : ''}`}
              onClick={() => { setActiveSessionId(session.id); setIsSidebarOpen(false); }}
            >
              <span>{session.name}</span>
              <button
                className="delete-chat-btn"
                onClick={(e) => deleteChat(e, session.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-footer-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button className="sidebar-footer-btn" onClick={onLogout} style={{ color: 'var(--accent-red)' }}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
