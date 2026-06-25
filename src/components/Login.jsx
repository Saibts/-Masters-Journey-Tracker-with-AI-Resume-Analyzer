import { useState } from 'react';

export default function Login({ onLogin }) {
  const [userIdInput, setUserIdInput] = useState('');
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

    // Directly log in the user without storing or displaying a public directory of other usernames
    onLogin(trimmed);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h2>Masters Journey & Academics Tracker</h2>
          <p>Your personal roadmap to academic excellence</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userId">Enter Your Private User ID</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter your unique profile key..."
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
                marginTop: '0.5rem'
              }}
            />
            {error && <span className="login-error" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
          </div>

          <button type="submit" className="login-btn" style={{
            background: 'var(--accent-teal)',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            padding: '0.75rem',
            width: '100%',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem',
            transition: 'background 0.2s'
          }}>
            Sign In / Access Profile
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>🔒 100% Private, Secure & Local</span>
          <p style={{ marginTop: '0.25rem' }}>Your profile key loads your local data. Other members cannot view your key or access your records.</p>
        </div>
      </div>
    </div>
  );
}
