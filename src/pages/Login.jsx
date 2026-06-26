import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Eye, EyeOff, LogIn, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import './Auth.css';

const LOADING_SAFETY_TIMEOUT = 25000;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
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
        console.log('[Login] loading safety timeout triggered');
        setLoading(false);
        submittingRef.current = false;
        setError('Request timed out. Please check that the backend server is running.');
      }
    }, LOADING_SAFETY_TIMEOUT);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      console.log('[Login] calling auth login');
      const result = await login(email, password);
      console.log('[Login] auth result:', result);
      if (!mountedRef.current) return;
      if (!result.success) {
        setError(result.error);
        addToast(result.error || 'Login failed', 'error');
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('[Login] unexpected error:', err);
      setError('An unexpected error occurred');
      addToast('Login failed', 'error');
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
          <h1>Welcome Back</h1>
          <p>Sign in to continue your journey</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="auth-options">
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </div>
          <motion.button
            type="submit"
            className="auth-submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? <Loader size={18} className="spin" /> : <LogIn size={18} />}
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>
        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
