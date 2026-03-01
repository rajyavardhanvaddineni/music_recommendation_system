import React, { useState } from 'react';
import { Send } from 'lucide-react';
import TrackList from '../components/TrackList';
import { getRecommendations } from '../utils/api';
import { MOOD_SUGGESTIONS } from '../utils/helpers';

export default function MoodRecommend({ playTrack, toggleLike, isLiked, currentTrack, isPlaying }) {
  const [moodText, setMoodText] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [detectedMoods, setDetectedMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const genres = ['blues','classical','country','disco','hiphop','jazz','metal','pop','reggae','rock'];

  const handleSubmit = async () => {
    if (!moodText.trim()) return;
    setLoading(true);
    try {
      const data = await getRecommendations(moodText, selectedGenres, 12);
      setTracks(data.tracks || []);
      setDetectedMoods(data.detected_moods || []);
      setSearched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (g) => setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  return (
    <div className="mood-page">
      <div className="page-header-gradient" style={{ '--header-color': '#8b5cf6' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900 }}>Mood Mix</h1>
        <p style={{ color: 'var(--text-subdued)', marginTop: 8 }}>Tell us how you feel and we'll find the perfect tracks</p>
      </div>

      <div className="page-content">
        <div className="mood-input-wrap">
          <div className="mood-input-box">
            <input
              className="mood-input"
              placeholder="How are you feeling? (e.g. 'I want something chill and relaxing')"
              value={moodText}
              onChange={e => setMoodText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button className="mood-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? '...' : <Send size={18} />}
            </button>
          </div>

          <div className="mood-suggestions">
            {(MOOD_SUGGESTIONS || []).map(s => (
              <button key={s} className="mood-chip" onClick={() => setMoodText(s)}>{s}</button>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ color: 'var(--text-subdued)', fontSize: 13, marginBottom: 10 }}>Filter by genre (optional):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {genres.map(g => (
                <button key={g} onClick={() => toggleGenre(g)} style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  border: '1px solid', cursor: 'pointer', textTransform: 'capitalize',
                  background: selectedGenres.includes(g) ? 'var(--essential-bright)' : 'transparent',
                  borderColor: selectedGenres.includes(g) ? 'var(--essential-bright)' : 'rgba(255,255,255,0.2)',
                  color: selectedGenres.includes(g) ? 'black' : 'var(--text-subdued)',
                }}>{g}</button>
              ))}
            </div>
          </div>
        </div>

        {searched && detectedMoods.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: 'var(--text-subdued)', fontSize: 14, marginBottom: 10 }}>Detected moods:</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {detectedMoods.map(m => (
                <span key={m} style={{ background: 'var(--essential-bright)', color: 'black', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>{m}</span>
              ))}
            </div>
          </div>
        )}

        {tracks.length > 0 && (
          <section>
            <div className="section-title">Recommended for you</div>
            <TrackList tracks={tracks} playTrack={playTrack} toggleLike={toggleLike} isLiked={isLiked} currentTrack={currentTrack} isPlaying={isPlaying} />
          </section>
        )}

        {searched && tracks.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-subdued)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
            <p>No tracks found. Try a different mood!</p>
          </div>
        )}
      </div>
    </div>
  );
}
