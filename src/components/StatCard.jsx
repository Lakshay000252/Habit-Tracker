import { motion } from 'framer-motion';
import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, color, subtitle, onClick }) {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -4 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: `${color || 'var(--primary-color)'}20`, color: color || 'var(--primary-color)' }}>
          <Icon size={22} />
        </div>
      </div>
      <div className="stat-card-body">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </motion.div>
  );
}
