import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import './Toast.css';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

export default function ToastContainer() {
  const { toasts } = useHabits();

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = icons[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              layout
            >
              <Icon size={18} />
              <span>{toast.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
