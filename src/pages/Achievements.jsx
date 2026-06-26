import { motion } from 'framer-motion';
import {
  Award, Trophy, Star, Flame, Crown, Target, BookOpen,
  Dumbbell, Brain, Droplets, Footprints, CalendarCheck,
  Sunrise, Lock,
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import Navbar from '../components/Navbar';
import { achievements } from '../data/dummyData';
import './Achievements.css';

const iconMap = {
  Footprints, Flame, Star, CalendarCheck, Trophy, Sunrise,
  BookOpen, Dumbbell, Droplets, Brain, Award, Crown, Target, Lock,
};

export default function Achievements() {
  const { getCurrentStreak, getLongestStreak, habits } = useHabits();
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  const totalCompleted = habits.reduce((sum, h) => sum + h.completedDates.length, 0);

  return (
    <div className="achievements-page">
      <Navbar title="Achievements" />

      <div className="achievements-content">
        <div className="achievements-header">
          <h2>Your Badges & Achievements</h2>
          <p>{unlocked.length} / {achievements.length} unlocked</p>
        </div>

        <div className="achievements-progress-bar">
          <motion.div
            className="achievements-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <div className="achievements-stats">
          <div className="ach-stat">
            <Trophy size={20} color="#f59e0b" />
            <div>
              <strong>{getLongestStreak()} days</strong>
              <span>Longest Streak</span>
            </div>
          </div>
          <div className="ach-stat">
            <Target size={20} color="#6366f1" />
            <div>
              <strong>{habits.length}</strong>
              <span>Active Habits</span>
            </div>
          </div>
          <div className="ach-stat">
            <Award size={20} color="#10b981" />
            <div>
              <strong>{totalCompleted}</strong>
              <span>Total Completions</span>
            </div>
          </div>
        </div>

        {unlocked.length > 0 && (
          <section>
            <h3 className="section-title">Unlocked</h3>
            <div className="achievements-grid">
              {unlocked.map((ach, i) => {
                const Icon = iconMap[ach.icon] || Award;
                return (
                  <motion.div
                    key={ach.id}
                    className="achievement-card unlocked"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className="ach-icon unlocked-icon">
                      <Icon size={28} />
                    </div>
                    <h4>{ach.name}</h4>
                    <p>{ach.description}</p>
                    <span className="ach-date">Earned {ach.unlockedDate}</span>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {locked.length > 0 && (
          <section>
            <h3 className="section-title">Locked</h3>
            <div className="achievements-grid">
              {locked.map((ach, i) => {
                const Icon = iconMap[ach.icon] || Lock;
                return (
                  <motion.div
                    key={ach.id}
                    className="achievement-card locked"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="ach-icon locked-icon">
                      <Lock size={20} />
                    </div>
                    <h4>{ach.name}</h4>
                    <p>{ach.description}</p>
                    <span className="ach-locked-text">Keep going!</span>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
