import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Target, BarChart3, Sparkles, Award, CheckSquare, ArrowRight, Star, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import './Landing.css';

const features = [
  { icon: Target, title: 'Track Habits', desc: 'Create and manage daily habits with beautiful cards and categories.' },
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Visualize your progress with detailed charts and insights.' },
  { icon: Sparkles, title: 'AI Motivation', desc: 'Get personalized motivational messages based on your mood.' },
  { icon: Award, title: 'Achievements', desc: 'Unlock badges and rewards as you build consistency.' },
  { icon: CheckSquare, title: 'Daily Tracker', desc: 'Check off habits and watch your streaks grow.' },
  { icon: Award, title: 'Dark Mode', desc: 'Beautiful glassmorphism UI with dark/light theme support.' },
];

const testimonials = [
  { name: 'Lakshay', role: 'Web Designer', text: 'Lakshay-Arpit Habit AI App completely transformed my daily routine. The AI motivation keeps me going!', avatar: 'L', rating: 5 },
  { name: 'Arpit Dagar', role: 'Frontend Developer', text: 'Best habit tracker I\'ve used. The analytics and streak tracking are amazing.', avatar: 'A', rating: 5 },
  { name: 'Sahil Biban', role: 'Backend Developer', text: 'The glassmorphism UI is gorgeous. I actually look forward to tracking my habits.', avatar: 'S', rating: 5 },
];

export default function Landing() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <BookOpen size={28} className="brand-icon" />
            <span className="brand-text">Lakshay-Arpit Habit AI App</span>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
            <button className="nav-btn-secondary" onClick={() => navigate('/login')}>Log In</button>
            <button className="nav-btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-orbs">
          <div className="hero-orb" />
          <div className="hero-orb" />
          <div className="hero-orb" />
        </div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <Sparkles size={14} />
            AI-Powered Habit Tracking
          </div>
          <h1 className="hero-title">
            Build Better Habits <br />
            with <span className="gradient-text">AI Motivation</span>
          </h1>
          <p className="hero-subtitle">
            Transform your daily routine with intelligent habit tracking,
            personalized AI motivation, and beautiful visual analytics.
          </p>
          <div className="hero-buttons">
            <motion.button
              className="hero-btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
            >
              Start Free Trial <ArrowRight size={18} />
            </motion.button>
            <motion.button
              className="hero-btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              Watch Demo
            </motion.button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>1000K+</strong>
              <span>Active Users</span>
            </div>
            <div className="hero-stat">
              <strong>5000K+</strong>
              <span>Habits Tracked</span>
            </div>
            <div className="hero-stat">
              <strong>99.9%</strong>
              <span>Satisfaction</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Everything You Need</h2>
          <p>Powerful features to help you build and maintain life-changing habits.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="feature-icon">
                <f.icon size={28} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Users Say</h2>
          <p>Join thousands of happy users who transformed their lives.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-avatar">{t.avatar}</div>
              <div className="testimonial-stars">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Transform Your Habits?</h2>
          <p>Join Lakshay-Arpit Habit AI App today and start building a better version of yourself.</p>
          <motion.button
            className="hero-btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
          >
            Get Started Free <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

function SunIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
