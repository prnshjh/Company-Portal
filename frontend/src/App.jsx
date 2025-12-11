import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      fetchLogs(token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        fetchLogs(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLogs(data.logs);
      } else {
        setError(data.error || 'Failed to fetch logs');
      }
    } catch (err) {
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setLogs([]);
    setEmail('');
    setPassword('');
  };

  const getRoleBasedContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'manager':
        return {
          title: 'Manager Dashboard',
          sections: [
            { name: 'Team Logs', icon: '👥' },
            { name: 'Reports', icon: '📊' }
          ],
          color: '#3b82f6'
        };
      case 'worker':
        return {
          title: 'Worker Dashboard',
          sections: [
            { name: 'My Tasks Logs', icon: '✓' }
          ],
          color: '#10b981'
        };
      case 'sde':
        return {
          title: 'SDE Dashboard',
          sections: [
            { name: 'Deployment Logs', icon: '🚀' },
            { name: 'Error Logs', icon: '🐛' }
          ],
          color: '#8b5cf6'
        };
      default:
        return {
          title: 'Dashboard',
          sections: [],
          color: '#6b7280'
        };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>Company Portal</h1>
              <p>Sign in to access your dashboard</p>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials:</p>
              <div className="credentials-grid">
                <div className="credential-item">
                  <strong>Manager:</strong>
                  <span>manager@deepalgorithms.com / manager123</span>
                </div>
                <div className="credential-item">
                  <strong>Worker:</strong>
                  <span>worker@deepalgorithms.com / worker123</span>
                </div>
                <div className="credential-item">
                  <strong>SDE:</strong>
                  <span>sde@deepalgorithms.com / sde123</span>
                </div>
                 <div className="credential-item">
                  <strong>CEO:</strong>
                  <span>ceo@deepalgorithms.com / ceo123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const roleContent = getRoleBasedContent();

  return (
    <div className="app">
      <nav className="navbar" style={{ borderTopColor: roleContent.color }}>
        <div className="nav-content">
          <h2>Company Portal</h2>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role" style={{ backgroundColor: roleContent.color }}>
              {user.role.toUpperCase()}
            </span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard">
        <div className="dashboard-header">
          <h1>{roleContent.title}</h1>
          <p>Welcome back, {user.name}!</p>
        </div>

        <div className="sections-container">
          {roleContent.sections.map((section, index) => (
            <div key={index} className="section-card" style={{ borderLeftColor: roleContent.color }}>
              <div className="section-header">
                <span className="section-icon">{section.icon}</span>
                <h3>{section.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="logs-container">
          <div className="logs-header">
            <h2>Activity Logs</h2>
            <button onClick={() => fetchLogs(localStorage.getItem('token'))} className="refresh-button">
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading logs...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : logs.length > 0 ? (
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-content">
                    <p className="log-message">{log.message}</p>
                    {log.status && (
                      <span className={`log-status status-${log.status}`}>
                        {log.status}
                      </span>
                    )}
                  </div>
                  <span className="log-timestamp">{log.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-logs">No logs available</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
