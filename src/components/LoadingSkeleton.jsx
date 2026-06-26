import './LoadingSkeleton.css';

export function StatSkeleton() {
  return (
    <div className="skeleton stat-skeleton">
      <div className="skeleton-icon" />
      <div className="skeleton-line w-60" />
      <div className="skeleton-line w-40" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="skeleton card-skeleton">
      <div className="skeleton-row">
        <div className="skeleton-icon" />
        <div>
          <div className="skeleton-line w-60" />
          <div className="skeleton-line w-40" />
        </div>
      </div>
      <div className="skeleton-btn" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="skeleton chart-skeleton">
      <div className="skeleton-line w-40" style={{ marginBottom: '1rem' }} />
      <div className="skeleton-chart" />
    </div>
  );
}

export default function LoadingSkeleton({ type = 'stat' }) {
  switch (type) {
    case 'stat': return <StatSkeleton />;
    case 'card': return <CardSkeleton />;
    case 'chart': return <ChartSkeleton />;
    default: return <StatSkeleton />;
  }
}
