import { useState, useEffect } from 'react';

export default function Login({ onLogin }) {
  const [userIdInput, setUserIdInput] = useState('');
  const [knownUsers, setKnownUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const rawList = localStorage.getItem('masters-journey-tracker-user-list');
      if (rawList) {
        setKnownUsers(JSON.parse(rawList));
      }
    } catch (e) {
      console.error('Failed to load user list', e);
    }
  }, []);

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

    // Add to known users if not present
    const updatedUsers = [...new Set([...knownUsers, trimmed])];
    localStorage.setItem('masters-journey-tracker-user-list', JSON.stringify(updatedUsers));
    
    onLogin(trimmed);
  };

  const handleSelectUser = (user) => {
    onLogin(user);
  };

  const handleDeleteUser = (e, userToDelete) => {
    e.stopPropagation();
    const updated = knownUsers.filter(u => u !== userToDelete);
    setKnownUsers(updated);
    localStorage.setItem('masters-journey-tracker-user-list', JSON.stringify(updated));
    // Also clean up that user's data if desired, or keep it. Let's just remove from listed users for UI simplicity.
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h2>Masters Journey Tracker</h2>
          <p>Your personal roadmap to global academic excellence</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userId">Enter User ID / Name</label>
            <input
              id="userId"
              type="text"
              placeholder="e.g., alex_robotics"
              value={userIdInput}
              onChange={(e) => {
                setUserIdInput(e.target.value);
                setError('');
              }}
              autoFocus
              className="login-input"
            />
            {error && <span className="login-error">{error}</span>}
          </div>

          <button type="submit" className="login-btn">
            Sign In / Create Profile
          </button>
        </form>

        {knownUsers.length > 0 && (
          <div className="known-users-section">
            <h3>Or switch to an existing profile:</h3>
            <div className="known-users-list">
              {knownUsers.map((user) => (
                <div
                  key={user}
                  className="known-user-item"
                  onClick={() => handleSelectUser(user)}
                >
                  <span className="user-icon">🤖</span>
                  <span className="user-name">{user}</span>
                  <button
                    className="delete-user-btn"
                    onClick={(e) => handleDeleteUser(e, user)}
                    title="Remove profile from list"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="login-footer">
          <span>🔒 Fully Private & Local</span>
          <p>All data is stored directly in your browser's LocalStorage</p>
        </div>
      </div>
    </div>
  );
}
