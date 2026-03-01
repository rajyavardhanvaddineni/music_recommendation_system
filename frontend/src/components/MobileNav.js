import React from 'react';
import { Home, Search, Music, BookOpen, LayoutDashboard } from 'lucide-react';

const NAV = [
  { id: 'home',      label: 'Home',      icon: Home },
  { id: 'search',    label: 'Search',    icon: Search },
  { id: 'mood',      label: 'Mood',      icon: Music },
  { id: 'library',   label: 'Library',   icon: BookOpen },
  { id: 'dashboard', label: 'Stats',     icon: LayoutDashboard },
];

export default function MobileNav({ currentPage, setCurrentPage }) {
  return (
    <nav className="mobile-nav" style={{ display: 'none' }}>
      {NAV.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`mobile-nav-btn ${currentPage === id ? 'active' : ''}`}
          onClick={() => setCurrentPage(id)}
        >
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}