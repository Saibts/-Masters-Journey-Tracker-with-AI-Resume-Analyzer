const NAV_ITEMS = [
  { id: 'dashboard', label: 'My Profile & Dashboard', icon: '◉' },
  { id: 'research', label: 'Research & Publications', icon: '🔬' },
  { id: 'discovery', label: 'College Discovery', icon: '◎' },
  { id: 'roadmaps', label: 'My Active Roadmaps', icon: '▤' },
  { id: 'tracker', label: 'Application Tracker', icon: '▦' },
];

export default function Sidebar({ activeTab, onTabChange, currentUser, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🎓</span>
        <div>
          <span className="brand-title">Masters</span>
          <span className="brand-subtitle">Journey Tracker</span>
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
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
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
