import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Target } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import Navbar from '../components/Navbar';
import './Calendar.css';

export default function CalendarPage() {
  const { habits, getCurrentStreak } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getCompletionForDate = (dateStr) => {
    if (!dateStr) return 0;
    const completed = habits.filter(h => h.completedDates.includes(dateStr)).length;
    const total = habits.length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getIntensityClass = (pct) => {
    if (pct === 0) return '';
    if (pct <= 25) return 'intensity-1';
    if (pct <= 50) return 'intensity-2';
    if (pct <= 75) return 'intensity-3';
    return 'intensity-4';
  };

  const isFutureDate = (day) => {
    const date = new Date(year, month, day + 1);
    return date > new Date();
  };

  const totalCompletedThisMonth = habits.reduce((sum, h) => {
    return sum + h.completedDates.filter(d => {
      const dObj = new Date(d);
      return dObj.getMonth() === month && dObj.getFullYear() === year;
    }).length;
  }, 0);

  return (
    <div className="calendar-page">
      <Navbar title="Calendar" />

      <div className="calendar-content">
        <div className="calendar-stats">
          <div className="cal-stat">
            <Flame size={20} color="#f97316" />
            <div>
              <strong>{getCurrentStreak()} days</strong>
              <span>Current Streak</span>
            </div>
          </div>
          <div className="cal-stat">
            <Target size={20} color="#6366f1" />
            <div>
              <strong>{totalCompletedThisMonth}</strong>
              <span>Completed this month</span>
            </div>
          </div>
        </div>

        <div className="calendar-container">
          <div className="calendar-header">
            <button className="cal-nav" onClick={prevMonth}><ChevronLeft size={20} /></button>
            <h3>{monthName}</h3>
            <button className="cal-nav" onClick={nextMonth}><ChevronRight size={20} /></button>
          </div>

          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="weekday">{d}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const pct = getCompletionForDate(dateStr);
              const isToday = dateStr === today;
              const future = isFutureDate(day);

              return (
                <motion.div
                  key={day}
                  className={`calendar-day ${getIntensityClass(pct)} ${isToday ? 'today' : ''} ${future ? 'future' : ''}`}
                  whileHover={!future ? { scale: 1.1 } : {}}
                  title={`${dateStr}: ${Math.round(pct)}% completion`}
                >
                  <span className="day-number">{day}</span>
                  {pct > 0 && <span className="day-dot" />}
                </motion.div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span>Less</span>
            <div className="legend-box empty" />
            <div className="legend-box intensity-1" />
            <div className="legend-box intensity-2" />
            <div className="legend-box intensity-3" />
            <div className="legend-box intensity-4" />
            <span>More</span>
          </div>
        </div>

        <div className="streak-visualization">
          <h3>Streak History</h3>
          <div className="streak-grid">
            {Array.from({ length: 90 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (89 - i));
              const dateStr = date.toISOString().split('T')[0];
              const pct = getCompletionForDate(dateStr);
              const isToday2 = dateStr === today;
              return (
                <div
                  key={i}
                  className={`streak-cell ${getIntensityClass(pct)} ${isToday2 ? 'today' : ''}`}
                  title={`${dateStr}: ${Math.round(pct)}%`}
                />
              );
            })}
          </div>
          <div className="streak-label">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
