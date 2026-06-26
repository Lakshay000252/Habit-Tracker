import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import './Modal.css';

export default function DeleteConfirmModal({ isOpen, onClose, habit }) {
  const { deleteHabit } = useHabits();

  const handleDelete = () => {
    if (habit) {
      deleteHabit(habit._id || habit.id);
      onClose();
    }
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
            className="modal-content modal-sm"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Delete Habit</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <div className="delete-body">
              <AlertTriangle size={48} color="#ef4444" />
              <p>Are you sure you want to delete <strong>"{habit?.name}"</strong>?</p>
              <p className="delete-sub">This action cannot be undone.</p>
            </div>
            <div className="form-actions">
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
