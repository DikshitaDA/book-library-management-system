// frontend/src/components/Navbar.jsx
import React from 'react';

const Navbar = ({ totalCount, availableCount, currentUser, onOpenAuth, onLogout }) => {
  return (
    <header className="navbar-container">
      <div className="nav-brand">
        <span className="terminal-prefix">// LIBRARY REPOSITORY</span>
        <h2>Catalog & Circulation System</h2>
      </div>

      <div className="nav-stats">
        <div className="stat-chip">
          <span className="stat-label">Total Volume</span>
          <span className="stat-num">{totalCount}</span>
        </div>
        <div className="stat-chip">
          <span className="stat-label">In Circulation</span>
          <span className="stat-num highlight">{availableCount}</span>
        </div>

        {currentUser ? (
          <div className="user-badge">
            <span className="stat-label">Logged In</span>
            <span className="user-name">{currentUser.name}</span>
            <button className="auth-action-btn" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <button className="auth-login-btn" onClick={onOpenAuth}>
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;