import React from 'react';
import { Play, Heart, ExternalLink, Pause, Share2 } from 'lucide-react';
import { getGenreStyle } from '../utils/helpers';

export default function TrackList({ tracks, playTrack, toggleLike, isLiked, currentTrack, isPlaying, onShare }) {
  if (!tracks || tracks.length === 0) {
    return <div style={{ color: 'var(--text-subdued)', padding: '24px 0' }}>No tracks found.</div>;
  }

  return (
    <div className="track-list">
      <div className="track-list-header">
        <span className="col-num">#</span>
        <span className="col-title">TITLE</span>
        <span className="col-genre hide-mobile">GENRE</span>
        <span className="col-bpm hide-mobile">BPM</span>
        <span className="col-actions">ACTIONS</span>
      </div>

      {tracks.map((track, idx) => {
        const style   = getGenreStyle(track.genre);
        const playing = currentTrack?.id === track.id && isPlaying;
        const active  = currentTrack?.id === track.id;

        return (
          <div key={track.id} className={`track-row ${active ? 'active' : ''}`} onDoubleClick={() => playTrack(track, tracks)}>
            <span className="col-num">
              {playing
                ? <Pause size={14} style={{ color: 'var(--essential-bright)' }} />
                : active
                  ? <Play size={14} style={{ color: 'var(--essential-bright)' }} />
                  : <span style={{ color: 'var(--text-subdued)' }}>{idx + 1}</span>}
            </span>

            <div className="col-title" style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
              <div className="track-art" style={{ background:`linear-gradient(135deg,${style.c1},${style.c2})`, flexShrink:0, cursor:'pointer' }} onClick={() => playTrack(track, tracks)}>
                {playing ? '▶' : style.emoji}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:14, color:active?'var(--essential-bright)':'var(--text-base)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontFamily:'inherit' }}>
                  {track.title}
                </div>
                <div style={{ fontSize:13, color:'var(--text-subdued)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontFamily:'inherit' }}>
                  {track.artist}
                </div>
              </div>
            </div>

            <span className="col-genre hide-mobile">
              <span style={{ background:`linear-gradient(135deg,${style.c1}33,${style.c2}33)`, color:style.c1, padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600, textTransform:'capitalize' }}>
                {track.genre}
              </span>
            </span>

            <span className="col-bpm hide-mobile" style={{ color:'var(--text-subdued)', fontSize:13 }}>
              {track.tempo} BPM
            </span>

            <div className="col-actions" style={{ display:'flex', alignItems:'center', gap:6 }}>
              <button className={`icon-btn ${isLiked(track.id) ? 'liked' : ''}`} onClick={() => toggleLike(track)}>
                <Heart size={15} fill={isLiked(track.id) ? 'currentColor' : 'none'} />
              </button>
              {onShare && (
                <button className="icon-btn" onClick={() => onShare(track)} title="Copy share link">
                  <Share2 size={15} />
                </button>
              )}
              {track.streaming && (
                <a href={track.streaming.spotify} target="_blank" rel="noreferrer" className="icon-btn hide-mobile">
                  <ExternalLink size={15} />
                </a>
              )}
              <button className="icon-btn" onClick={() => playTrack(track, tracks)}>
                {playing ? <Pause size={15} /> : <Play size={15} />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}