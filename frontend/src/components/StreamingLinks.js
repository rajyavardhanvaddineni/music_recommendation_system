import React from 'react';

export default function StreamingLinks({ links }) {
  if (!links) return null;
  return (
    <div className="streaming-links">
      <a href={links.spotify} target="_blank" rel="noreferrer" className="stream-btn spotify">🟢 Spotify</a>
      <a href={links.youtube} target="_blank" rel="noreferrer" className="stream-btn youtube">🔴 YouTube</a>
      <a href={links.apple_music} target="_blank" rel="noreferrer" className="stream-btn apple">🍎 Apple</a>
      <a href={links.amazon_music} target="_blank" rel="noreferrer" className="stream-btn">📦 Amazon</a>
    </div>
  );
}
