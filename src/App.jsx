import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ProfileDashboard from './components/ProfileDashboard';
import CollegeDiscovery from './components/CollegeDiscovery';
import ActiveRoadmaps from './components/ActiveRoadmaps';
import ApplicationTracker from './components/ApplicationTracker';
import ResearchAssistant from './components/ResearchAssistant';
import Login from './components/Login';
import { loadState, saveActiveTab, getCurrentUser, setCurrentUser, logout } from './utils/storage';
import { matchColleges } from './data/constants';

const TABS = {
  dashboard: ProfileDashboard,
  discovery: CollegeDiscovery,
  roadmaps: ActiveRoadmaps,
  tracker: ApplicationTracker,
  research: ResearchAssistant,
};

export default function App() {
  const [currentUser, setCurrentUserStr] = useState(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [state, setState] = useState(() => loadState());
  const [matchedColleges, setMatchedColleges] = useState([]);

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
      if (saved.activeTab) setActiveTab(saved.activeTab);
      refreshState();
    }
  }, [currentUser, refreshState]);

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
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const ActiveComponent = TABS[activeTab];

  return (
    <div className="app">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">My Masters Journey Tracker</h1>
          <p className="page-subtitle">Your personal path to global {state.profile?.currentCourse ? state.profile.currentCourse.toLowerCase() : 'academic'} excellence</p>
        </header>
        <ActiveComponent
          state={state}
          matchedColleges={matchedColleges}
          onStateChange={refreshState}
        />
      </main>
    </div>
  );
}
