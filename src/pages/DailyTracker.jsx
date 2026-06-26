import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Target, Flame, Zap } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import Navbar from '../components/Navbar';
import ProgressRing from '../components/ProgressRing';
import './DailyTracker.css';

export default function DailyTracker() {
  const { habits, toggleHabitCompletion, isHabitCompletedToday, getTodayStats, getCurrentStreak, getProductivityScore, getCategoryColor } = useHabits();
  const [filter, setFilter] = useState('all');
  const today = new Date().toISOString().split('T')[0];
  const stats = getTodayStats();

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const filteredHabits = habits.filter(h => {
    if (filter === 'completed') return isHabitCompletedToday(h);
    if (filter === 'pending') return !isHabitCompletedToday(h);
    return true;
  });

  return (
    <div className="tracker-page">
      <Navbar title="Daily Tracker" />

      <div className="tracker-content">
        <div className="tracker-header">
          <div>
            <h2>Today's Habits</h2>
            <p className="tracker-date">{todayDate}</p>
          </div>
          <div className="tracker-quick-stats">
            <div className="tracker-stat-chip">
              <Flame size={16} color="#f97316" />
              <span>{getCurrentStreak()} day streak</span>
            </div>
            <div className="tracker-stat-chip">
              <Zap size={16} color="#06b6d4" />
              <span>{getProductivityScore()}% productive</span>
            </div>
          </div>
        </div>

        <div className="tracker-progress-bar-container">
          <div className="tracker-progress-header">
            <span>Daily Progress</span>
            <span className="tracker-progress-count">{stats.completed} / {stats.total} completed</span>
          </div>
          <div className="tracker-progress-bar">
            <motion.div
              className="tracker-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${stats.rate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ background: stats.rate === 100 ? 'linear-gradient(90deg, #10b981, #059669)' : 'var(--primary-gradient)' }}
            />
          </div>
        </div>

        <div className="tracker-stats-row">
          <div className="tracker-stat-box">
            <ProgressRing percentage={stats.rate} size={90} strokeWidth={6} />
          </div>
          <div className="tracker-stat-cards">
            <div className="tracker-stat-card">
              <Target size={18} color="#6366f1" />
              <div>
                <strong>{stats.total}</strong>
                <span>Total</span>
              </div>
            </div>
            <div className="tracker-stat-card">
              <CheckCircle size={18} color="#10b981" />
              <div>
                <strong>{stats.completed}</strong>
                <span>Done</span>
              </div>
            </div>
            <div className="tracker-stat-card">
              <Clock size={18} color="#f59e0b" />
              <div>
                <strong>{stats.pending}</strong>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tracker-filters">
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              className={`tracker-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="tracker-list">
          {filteredHabits.length === 0 ? (
            <div className="empty-state">
              <Target size={48} />
              <h3>No habits {filter !== 'all' ? filter : ''}</h3>
              <p>Create some habits to get started!</p>
            </div>
          ) : (
            filteredHabits.map((habit, i) => {
              const completed = isHabitCompletedToday(habit);
              const color = getCategoryColor(habit.category);
              return (
                <motion.div
                  key={habit.id}
                  className={`tracker-item ${completed ? 'completed' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    className={`tracker-check ${completed ? 'checked' : ''}`}
                    onClick={() => toggleHabitCompletion(habit.id, today)}
                    style={{ borderColor: completed ? '#10b981' : color }}
                  >
                    {completed ? <CheckCircle size={22} color="#10b981" /> : <Circle size={22} color={color} />}
                  </button>
                  <div className="tracker-item-info">
                    <span className="tracker-item-name">{habit.name}</span>
                    <div className="tracker-item-meta">
                      <span className="tracker-item-time" style={{ color }}>
                        {habit.time}
                      </span>
                      <span className="tracker-item-streak">
                        <Flame size={12} color="#f59e0b" /> {habit.streak} day
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
