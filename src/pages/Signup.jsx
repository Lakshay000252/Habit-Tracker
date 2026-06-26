import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Eye, EyeOff, UserPlus, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import './Auth.css';

const LOADING_SAFETY_TIMEOUT = 25000;

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signup } = useAuth();
  const { addToast } = useHabits();
  const navigate = useNavigate();
  const mountedRef = useRef(true);
  const submittingRef = useRef(false);
  const loadingTimerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      setLoading(false);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setError('');
    setLoading(true);
    submittingRef.current = true;

    loadingTimerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        console.log('[Signup] loading safety timeout triggered');
        setLoading(false);
        submittingRef.current = false;
        setError('Request timed out. Please check that the backend server is running.');
      }
    }, LOADING_SAFETY_TIMEOUT);

    try {
      const { name, email, password, confirmPassword } = form;
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      console.log('[Signup] calling auth signup');
      const result = await signup(name, email, password);
      console.log('[Signup] auth result:', result);
      if (!mountedRef.current) return;
      if (!result.success) {
        setError(result.error);
        addToast(result.error || 'Registration failed', 'error');
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('[Signup] unexpected error:', err);
      setError('An unexpected error occurred');
      addToast('Registration failed', 'error');
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      submittingRef.current = false;
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <BookOpen size={28} />
            <span>Lakshay-Arpit Habit AI App</span>
          </Link>
          <h1>Create Account</h1>
          <p>Start building better habits today</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <motion.button
            type="submit"
            className="auth-submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? <Loader size={18} className="spin" /> : <UserPlus size={18} />}
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>
        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
