import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, Calendar, BarChart3, Sparkles,
  Award, User, LogOut, Menu, X, Target, BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/habits', icon: Target, label: 'Habits' },
  { to: '/daily-tracker', icon: CheckSquare, label: 'Daily Tracker' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/ai-motivation', icon: Sparkles, label: 'AI Motivation' },
  { to: '/achievements', icon: Award, label: 'Achievements' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sidebarContent = (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <BookOpen size={28} className="logo-icon" />
          {!collapsed && <span className="logo-text">Lakshay-Arpit Habit AI App</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <Menu size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && user && (
          <div className="sidebar-user">
            <div className="user-avatar-sm">{user.name?.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
        )}
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="mobile-sidebar-header">
                <div className="sidebar-logo">
                  <BookOpen size={28} className="logo-icon" />
                  <span className="logo-text">Lakshay-Arpit Habit AI App</span>
                </div>
                <button className="close-btn" onClick={() => setMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="sidebar-nav">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="sidebar-footer">
                {user && (
                  <div className="sidebar-user">
                    <div className="user-avatar-sm">{user.name?.charAt(0).toUpperCase()}</div>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                )}
                <button className="nav-item logout-btn" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="desktop-sidebar">
        {sidebarContent}
      </div>
    </>
  );
}
