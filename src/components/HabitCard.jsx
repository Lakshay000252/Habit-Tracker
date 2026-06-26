import { motion } from 'framer-motion';
import { BookOpen, Dumbbell, Book, Brain, Droplets, Sparkles, Check, Pencil, Trash2, Flame } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import './HabitCard.css';

const iconMap = { BookOpen, Dumbbell, Book, Brain, Droplets, Sparkles };

export default function HabitCard({ habit, onEdit, onDelete }) {
  const { getCategoryColor, getCategoryName, isHabitCompletedToday, toggleHabitCompletion } = useHabits();
  const completed = isHabitCompletedToday(habit);
  const color = getCategoryColor(habit.category);
  const Icon = iconMap[habit.category === 'water' ? 'Droplets' : habit.category === 'custom' ? 'Sparkles' : habit.category === 'study' ? 'BookOpen' : habit.category === 'exercise' ? 'Dumbbell' : habit.category === 'reading' ? 'Book' : habit.category === 'meditation' ? 'Brain' : 'Sparkles'] || Sparkles;

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      className={`habit-card ${completed ? 'completed' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="habit-card-left">
        <div className="habit-icon" style={{ background: `${color}20`, color }}>
          <Icon size={22} />
        </div>
        <div className="habit-info">
          <h3 className="habit-name">{habit.name}</h3>
          <p className="habit-desc">{habit.description}</p>
          <div className="habit-meta">
            <span className="habit-category" style={{ background: `${color}20`, color }}>
              {getCategoryName(habit.category)}
            </span>
            <span className="habit-streak">
              <Flame size={14} color="#f59e0b" />
              {habit.streak} day streak
            </span>
          </div>
        </div>
      </div>
      <div className="habit-card-right">
        <motion.button
          className={`complete-btn ${completed ? 'done' : ''}`}
          onClick={() => toggleHabitCompletion(habit._id || habit.id, today)}
          whileTap={{ scale: 0.9 }}
          style={{ borderColor: completed ? '#10b981' : color }}
        >
          {completed ? <Check size={18} /> : <span className="habit-time">{habit.time}</span>}
        </motion.button>
        <div className="habit-actions">
          <button className="habit-action-btn" onClick={() => onEdit(habit)} title="Edit">
            <Pencil size={14} />
          </button>
          <button className="habit-action-btn delete" onClick={() => onDelete(habit)} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
