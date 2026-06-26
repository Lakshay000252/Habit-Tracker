import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Calendar, PieChart, Target,
  CheckCircle, Clock, Zap, Flame,
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';
import { weeklyProgressData, monthlyProgressData } from '../data/dummyData';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function Analytics() {
  const { habits, getTodayStats, getCurrentStreak, getLongestStreak, getProductivityScore, getCategoryColor } = useHabits();
  const [period, setPeriod] = useState('weekly');
  const stats = getTodayStats();

  const barData = {
    labels: weeklyProgressData.labels,
    datasets: [
      {
        label: 'Completed',
        data: weeklyProgressData.completed,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Total',
        data: weeklyProgressData.total,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels: monthlyProgressData.labels,
    datasets: [
      {
        label: 'Habits Completed',
        data: monthlyProgressData.completed,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointRadius: 3,
      },
    ],
  };

  const categoryData = {
    labels: habits.map(h => h.habitName || h.name),
    datasets: [
      {
        data: habits.map(h => (h.completedDates || []).length),
        backgroundColor: habits.map(h => getCategoryColor(h.category)),
        borderWidth: 2,
        borderColor: 'var(--card-bg)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'var(--card-bg)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-secondary)', font: { size: 11 } },
      },
      y: {
        grid: { color: 'var(--border-color)', drawBorder: false },
        ticks: { color: 'var(--text-secondary)', font: { size: 11 }, stepSize: 1 },
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      x: { grid: { display: false }, ticks: { display: false } },
      y: { grid: { color: 'var(--border-color)', drawBorder: false }, ticks: { color: 'var(--text-secondary)' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'var(--text-secondary)', padding: 15, font: { size: 11 }, usePointStyle: true },
      },
      tooltip: chartOptions.plugins.tooltip,
    },
    cutout: '65%',
  };

  return (
    <div className="analytics-page">
      <Navbar title="Analytics" />

      <div className="analytics-content">
        <div className="analytics-stats">
          <StatCard icon={CheckCircle} label="Completed Today" value={stats.completed} color="#10b981" />
          <StatCard icon={Flame} label="Current Streak" value={`${getCurrentStreak()}d`} color="#f97316" />
          <StatCard icon={Zap} label="Productivity" value={`${getProductivityScore()}%`} color="#06b6d4" />
          <StatCard icon={Target} label="Total Habits" value={habits.length} color="#6366f1" />
        </div>

        <div className="analytics-charts">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Weekly Progress</h3>
              <div className="period-toggle">
                <button className={period === 'weekly' ? 'active' : ''} onClick={() => setPeriod('weekly')}>Weekly</button>
                <button className={period === 'monthly' ? 'active' : ''} onClick={() => setPeriod('monthly')}>Monthly</button>
              </div>
            </div>
            <div className="chart-body">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Productivity Trend</h3>
                <TrendingUp size={18} color="var(--text-secondary)" />
              </div>
              <div className="chart-body">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Habit Distribution</h3>
                <PieChart size={18} color="var(--text-secondary)" />
              </div>
              <div className="chart-body doughnut-body">
                {habits.length > 0 ? (
                  <Doughnut data={categoryData} options={doughnutOptions} />
                ) : (
                  <div className="empty-chart">
                    <BarChart3 size={48} />
                    <p>No data yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="completion-rate-card">
            <h3>Overall Completion Rate</h3>
            <div className="completion-rate-content">
              <ProgressRing percentage={stats.rate} size={140} strokeWidth={10} />
              <div className="completion-details">
                <div className="completion-item">
                  <span className="completion-label">Success Rate</span>
                  <span className="completion-value">{stats.rate}%</span>
                </div>
                <div className="completion-item">
                  <span className="completion-label">Completed</span>
                  <span className="completion-value">{stats.completed}/{stats.total}</span>
                </div>
                <div className="completion-item">
                  <span className="completion-label">Productivity</span>
                  <span className="completion-value">{getProductivityScore()}/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
