import { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_LINKS = ['About','Skills','Projects','Education','Awards','Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="nav-logo">Srimanikanta</a>

      <ul className="nav-links">
        {NAV_LINKS.map(link => (
          <li key={link}>
            <a href={`#${link.toLowerCase()}`} className="nav-link" data-text={link}>
              {link}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-right hidden-mobile">
        <div className="open-badge">
          <span className="open-dot" /> Open to Work
        </div>
        <a href="#contact" className="hire-btn">Hire Me</a>
      </div>

      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span />
        <span />
        <span />
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="nav-link"
              data-text={link}
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <a href="#contact" className="hire-btn" onClick={() => setMenuOpen(false)}>Hire Me</a>
        </div>
      )}
    </nav>
  );
}
