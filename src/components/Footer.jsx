import { BookOpen } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <BookOpen size={24} className="footer-logo-icon" />
          <span className="footer-logo-text">Lakshay-Arpit Habit AI App</span>
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
        <p className="footer-copy">&copy; 2026 Lakshay-Arpit Habit AI App. All rights reserved.</p>
      </div>
    </footer>
  );
}
