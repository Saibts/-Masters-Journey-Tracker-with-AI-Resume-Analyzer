const ALL_NAV_ITEMS = [
  { id: 'dashboard', label: 'My Profile & Dashboard', icon: '◉' },
  { id: 'academic', label: 'Academic Grades & CGPA', icon: '📈' },
  { id: 'projects', label: 'Academic Projects', icon: '💻' },
  { id: 'research', label: 'Research & Publications', icon: '🔬' },
  { id: 'discovery', label: 'College Discovery', icon: '◎' },
  { id: 'roadmaps', label: 'My Active Roadmaps', icon: '▤' },
  { id: 'tracker', label: 'Application Tracker', icon: '▦' },
];

export default function Sidebar({ activeTab, onTabChange, currentUser, onLogout, portal, onSwitchPortal, theme, onToggleTheme, isOpen, onClose }) {
  const filteredItems = ALL_NAV_ITEMS.filter((item) => {
    if (portal === 'academic') {
      return ['academic', 'projects', 'dashboard'].includes(item.id);
    }
    return ['dashboard', 'research', 'discovery', 'roadmaps', 'tracker'].includes(item.id);
  });

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">✕</button>
      <div className="sidebar-brand">
        <span className="brand-icon">🎓</span>
        <div>
          <span className="brand-title">
            {portal === 'academic' ? 'Academic' : 'Masters'}
          </span>
          <span className="brand-subtitle">
            {portal === 'academic' ? 'Portal' : 'Journey Tracker'}
          </span>
        </div>
      </div>
      
      {currentUser && (
        <div className="sidebar-user">
          <span className="user-avatar">🤖</span>
          <div className="user-info">
            <span className="user-label">Profile</span>
            <span className="user-id" title={currentUser}>{currentUser}</span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {filteredItems.map((item) => {
          const displayLabel = item.id === 'dashboard' && portal === 'academic'
            ? 'Profile & Settings'
            : item.label;

          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{displayLabel}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {currentUser && (
          <button className="logout-btn" onClick={onSwitchPortal} style={{ background: 'var(--border)', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            ⇄ Switch Portal
          </button>
        )}
        {currentUser && (
          <button className="logout-btn" onClick={onToggleTheme} style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', marginBottom: '0.25rem' }}>
            {theme === 'dark' ? '☀️ Light Academia' : '🌙 Dark Academia'}
          </button>
        )}
        <p className="storage-badge">💾 LocalStorage Active</p>
        {currentUser && (
          <button className="logout-btn" onClick={onLogout}>
            ↳ Switch Profile
          </button>
        )}
      </div>
    </aside>
  );
}
