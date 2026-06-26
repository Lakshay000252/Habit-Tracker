import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, CheckCircle, Clock, TrendingUp, Flame, Award,
  Zap, BookOpen, Dumbbell, Brain, ArrowRight, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';
import { motivationalQuotes } from '../data/dummyData';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { habits, getTodayStats, getCurrentStreak, getLongestStreak, getProductivityScore } = useHabits();
  const navigate = useNavigate();
  const stats = getTodayStats();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const aiMessage = habits.length > 0
    ? `Amazing! You've maintained a ${getCurrentStreak()} day streak. Keep pushing forward!`
    : 'Start by creating your first habit to begin your journey!';

  const productivityScore = getProductivityScore();

  const quickActions = [
    { label: 'Add Habit', icon: Target, color: '#6366f1', onClick: () => navigate('/habits') },
    { label: 'Daily Tracker', icon: CheckCircle, color: '#10b981', onClick: () => navigate('/daily-tracker') },
    { label: 'AI Motivation', icon: Sparkles, color: '#f59e0b', onClick: () => navigate('/ai-motivation') },
    { label: 'View Analytics', icon: TrendingUp, color: '#8b5cf6', onClick: () => navigate('/analytics') },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="welcome-text">
            {greeting()}, <span className="user-name-highlight">{user?.name || 'User'}</span>!
          </h2>
          <p className="welcome-sub">Here's your habit overview for today.</p>
        </div>
      </div>

      <motion.div
        className="ai-motivation-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="ai-card-glow" />
        <Sparkles size={24} className="ai-sparkle" />
        <div className="ai-card-content">
          <span className="ai-label">AI Motivation</span>
          <p className="ai-text">{aiMessage}</p>
        </div>
      </motion.div>

      <div className="stats-grid">
        <StatCard icon={Target} label="Total Habits" value={stats.total} color="#6366f1" />
        <StatCard icon={CheckCircle} label="Completed Today" value={stats.completed} color="#10b981" />
        <StatCard icon={Clock} label="Pending Habits" value={stats.pending} color="#f59e0b" />
        <StatCard icon={Flame} label="Current Streak" value={`${getCurrentStreak()} days`} color="#f97316" />
        <StatCard icon={Award} label="Longest Streak" value={`${getLongestStreak()} days`} color="#8b5cf6" />
        <StatCard icon={Zap} label="Productivity Score" value={`${productivityScore}%`} color="#06b6d4" subtitle={productivityScore >= 80 ? 'Excellent!' : productivityScore >= 50 ? 'Good progress' : 'Room for improvement'} />
      </div>

      <div className="dashboard-middle">
        <div className="progress-section">
          <h3>Today's Progress</h3>
          <div className="progress-ring-container">
            <ProgressRing percentage={stats.rate} size={160} strokeWidth={10} label="Completion" />
          </div>
          <div className="progress-stats">
            <div className="progress-stat-item">
              <span className="progress-stat-value">{stats.completed}/{stats.total}</span>
              <span className="progress-stat-label">Habits Done</span>
            </div>
            <div className="progress-stat-divider" />
            <div className="progress-stat-item">
              <span className="progress-stat-value">{productivityScore}%</span>
              <span className="progress-stat-label">Productivity</span>
            </div>
          </div>
        </div>

        <div className="quote-section">
          <div className="quote-card">
            <BookOpen size={20} className="quote-icon" />
            <p className="quote-text">"{quote.text}"</p>
            <span className="quote-author">- {quote.author}</span>
          </div>
          <div className="category-breakdown">
            <h3>Categories</h3>
            <div className="category-list">
              {['study', 'exercise', 'reading', 'meditation', 'water'].map(cat => {
                const count = habits.filter(h => h.category === cat).length;
                const colors = { study: '#6366f1', exercise: '#10b981', reading: '#f59e0b', meditation: '#8b5cf6', water: '#06b6d4' };
                const icons = { study: BookOpen, exercise: Dumbbell, reading: BookOpen, meditation: Brain, water: Brain };
                const Icon = icons[cat] || Target;
                return count > 0 ? (
                  <div key={cat} className="category-item">
                    <div className="category-icon" style={{ background: `${colors[cat]}20`, color: colors[cat] }}>
                      <Icon size={16} />
                    </div>
                    <span className="category-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    <span className="category-count">{count}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map((action, i) => (
            <motion.button
              key={i}
              className="quick-action-btn"
              style={{ '--btn-color': action.color }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
            >
              <div className="quick-action-icon" style={{ background: `${action.color}20`, color: action.color }}>
                <action.icon size={22} />
              </div>
              <span>{action.label}</span>
              <ArrowRight size={16} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
