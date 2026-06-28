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
    let userExists = rawData !== null;

    let parsedData = null;
    if (userExists) {
      try {
        parsedData = JSON.parse(rawData);
      } catch (err) {}
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
      
      const defaultState = {
        password: password,
        profile: {
          fullName: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
          targetTerm: 'Fall 2028',
          currentCourse: 'Robotics and Automation',
          collegeName: '',
          cgpa: '',
          semesters: {},
          projects: []
        }
      };
      localStorage.setItem(storageKeyForUser, JSON.stringify(defaultState));
      localStorage.setItem(`${STORAGE_KEY}-current-user`, trimmed);
      onLogin(trimmed);
    } else {
      // Sign In mode
      if (!userExists) {
        setError('User ID not found. Register a new account first.');
        return;
      }
      if (parsedData && parsedData.password) {
        if (parsedData.password !== password) {
          setError('Incorrect password. Please try again.');
          return;
        }
      }
      localStorage.setItem(`${STORAGE_KEY}-current-user`, trimmed);
      onLogin(trimmed);
    }
  };

  return (
    <div className="login-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="login-card card" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '40px',
        borderRadius: '8px'
      }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-color)' }}>Academic Portal</h1>
          <p style={{ opacity: 0.8 }}>Manage Coursework, Grades, & Projects</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>User ID</label>
            <input
              type="text"
              className="form-control"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="e.g. student123"
              style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
              />
            </div>
          )}

          {error && (
            <div className="error-message" style={{
              color: '#ff4d4d',
              fontSize: '0.9rem',
              marginBottom: '20px',
              padding: '10px',
              border: '1px solid #ff4d4d',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 77, 77, 0.1)'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', cursor: 'pointer' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
          {mode === 'login' ? (
            <p>
              New here?{' '}
              <button
                className="btn-link"
                onClick={() => { setMode('register'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register as a new user
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                className="btn-link"
                onClick={() => { setMode('login'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
