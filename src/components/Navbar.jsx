import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Search, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ title, searchQuery, setSearchQuery }) {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'You have 3 pending habits for today', time: '2 hours ago', read: false },
    { id: 2, text: 'Great work! You completed your meditation habit', time: '5 hours ago', read: false },
    { id: 3, text: 'You\'ve maintained a 7-day streak!', time: '1 day ago', read: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{title || 'Dashboard'}</h1>
      </div>

      <div className="navbar-right">
        {setSearchQuery && (
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search habits..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="notification-wrapper">
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
            <Bell size={20} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
            )}
          </button>
          {showNotifications && (
            <motion.div
              className="notification-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="dropdown-header">
                <h3>Notifications</h3>
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                  <p>{n.text}</p>
                  <span className="notification-time">{n.time}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="user-menu-wrapper">
          <button className="user-avatar-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </button>
          {showUserMenu && (
            <motion.div
              className="user-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="dropdown-user-info">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
              <hr />
              <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                <User size={16} /> Profile
              </button>
              <button onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}
