import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Smile, Frown, Moon, Brain, Zap,
  RefreshCw, Quote, Lightbulb, Send,
} from 'lucide-react';
import { aiAPI } from '../services/api';
import { useHabits } from '../context/HabitContext';
import Navbar from '../components/Navbar';
import { aiMotivations, motivationalQuotes } from '../data/dummyData';
import './AIMotivation.css';

const moods = [
  { id: 'happy', icon: Smile, label: 'Happy', color: '#10b981' },
  { id: 'sad', icon: Frown, label: 'Sad', color: '#6366f1' },
  { id: 'lazy', icon: Moon, label: 'Lazy', color: '#f59e0b' },
  { id: 'stressed', icon: Brain, label: 'Stressed', color: '#8b5cf6' },
  { id: 'motivated', icon: Zap, label: 'Motivated', color: '#f97316' },
];

export default function AIMotivation() {
  const { getCurrentStreak, habits } = useHabits();
  const [selectedMood, setSelectedMood] = useState(null);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const generateMessage = async (mood) => {
    setIsGenerating(true);
    setSelectedMood(mood);
    try {
      const res = await aiAPI.motivate(mood);
      setMessage(res.data.message);
    } catch {
      const msgs = aiMotivations[mood] || aiMotivations.motivated;
      const random = msgs[Math.floor(Math.random() * msgs.length)];
      const streak = getCurrentStreak();
      setMessage(random + (streak > 0 ? ` You're on a ${streak}-day streak!` : ''));
    }
    setIsGenerating(false);
  };

  const randomQuote = () => {
    const q = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setSuggestion(`${q.text} — ${q.author}`);
  };

  const generateSuggestion = async () => {
    try {
      const res = await aiAPI.suggestions();
      const s = res.data.suggestions;
      if (s && s.length > 0) {
        setSuggestion(s[0]);
        return;
      }
    } catch {}
    const tips = [
      'Try the "2-minute rule": start with just 2 minutes of your habit.',
      'Habit stacking: attach a new habit to an existing one.',
      'Use implementation intentions: "I will [HABIT] at [TIME] in [LOCATION]".',
      'Reward yourself after completing your habit each day.',
      'Track your progress visually to stay motivated.',
      'Share your goals with a friend for accountability.',
      'Focus on the process, not the outcome.',
      'Never miss twice. It\'s okay to miss once, just don\'t let it become two.',
    ];
    setSuggestion(tips[Math.floor(Math.random() * tips.length)]);
  };

  const handleCustomPrompt = () => {
    if (!customPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const responses = [
        `That's a great goal! Start by breaking "${customPrompt}" into small daily actions. You've got this!`,
        `"${customPrompt}" is an excellent focus area. Remember: consistency over intensity.`,
        `Thinking about "${customPrompt}" is the first step. Now take one tiny action toward it today.`,
        `Your intention to work on "${customPrompt}" shows great self-awareness. Small steps lead to big changes.`,
      ];
      setMessage(responses[Math.floor(Math.random() * responses.length)]);
      setIsGenerating(false);
      setCustomPrompt('');
    }, 1000);
  };

  return (
    <div className="aimotivation-page">
      <Navbar title="AI Motivation" />

      <div className="aimotivation-content">
        <div className="mood-section">
          <h2>How are you feeling today?</h2>
          <p>Select your mood for a personalized motivational message.</p>
          <div className="mood-grid">
            {moods.map(m => (
              <motion.button
                key={m.id}
                className={`mood-btn ${selectedMood === m.id ? 'active' : ''}`}
                style={{ '--mood-color': m.color }}
                onClick={() => generateMessage(m.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <m.icon size={28} />
                <span>{m.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {(message || isGenerating) && (
            <motion.div
              className="message-card"
              key="message"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Sparkles size={24} className="message-sparkle" />
              <div className="message-content">
                {isGenerating ? (
                  <div className="message-loading">
                    <div className="typing-dots">
                      <span /><span /><span />
                    </div>
                    <span>Generating your personalized motivation...</span>
                  </div>
                ) : (
                  <>
                    <p className="message-text">{message}</p>
                    <button className="regenerate-btn" onClick={() => generateMessage(selectedMood)}>
                      <RefreshCw size={16} />
                      Regenerate
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="motivation-extra">
          <div className="quote-card-ai">
            <div className="quote-card-header">
              <Quote size={18} />
              <h3>Daily Quote</h3>
            </div>
            <p className="quote-display">{suggestion || 'Click below for a dose of wisdom.'}</p>
            <button className="generate-btn" onClick={randomQuote}>
              <RefreshCw size={16} />
              New Quote
            </button>
          </div>

          <div className="suggestion-card">
            <div className="quote-card-header">
              <Lightbulb size={18} />
              <h3>AI Suggestion</h3>
            </div>
            <p className="suggestion-text">{suggestion || 'Get a science-backed habit tip.'}</p>
            <button className="generate-btn" onClick={generateSuggestion}>
              <Lightbulb size={16} />
              Get Tip
            </button>
          </div>
        </div>

        <div className="custom-prompt-section">
          <h3>Ask AI for Motivation</h3>
          <p>Tell me what you're working on or struggling with.</p>
          <div className="custom-prompt-input">
            <input
              type="text"
              placeholder="e.g., I want to start reading more..."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustomPrompt()}
            />
            <motion.button
              className="send-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCustomPrompt}
              disabled={!customPrompt.trim()}
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
