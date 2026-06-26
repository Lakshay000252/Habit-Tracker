import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { habitsAPI, progressAPI, analyticsAPI } from '../services/api';
import { categories } from '../data/dummyData';
import { useAuth } from './AuthContext';

const HabitContext = createContext();

const extractData = (res) => {
  const body = res.data;
  if (body && body.success && body.data !== undefined) return body.data;
  return body;
};

export function HabitProvider({ children }) {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalHabits: 0, completedToday: 0, pendingToday: 0,
    completionRate: 0, productivityScore: 0, currentStreak: 0,
  });

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const fetchHabits = useCallback(async () => {
    try {
      const res = await habitsAPI.getAll();
      const data = extractData(res);
      setHabits(Array.isArray(data) ? data : []);
    } catch (error) {
      const status = error.response?.status;
      if (status !== 401) {
        addToast('Failed to load habits', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await analyticsAPI.getDashboard();
      const data = extractData(res);
      setDashboardStats(data || {});
    } catch (error) {
      // silently fail
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchDashboardStats();
    } else {
      setHabits([]);
      setDashboardStats({
        totalHabits: 0, completedToday: 0, pendingToday: 0,
        completionRate: 0, productivityScore: 0, currentStreak: 0,
      });
      setLoading(false);
    }
  }, [user, fetchHabits, fetchDashboardStats]);

  const addHabit = async (habitData) => {
    try {
      const res = await habitsAPI.create(habitData);
      const data = extractData(res);
      setHabits(prev => [...prev, data]);
      addToast('Habit created successfully!');
      fetchDashboardStats();
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to create habit';
      addToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const updateHabit = async (id, data) => {
    try {
      const res = await habitsAPI.update(id, data);
      const updated = extractData(res);
      setHabits(prev => prev.map(h => (h._id || h.id) === id ? updated : h));
      addToast('Habit updated successfully!');
      return { success: true };
    } catch (error) {
      addToast('Failed to update habit', 'error');
      return { success: false };
    }
  };

  const deleteHabit = async (id) => {
    try {
      console.log('Deleting habit with ID:', id);
      await habitsAPI.delete(id);
      setHabits(prev => prev.filter(h => (h._id || h.id) !== id));
      addToast('Habit deleted successfully!');
      fetchDashboardStats();
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to delete habit';
      console.error('Delete habit error:', msg, error);
      addToast(msg, 'error');
      return { success: false };
    }
  };

  const toggleHabitCompletion = async (habitId, date) => {
    const habit = habits.find(h => (h._id || h.id) === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const isComplete = habit.completedDates?.includes(today);

    try {
      if (isComplete) {
        await progressAPI.markIncomplete(habitId, date);
        setHabits(prev => prev.map(h =>
          (h._id || h.id) === habitId
            ? { ...h, completedDates: (h.completedDates || []).filter(d => d !== today) }
            : h
        ));
      } else {
        const res = await progressAPI.markComplete(habitId, date);
        const body = extractData(res);
        const { currentStreak, longestStreak } = body || {};
        setHabits(prev => prev.map(h =>
          (h._id || h.id) === habitId
            ? { ...h, completedDates: [...(h.completedDates || []), today], streak: currentStreak, longestStreak }
            : h
        ));
      }
      fetchDashboardStats();
    } catch (error) {
      addToast('Failed to update habit completion', 'error');
    }
  };

  const isHabitCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates?.includes(today) || false;
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const total = habits.length;
    const completed = habits.filter(h => h.completedDates?.includes(today)).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, rate };
  };

  const getCategoryColor = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.color : '#6366f1';
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Custom';
  };

  const getCurrentStreak = () => dashboardStats.currentStreak || 0;

  const getLongestStreak = () => Math.max(...habits.map(h => h.longestStreak || 0), 0);

  const getProductivityScore = () => dashboardStats.productivityScore || 0;

  return (
    <HabitContext.Provider value={{
      habits, toasts, loading, dashboardStats, addHabit, updateHabit, deleteHabit,
      toggleHabitCompletion, isHabitCompletedToday, getTodayStats, getCategoryColor,
      getCategoryName, getCurrentStreak, getLongestStreak, getProductivityScore,
      addToast, categories, setHabits, fetchHabits, fetchDashboardStats,
    }}>
      {children}
    </HabitContext.Provider>
  );
}

export const useHabits = () => useContext(HabitContext);
