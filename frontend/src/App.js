import React, { useState } from 'react';
import { ThemeProvider } from './utils/ThemeContext';
import { AuthProvider } from './utils/AuthContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Player from './components/Player';
import Home from './pages/Home';
import Search from './pages/Search';
import MoodRecommend from './pages/MoodRecommend';
import Library from './pages/Library';
import Dashboard from './pages/Dashboard';
import AuthModal from './components/AuthModal';
import ThemeModal from './components/ThemeModal';
import './App.css';

function AppInner() {
  const [currentPage, setCurrentPage]   = useState('home');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue]               = useState([]);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [likedTracks, setLikedTracks]   = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [showAuth, setShowAuth]         = useState(false);
  const [showTheme, setShowTheme]       = useState(false);

  const playTrack = (track, trackList = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setQueue(trackList.length > 0 ? trackList : [track]);
    setRecentTracks(prev => [track, ...prev.filter(t => t.id !== track.id)].slice(0, 20));
  };

  const toggleLike = (track) =>
    setLikedTracks(prev =>
      prev.find(t => t.id === track.id) ? prev.filter(t => t.id !== track.id) : [...prev, track]
    );

  const isLiked = (id) => likedTracks.some(t => t.id === id);

  const playNext = () => {
    if (!currentTrack || !queue.length) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    if (idx < queue.length - 1) playTrack(queue[idx + 1], queue);
  };

  const playPrev = () => {
    if (!currentTrack || !queue.length) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) playTrack(queue[idx - 1], queue);
  };

  const sharedProps = {
    playTrack, toggleLike, isLiked, currentTrack, isPlaying,
    likedTracks, recentTracks,
    onShowAuth:  () => setShowAuth(true),
    onShowTheme: () => setShowTheme(true),
  };

  const pages = {
    home:      <Home      {...sharedProps} />,
    search:    <Search    {...sharedProps} />,
    mood:      <MoodRecommend {...sharedProps} />,
    library:   <Library   {...sharedProps} />,
    dashboard: <Dashboard {...sharedProps} />,
  };

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {pages[currentPage] || pages.home}
      </main>
      <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={playNext}
        onPrev={playPrev}
        toggleLike={toggleLike}
        isLiked={isLiked}
      />
      {showAuth  && <AuthModal  onClose={() => setShowAuth(false)} />}
      {showTheme && <ThemeModal onClose={() => setShowTheme(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}