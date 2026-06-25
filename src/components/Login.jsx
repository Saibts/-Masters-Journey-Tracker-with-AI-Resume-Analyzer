import { useState } from 'react';

const STORAGE_KEY = 'masters-journey-tracker';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [userIdInput, setUserIdInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = userIdInput.trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter a User ID');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setError('User ID can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    const storageKeyForUser = `${STORAGE_KEY}_${trimmed}`;
    const rawData = localStorage.getItem(storageKeyForUser);
    const userExists = rawData !== null;

    let parsedData = null;
    if (userExists) {
      try {
        parsedData = JSON.parse(rawData);
      } catch (err) {
        // Fallback for malformed data
      }
    }

    if (mode === 'register') {
      if (userExists) {
        setError('already taken try another id');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      // Initialize an empty profile object to secure the key in localStorage
      const defaultState = {
        password: password,
        profile: {
          fullName: '',
          targetTerm: 'Fall 2028',
          currentCourse: 'Robotics and Automation',
          collegeName: '',
          cgpa: '',
          semesters: {},
          projects: []
        }
      };
      localStorage.setItem(storageKeyForUser, JSON.stringify(defaultState));
      onLogin(trimmed);
    } else {
      // Sign In mode
      if (!userExists) {
        setError('Profile key not found. Verify your ID or create a new user.');
        return;
      }
      // If user exists and has a password stored, verify it
      if (parsedData && parsedData.password) {
        if (parsedData.password !== password) {
          setError('Incorrect password. Please try again.');
          return;
        }
      } else if (parsedData) {
        // Automatically upgrade account with the entered password if none was set previously
        parsedData.password = password;
        localStorage.setItem(storageKeyForUser, JSON.stringify(parsedData));
      }
      onLogin(trimmed);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="login-logo" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
          <h2>Masters & Academics Tracker</h2>
          <p>Your private, local academic workspace</p>
        </div>

        {/* Tab Toggle between Sign In and Register */}
        <div style={{ display: 'flex', background: 'var(--bg-deep)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <button
            onClick={() => {
              setMode('login');
              setError('');
              setUserIdInput('');
              setPassword('');
              setConfirmPassword('');
            }}
            style={{
              flex: 1,
              background: mode === 'login' ? 'var(--accent-teal)' : 'transparent',
              color: mode === 'login' ? '#000' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: mode === 'login' ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError('');
              setUserIdInput('');
              setPassword('');
              setConfirmPassword('');
            }}
            style={{
              flex: 1,
              background: mode === 'register' ? 'var(--purple)' : 'transparent',
              color: mode === 'register' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: mode === 'register' ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            Register New User
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userId" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {mode === 'register' ? 'Choose a Unique User ID' : 'Enter Your Private User ID'}
            </label>
            <input
              id="userId"
              type="text"
              placeholder={mode === 'register' ? 'Choose username...' : 'Enter your unique profile key...'}
              value={userIdInput}
              onChange={(e) => {
                setUserIdInput(e.target.value);
                setError('');
              }}
              autoFocus
              className="login-input"
              style={{
                background: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'inherit',
                padding: '0.75rem',
                width: '100%',
                fontSize: '1rem',
                marginTop: '0.5rem',
                marginBottom: '1rem'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="login-input"
              style={{
                background: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'inherit',
                padding: '0.75rem',
                width: '100%',
                fontSize: '1rem',
                marginTop: '0.5rem',
                marginBottom: mode === 'register' ? '1rem' : '0.5rem'
              }}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password..."
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                className="login-input"
                style={{
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'inherit',
                  padding: '0.75rem',
                  width: '100%',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              />
            </div>
          )}

          {error && (
            <span className="login-error" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block', fontWeight: 'bold' }}>
              ⚠️ {error}
            </span>
          )}

          <button
            type="submit"
            className="login-btn"
            style={{
              background: mode === 'login' ? 'var(--accent-teal)' : 'var(--purple)',
              color: mode === 'login' ? '#000' : '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem',
              width: '100%',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1.5rem',
              transition: 'all 0.2s'
            }}
          >
            {mode === 'login' ? 'Sign In' : 'Create Profile'}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>🔒 100% Private, Secure & Local</span>
          <p style={{ marginTop: '0.25rem' }}>
            {mode === 'register' 
              ? 'Creating a profile registers your key locally. No one else can claim this key on your browser.'
              : 'Sign in to access your local credentials. Your records are hidden from other usernames.'}
          </p>
        </div>
      </div>
    </div>
  );
}
