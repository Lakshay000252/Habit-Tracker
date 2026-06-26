import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { categories } from '../data/dummyData';
import './Modal.css';

export default function AddHabitModal({ isOpen, onClose }) {
  const { addHabit } = useHabits();
  const [form, setForm] = useState({
    habitName: '', description: '', category: 'study', targetFrequency: 'daily', reminderTime: '08:00',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.habitName.trim()) errs.habitName = 'Habit name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const result = await addHabit(form);
    setSubmitting(false);
    if (result.success) {
      setForm({ habitName: '', description: '', category: 'study', targetFrequency: 'daily', reminderTime: '08:00' });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add New Habit</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Habit Name</label>
                <input
                  type="text"
                  placeholder="e.g., Morning Jog"
                  value={form.habitName}
                  onChange={e => setForm({ ...form, habitName: e.target.value })}
                />
                {errors.habitName && <span className="form-error">{errors.habitName}</span>}
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  placeholder="Describe your habit..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Frequency</label>
                  <select value={form.targetFrequency} onChange={e => setForm({ ...form, targetFrequency: e.target.value })}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <input
                  type="time"
                  value={form.reminderTime}
                  onChange={e => setForm({ ...form, reminderTime: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? <Loader size={16} className="spin" /> : null}
                  {submitting ? 'Creating...' : 'Create Habit'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
