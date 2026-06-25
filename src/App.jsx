import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ProfileDashboard from './components/ProfileDashboard';
import CollegeDiscovery from './components/CollegeDiscovery';
import ActiveRoadmaps from './components/ActiveRoadmaps';
import ApplicationTracker from './components/ApplicationTracker';
import ResearchAssistant from './components/ResearchAssistant';
import AcademicPerformance from './components/AcademicPerformance';
import AcademicProjects from './components/AcademicProjects';
import Login from './components/Login';
import { loadState, saveActiveTab, getCurrentUser, setCurrentUser, logout } from './utils/storage';
import { matchColleges } from './data/constants';

const TABS = {
  dashboard: ProfileDashboard,
  academic: AcademicPerformance,
  projects: AcademicProjects,
  discovery: CollegeDiscovery,
  roadmaps: ActiveRoadmaps,
  tracker: ApplicationTracker,
  research: ResearchAssistant,
};

export default function App() {
  const [currentUser, setCurrentUserStr] = useState(() => getCurrentUser());
  const [portal, setPortal] = useState(() => localStorage.getItem('masters-journey-tracker-portal') || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [state, setState] = useState(() => loadState());
  const [matchedColleges, setMatchedColleges] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('masters-journey-tracker-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('masters-journey-tracker-theme', theme);
  }, [theme]);

  const refreshState = useCallback(() => {
    const newState = loadState();
    setState(newState);
    if (newState.profile) {
      setMatchedColleges(matchColleges(newState.profile));
    } else {
      setMatchedColleges([]);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      const saved = loadState();
      if (saved.activeTab) {
        if (portal === 'academic' && ['academic', 'projects', 'dashboard'].includes(saved.activeTab)) {
          setActiveTab(saved.activeTab);
        } else if (portal === 'masters' && ['dashboard', 'research', 'discovery', 'roadmaps', 'tracker'].includes(saved.activeTab)) {
          setActiveTab(saved.activeTab);
        } else {
          setActiveTab(portal === 'academic' ? 'academic' : 'dashboard');
        }
      }
      refreshState();
    }
  }, [currentUser, refreshState, portal]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    saveActiveTab(tab);
  };

  const handleLogin = (userId) => {
    setCurrentUser(userId);
    setCurrentUserStr(userId);
  };

  const handleLogout = () => {
    logout();
    setCurrentUserStr(null);
    setPortal(null);
    localStorage.removeItem('masters-journey-tracker-portal');
  };

  const handleSwitchPortal = () => {
    setPortal(null);
    localStorage.removeItem('masters-journey-tracker-portal');
  };

  const handleDeleteProfile = () => {
    if (window.confirm("Are you sure you want to permanently delete your profile and all local data? This action cannot be undone.")) {
      const storageKeyForUser = `masters-journey-tracker_${currentUser}`;
      localStorage.removeItem(storageKeyForUser);
      handleLogout();
    }
  };

  const selectPortal = (selected) => {
    setPortal(selected);
    localStorage.setItem('masters-journey-tracker-portal', selected);
    setActiveTab(selected === 'academic' ? 'academic' : 'dashboard');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Portal Selector Screen
  if (portal === null) {
    return (
      <div className="login-container" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh', padding: '2rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-teal)', marginBottom: '0.5rem' }}>Welcome to Masters Journey & Academics Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Select a workspace to start tracking your goals</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Master's Journey Card */}
          <div className="card portal-card" onClick={() => selectPortal('masters')} style={{
            padding: '2.5rem',
            background: 'var(--bg-slate)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🌍</div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-teal)', marginBottom: '0.75rem' }}>Master's Journey Tracker</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Plan your higher education abroad. Discover international universities, analyze your resume, and track active applications.
            </p>
          </div>

          {/* Undergrad Academic Portal Card */}
          <div className="card portal-card" onClick={() => selectPortal('academic')} style={{
            padding: '2.5rem',
            background: 'var(--bg-slate)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>📈</div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--purple)', marginBottom: '0.75rem' }}>Undergrad Academic Portal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Track semester-wise subjects, calculate GPA/CGPA with Anna University grade point mapping, catalog capstone projects, and generate transcripts.
            </p>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn btn-ghost" onClick={handleLogout}>
            ↳ Switch Profile / Log Out
          </button>
        </div>
      </div>
    );
  }

  const ActiveComponent = TABS[activeTab];

  return (
    <div className="app">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        portal={portal}
        onSwitchPortal={handleSwitchPortal}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      />
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">
            {portal === 'academic' ? 'Academic & Projects Portal' : 'My Masters Journey Tracker'}
          </h1>
          <p className="page-subtitle">
            {portal === 'academic' 
              ? 'Manage undergrad courses, semester GPA, project portfolios, and transcripts' 
              : 'Your personal path to global academic excellence and international admissions'}
          </p>
        </header>
        <ActiveComponent
          state={state}
          matchedColleges={matchedColleges}
          onStateChange={refreshState}
          portal={portal}
          onDeleteProfile={handleDeleteProfile}
        />
      </main>
    </div>
  );
}
