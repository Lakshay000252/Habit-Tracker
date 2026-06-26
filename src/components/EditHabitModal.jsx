import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { categories } from '../data/dummyData';
import './Modal.css';

export default function EditHabitModal({ isOpen, onClose, habit }) {
  const { updateHabit } = useHabits();
  const [form, setForm] = useState({ name: '', description: '', category: 'study', frequency: 'daily', time: '08:00' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (habit) {
      setForm({
        name: habit.name,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        time: habit.time,
      });
    }
  }, [habit]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Habit name is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || !habit) return;
    updateHabit(habit._id || habit.id, form);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && habit && (
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
              <h2>Edit Habit</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Habit Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
                {errors.description && <span className="form-error">{errors.description}</span>}
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
                  <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
