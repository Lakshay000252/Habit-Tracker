import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, ArrowUpDown, Search, Target } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import AddHabitModal from '../components/AddHabitModal';
import EditHabitModal from '../components/EditHabitModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { categories } from '../data/dummyData';
import './Habits.css';

export default function Habits() {
  const { habits } = useHabits();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showAdd, setShowAdd] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [deleteHabit, setDeleteHabit] = useState(null);

  const filtered = habits
    .filter(h => {
      if (filter !== 'all' && h.category !== filter) return false;
      if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'streak') return b.streak - a.streak;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="habits-page">
      <Navbar title="Habits" searchQuery={search} setSearchQuery={setSearch} />

      <div className="habits-content">
        <div className="habits-toolbar">
          <div className="toolbar-left">
            <h2>Your Habits</h2>
            <span className="habit-count">{filtered.length} habits</span>
          </div>
          <div className="toolbar-right">
            <div className="filter-group">
              <Filter size={16} />
              <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <ArrowUpDown size={16} />
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="streak">Streak</option>
                <option value="name">Name</option>
              </select>
            </div>
            <motion.button
              className="add-habit-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdd(true)}
            >
              <Plus size={18} />
              Add Habit
            </motion.button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Target size={64} />
            <h3>No habits found</h3>
            <p>Create your first habit to start tracking your progress.</p>
            <button className="add-habit-btn" onClick={() => setShowAdd(true)}>
              <Plus size={18} />
              Create Habit
            </button>
          </div>
        ) : (
          <div className="habits-grid">
            {filtered.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={setEditHabit}
                onDelete={setDeleteHabit}
              />
            ))}
          </div>
        )}
      </div>

      <AddHabitModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
      <EditHabitModal isOpen={!!editHabit} onClose={() => setEditHabit(null)} habit={editHabit} />
      <DeleteConfirmModal isOpen={!!deleteHabit} onClose={() => setDeleteHabit(null)} habit={deleteHabit} />
    </div>
  );
}
