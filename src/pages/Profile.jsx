import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Save, Moon, Sun, Bell, Shield,
  Target, Flame, Award, LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import Navbar from '../components/Navbar';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { habits, getTodayStats, getCurrentStreak, getLongestStreak } = useHabits();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const stats = getTodayStats();
  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="profile-page">
      <Navbar title="Profile" />

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2>{user?.name || 'User'}</h2>
            <p>{user?.email || 'user@example.com'}</p>
            <span className="profile-member-since">
              Member since {new Date(user?.id ? parseInt(user.id) : Date.now()).toLocaleDateString()}
            </span>
          </div>

          {editing ? (
            <div className="profile-edit-form">
              <div className="form-group">
                <label><User size={16} /> Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label><Mail size={16} /> Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="profile-actions">
                <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>
                  <Save size={16} /> Save
                </button>
              </div>
              {saved && <div className="save-success">Profile updated successfully!</div>}
            </div>
          ) : (
            <button className="edit-profile-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-settings">
          <div className="settings-section">
            <h3>Settings</h3>

            <div className="setting-item">
              <div className="setting-info">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                <div>
                  <strong>Dark Mode</strong>
                  <span>Toggle dark/light theme</span>
                </div>
              </div>
              <button className={`toggle-btn ${darkMode ? 'active' : ''}`} onClick={toggleTheme}>
                <div className="toggle-knob" />
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <Bell size={20} />
                <div>
                  <strong>Notifications</strong>
                  <span>Receive daily reminders</span>
                </div>
              </div>
              <button className={`toggle-btn ${notifications ? 'active' : ''}`} onClick={() => setNotifications(!notifications)}>
                <div className="toggle-knob" />
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h3>Account Statistics</h3>
            <div className="account-stats">
              <div className="account-stat">
                <Target size={18} color="#6366f1" />
                <span>Total Habits</span>
                <strong>{habits.length}</strong>
              </div>
              <div className="account-stat">
                <Award size={18} color="#10b981" />
                <span>Completed Today</span>
                <strong>{stats.completed}</strong>
              </div>
              <div className="account-stat">
                <Flame size={18} color="#f97316" />
                <span>Current Streak</span>
                <strong>{getCurrentStreak()}d</strong>
              </div>
              <div className="account-stat">
                <Award size={18} color="#8b5cf6" />
                <span>Longest Streak</span>
                <strong>{getLongestStreak()}d</strong>
              </div>
              <div className="account-stat">
                <Target size={18} color="#f59e0b" />
                <span>Total Completions</span>
                <strong>{totalCompletions}</strong>
              </div>
              <div className="account-stat">
                <Award size={18} color="#06b6d4" />
                <span>Success Rate</span>
                <strong>{stats.rate}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
