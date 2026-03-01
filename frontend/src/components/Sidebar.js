import React from 'react';
import { Home, Search, Music, BookOpen, LayoutDashboard } from 'lucide-react';

const NAV = [
  { id: 'home',      label: 'Home',      icon: Home },
  { id: 'search',    label: 'Search',    icon: Search },
  { id: 'mood',      label: 'Mood Mix',  icon: Music },
  { id: 'library',   label: 'Library',   icon: BookOpen },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🎵</div>
        <span className="logo-text">MoodTune</span>
      </div>

      <div className="nav-section">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${currentPage === id ? 'active' : ''}`}
            onClick={() => setCurrentPage(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <p className="sidebar-section-title">Your Library</p>
        <div className="library-items">
          {[
            { emoji: '❤️', bg: '#e91429', label: 'Liked Songs',     sub: 'Playlist' },
            { emoji: '🎵', bg: '#1db954', label: 'Mood Mixes',      sub: 'Auto playlist' },
            { emoji: '🕐', bg: '#333',    label: 'Recently Played', sub: 'Playlist' },
          ].map(({ emoji, bg, label, sub }) => (
            <div key={label} className="library-item">
              <div className="lib-art" style={{ background: bg }}>{emoji}</div>
              <div>
                <div className="lib-title">{label}</div>
                <div className="lib-sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}