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
              className={`chat-item group ${activeSessionId === session.id ? 'active' : ''}`}
              onClick={() => { setActiveSessionId(session.id); setIsSidebarOpen(false); }}
              style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '2rem' }}>
                {session.name}
              </span>
              <button 
                className="delete-chat-btn"
                onClick={(e) => deleteChat(e, session.id)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
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
