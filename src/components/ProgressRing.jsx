import './ProgressRing.css';

export default function ProgressRing({ percentage = 0, size = 120, strokeWidth = 8, color, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="progress-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={color || 'var(--primary-color)'}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div className="progress-ring-text">
        <span className="progress-value">{Math.round(percentage)}%</span>
        {label && <span className="progress-label">{label}</span>}
      </div>
    </div>
  );
}
