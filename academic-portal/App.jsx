import { useState, useEffect, useCallback } from 'react';
import Login from './Login';
import AcademicPerformance from './AcademicPerformance';
import AcademicProjects from './AcademicProjects';
import '../src/styles/index.css';

const STORAGE_KEY = 'masters-journey-tracker';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem(`${STORAGE_KEY}-current-user`) || null;
  });
  const [activeTab, setActiveTab] = useState('grades'); // 'grades' or 'projects'
  
  const loadUserState = useCallback((user = currentUser) => {
    if (!user) return { profile: null };
    const userKey = `${STORAGE_KEY}_${user}`;
    try {
      const raw = localStorage.getItem(userKey);
      if (!raw) {
        return {
          profile: {
            fullName: user.charAt(0).toUpperCase() + user.slice(1),
            targetTerm: 'Fall 2028',
            currentCourse: 'Robotics and Automation',
            collegeName: '',
            cgpa: '',
            semesters: {},
            projects: []
          }
        };
      }
      const parsed = JSON.parse(raw);
      if (!parsed.profile) {
        parsed.profile = {
          fullName: user.charAt(0).toUpperCase() + user.slice(1),
          targetTerm: 'Fall 2028',
          currentCourse: 'Robotics and Automation',
          collegeName: '',
          cgpa: '',
          semesters: {},
          projects: []
        };
      }
      return parsed;
    } catch {
      return {
        profile: {
          fullName: user.charAt(0).toUpperCase() + user.slice(1),
          targetTerm: 'Fall 2028',
          currentCourse: 'Robotics and Automation',
          collegeName: '',
          cgpa: '',
          semesters: {},
          projects: []
        }
      };
    }
  }, [currentUser]);

  const [state, setState] = useState(() => loadUserState());
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('masters-journey-tracker-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const refreshState = useCallback(() => {
    const data = loadUserState();
    setState(data);
  }, [loadUserState]);

  useEffect(() => {
    if (currentUser) {
      // Set the tracker user so the shared saveProfile functions resolve correctly
      localStorage.setItem(`${STORAGE_KEY}-current-user`, currentUser);
      refreshState();
    }
  }, [currentUser, refreshState]);

  const handleLogin = (userId) => {
    // Write user session keys synchronously
    localStorage.setItem(`${STORAGE_KEY}-current-user`, userId);
    // Ensure standard default state exists in localStorage for saveProfile/loadState compatibility
    const userKey = `${STORAGE_KEY}_${userId}`;
    const raw = localStorage.getItem(userKey);
    if (!raw) {
      const defaultState = {
        profile: {
          fullName: userId.charAt(0).toUpperCase() + userId.slice(1),
          targetTerm: 'Fall 2028',
          currentCourse: 'Robotics and Automation',
          collegeName: '',
          cgpa: '',
          semesters: {},
          projects: []
        }
      };
      localStorage.setItem(userKey, JSON.stringify(defaultState));
    }
    
    setCurrentUser(userId);
    // Synchronously load the state for the new user to avoid render mismatch
    setState(loadUserState(userId));
  };

  const handleLogout = () => {
    localStorage.removeItem(`${STORAGE_KEY}-current-user`);
    setCurrentUser(null);
    setState({ profile: null });
  };

  const handleStateChange = () => {
    refreshState();
  };

  // Mock global storage saveProfile for components that import and invoke it
  // Since components call saveProfile directly from '../src/utils/storage',
  // we need to make sure that the localStorage key matches what they expect if we want them to save correctly.
  // Wait, saveProfile in src/utils/storage uses:
  //   const userId = getCurrentUser();
  //   const userKey = `${STORAGE_KEY}_${userId}`;
  // where STORAGE_KEY = 'masters-journey-tracker' and getCurrentUser reads 'masters-journey-tracker-current-user'.
  // Ah! If they use the imported saveProfile, it will write to 'masters-journey-tracker-current-user' and 'masters-journey-tracker_{userId}'.
  // To ensure the components write to our specific academic-portal user storage instead, we can temporarily set the current user in 'masters-journey-tracker-current-user' as well, or we can override the behavior or just let them use the same storage key.
  // Wait! If we set 'masters-journey-tracker-current-user' to the same user name, then saveProfile from '../src/utils/storage' will write to 'masters-journey-tracker_{currentUser}'.
  // Let's check: does that mean they share the profile data? Yes! And it works perfectly out-of-the-box because they share the same profile object layout.
  // So if we just set both 'academic-portal-current-user' and 'masters-journey-tracker-current-user' to the current user, they will share the exact same user profile, meaning any grades they enter here will show up in the main app, and vice versa! That's incredibly neat and useful.
  // Let's make sure we write a custom save helper or synchronize the current user key.
  // Yes, if we set:
  //   localStorage.setItem('masters-journey-tracker-current-user', userId);
  // then any call to saveProfile in components will automatically save to the correct user key 'masters-journey-tracker_{userId}'!
  // Let's load the state from the standard key as well to make it fully compatible!
  // Standard userKey in main app: `masters-journey-tracker_${userId}`
  // Let's implement that!

  return (
    <div>
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside className="sidebar" style={{ width: '260px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div className="sidebar-header" style={{ marginBottom: '30px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-color)' }}>Academic Portal</h2>
              <span className="user-badge" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Logged in as: <strong>{currentUser}</strong></span>
            </div>
            
            <nav className="sidebar-nav" style={{ flex: 1 }}>
              <button 
                className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`}
                onClick={() => setActiveTab('grades')}
                style={{ width: '100%', textAlign: 'left', padding: '12px', marginBottom: '10px', display: 'block' }}
              >
                🎓 Academic Grades & CGPA
              </button>
              <button 
                className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
                style={{ width: '100%', textAlign: 'left', padding: '12px', marginBottom: '10px', display: 'block' }}
              >
                📂 Academic Projects
              </button>
            </nav>

            <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={handleLogout}
                style={{ width: '100%', padding: '10px' }}
              >
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
            {activeTab === 'grades' && state?.profile ? (
              <div>
                <h1 style={{ fontFamily: 'Georgia, serif', marginBottom: '20px' }}>Academic Performance</h1>
                <AcademicPerformance state={state} onStateChange={handleStateChange} />
              </div>
            ) : activeTab === 'projects' && state?.profile ? (
              <div>
                <h1 style={{ fontFamily: 'Georgia, serif', marginBottom: '20px' }}>Academic Projects</h1>
                <AcademicProjects state={state} onStateChange={handleStateChange} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3 style={{ fontFamily: 'Georgia, serif' }}>Initializing academic workspace profile...</h3>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
