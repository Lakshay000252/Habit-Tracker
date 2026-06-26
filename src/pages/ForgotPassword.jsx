import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Send, ArrowLeft } from 'lucide-react';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setSent(true);
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
          {!sent ? (
            <>
              <h1>Forgot Password</h1>
              <p>Enter your email and we'll send you a reset link</p>
            </>
          ) : (
            <>
              <h1>Check Your Email</h1>
              <p>We've sent a password reset link to {email}</p>
            </>
          )}
        </div>
        {!sent ? (
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
            <motion.button
              type="submit"
              className="auth-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send size={18} />
              Send Reset Link
            </motion.button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <motion.button
              className="auth-submit"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSent(false)}
            >
              <ArrowLeft size={18} />
              Send Again
            </motion.button>
          </div>
        )}
        <p className="auth-footer-text">
          <Link to="/login">Back to Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
