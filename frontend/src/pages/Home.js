import React, { useState, useEffect } from 'react';
import { Play, Palette, LogIn, LogOut, User } from 'lucide-react';
import TrackList from '../components/TrackList';
import { getAllTracks } from '../utils/api';
import { getGenreStyle } from '../utils/helpers';
import { useAuth } from '../utils/AuthContext';

const GREETING = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const FEATURED_GENRES = [
  { genre: 'hiphop', label: 'Hip-Hop Hits' },
  { genre: 'pop', label: 'Pop Bangers' },
  { genre: 'jazz', label: 'Jazz Essentials' },
  { genre: 'rock', label: 'Rock Classics' },
  { genre: 'classical', label: 'Classical Focus' },
  { genre: 'reggae', label: 'Reggae Vibes' },
];

export default function Home({ playTrack, toggleLike, isLiked, currentTrack, isPlaying, recentTracks, onShowAuth, onShowTheme }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    getAllTracks().then(d => setTracks(d.tracks || [])).finally(() => setLoading(false));
  }, []);

  const allTracks = tracks.slice(0, 15);

  return (
    <div className="home-page">
      <div className="page-header-gradient" style={{ '--header-color': 'var(--essential-bright)' }}>
        <div className="topbar">
          <div />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="user-btn" onClick={onShowTheme} title="Change Theme">
              <Palette size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Theme
            </button>
            {user ? (
              <>
                <button className="user-btn">
                  <User size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  {user.username}
                </button>
                <button className="user-btn" onClick={logout}>
                  <LogOut size={16} style={{ verticalAlign: 'middle' }} />
                </button>
              </>
            ) : (
              <button className="user-btn" onClick={onShowAuth}>
                <LogIn size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Log In
              </button>
            )}
          </div>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginTop: 16 }}>
          {GREETING()}{user ? `, ${user.username}` : ''}
        </h1>
      </div>

      <div className="page-content">
        <div className="quick-play-grid">
          {FEATURED_GENRES.map(({ genre, label }) => {
            const t = tracks.find(tr => tr.genre === genre);
            const style = getGenreStyle(genre);
            return (
              <div key={genre} className="quick-play-item"
                onClick={() => t && playTrack(t, tracks.filter(tr => tr.genre === genre))}>
                <div className="qp-art" style={{ background: `linear-gradient(135deg, ${style.c1}, ${style.c2})` }}>
                  {style.emoji}
                </div>
                <span className="qp-title">{label}</span>
                <button className="qp-play"><Play size={16} fill="black" /></button>
              </div>
            );
          })}
        </div>

        {recentTracks && recentTracks.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div className="section-title">Recently Played</div>
            <TrackList tracks={recentTracks.slice(0, 5)} playTrack={playTrack}
              toggleLike={toggleLike} isLiked={isLiked} currentTrack={currentTrack} isPlaying={isPlaying} />
          </section>
        )}

        <section>
          <div className="section-title">All Tracks</div>
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : (
            <TrackList tracks={allTracks} playTrack={playTrack}
              toggleLike={toggleLike} isLiked={isLiked} currentTrack={currentTrack} isPlaying={isPlaying} />
          )}
        </section>
      </div>
    </div>
  );
}