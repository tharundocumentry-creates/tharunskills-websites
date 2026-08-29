import React from 'react';
import { Mail, Phone, Code, Monitor, Youtube, Layout } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-grid">
          
          <div className="footer-column glass">
            <h3 className="text-gradient">Applications</h3>
            <div className="tags-container">
              <span className="tag">Blender</span>
              <span className="tag">After Effects</span>
              <span className="tag">Photoshop</span>
              <span className="tag">DaVinci Resolve</span>
              <span className="tag">Illustrator</span>
              <span className="tag">Premiere Pro</span>
              <span className="tag accent-tag">AI Video Gen</span>
              <span className="tag accent-tag">AI Image Gen</span>
            </div>
          </div>

          <div className="footer-column glass">
            <h3 className="text-gradient">Skills</h3>
            <ul className="skills-list">
              <li><Layout size={18}/> Touch Typing (110wpm)</li>
              <li><Code size={18}/> Script Writing</li>
              <li><Youtube size={18}/> Lyrics Writing</li>
              <li><Monitor size={18}/> Content Management</li>
              <li><Monitor size={18}/> Meta Ads</li>
              <li className="text-accent"><Code size={18}/> AI Automation Workflows</li>
            </ul>
          </div>

          <div className="footer-column glass contact-column">
            <h3 className="text-gradient">Connect With Me</h3>
            <p className="contact-desc">Ready to elevate your brand identity with compelling visuals? Let's talk.</p>
            
            <a href="tel:+919677959324" className="contact-link">
              <Phone size={24} />
              <span>+91 96779 59324</span>
            </a>
            
            <a href="mailto:p.tharun2003@outlook.com" className="contact-link">
              <Mail size={24} />
              <span>p.tharun2003@outlook.com</span>
            </a>
          </div>

        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Tharun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
