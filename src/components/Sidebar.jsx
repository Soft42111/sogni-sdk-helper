import { PlusCircle, Layout, X, Info, Trash2 } from 'lucide-react';

export default function Sidebar({
  sessions,
  activeSessionId,
  isSidebarOpen,
  setIsSidebarOpen,
  isSidebarHidden,
  setIsSidebarHidden,
  createNewChat,
  setActiveSessionId,
  deleteChat
}) {
  if (isSidebarHidden && window.innerWidth >= 768) {
    return null; // Don't render on desktop if hidden
  }

  return (
    <>
      {isSidebarOpen && (
        <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ display: 'flex' }}>
        <div className="sidebar-header">
          <div className="logo-circle"></div>
          <button className="mobile-close" onClick={() => setIsSidebarOpen(false)}>
             <X size={20} />
          </button>
          {!isSidebarOpen && (
             <Layout 
               size={20} 
               color="var(--text-muted)" 
               style={{ cursor: 'pointer' }} 
               onClick={() => setIsSidebarHidden(true)} 
             />
          )}
        </div>

        <button className="new-chat-btn" onClick={() => { createNewChat(); setIsSidebarOpen(false); }}>
          <PlusCircle size={16} color="var(--text-muted)" /> New chat
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
      </aside>
    </>
  );
}
