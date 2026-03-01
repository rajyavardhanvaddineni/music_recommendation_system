import React, { useState } from 'react';
import { Heart, Clock, Download, Share2, Music } from 'lucide-react';
import TrackList from '../components/TrackList';
import { getGenreStyle } from '../utils/helpers';

export default function Library({ playTrack, toggleLike, isLiked, currentTrack, isPlaying, likedTracks, recentTracks }) {
  const [tab, setTab] = useState('liked');
  const [shareMsg, setShareMsg] = useState('');

  // Export liked songs as M3U playlist
  const exportPlaylist = () => {
    if (likedTracks.length === 0) return;
    const lines = ['#EXTM3U', ''];
    likedTracks.forEach(t => {
      lines.push(`#EXTINF:-1,${t.artist} - ${t.title}`);
      lines.push(`https://www.youtube.com/results?search_query=${encodeURIComponent(t.title+' '+t.artist)}`);
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], { type: 'audio/x-mpegurl' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'MoodTune_Liked_Songs.m3u'; a.click();
    URL.revokeObjectURL(url);
  };

  // Export as JSON
  const exportJSON = () => {
    if (likedTracks.length === 0) return;
    const data = JSON.stringify(likedTracks.map(t=>({title:t.title,artist:t.artist,genre:t.genre,tempo:t.tempo})), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'MoodTune_Liked_Songs.json'; a.click();
    URL.revokeObjectURL(url);
  };

  // Share a track
  const shareTrack = (track) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(track.title+' '+track.artist)}`;
    navigator.clipboard.writeText(`🎵 Listen to "${track.title}" by ${track.artist}!\n${url}`);
    setShareMsg(`Link copied for "${track.title}"!`);
    setTimeout(() => setShareMsg(''), 3000);
  };

  // Genre breakdown of liked songs
  const genreCounts = {};
  likedTracks.forEach(t => { genreCounts[t.genre] = (genreCounts[t.genre]||0)+1; });

  return (
    <div className="library-page">
      <div className="page-header-gradient" style={{'--header-color':'#e91429'}}>
        <h1 style={{fontSize:36,fontWeight:900}}>Your Library</h1>
        <p style={{color:'var(--text-subdued)',marginTop:8}}>{likedTracks.length} liked songs · {recentTracks.length} recently played</p>
      </div>

      <div className="page-content">
        {shareMsg && (
          <div style={{background:'var(--essential-bright)',color:'black',padding:'10px 20px',borderRadius:10,marginBottom:16,fontWeight:700,fontSize:14,textAlign:'center'}}>
            ✅ {shareMsg}
          </div>
        )}

        {/* Tabs */}
        <div style={{display:'flex',gap:8,marginBottom:24}}>
          {[
            {id:'liked',   label:'Liked Songs',     icon:<Heart size={14}/>,  count:likedTracks.length},
            {id:'recent',  label:'Recently Played',  icon:<Clock size={14}/>,  count:recentTracks.length},
          ].map(({id,label,icon,count})=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              padding:'10px 20px',borderRadius:30,border:'none',cursor:'pointer',
              background:tab===id?'var(--essential-bright)':'var(--bg-highlight)',
              color:tab===id?'black':'var(--text-subdued)',
              fontWeight:700,fontSize:14,display:'flex',alignItems:'center',gap:8
            }}>
              {icon} {label} {count > 0 && <span style={{background:tab===id?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.1)',borderRadius:10,padding:'1px 7px',fontSize:12}}>{count}</span>}
            </button>
          ))}
        </div>

        {/* Liked Songs */}
        {tab === 'liked' && (
          <>
            {likedTracks.length > 0 && (
              <>
                {/* Export buttons */}
                <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
                  <button onClick={exportPlaylist} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 18px',background:'var(--bg-highlight)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'var(--text-base)',cursor:'pointer',fontSize:13,fontWeight:600}}>
                    <Download size={15}/> Export as M3U Playlist
                  </button>
                  <button onClick={exportJSON} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 18px',background:'var(--bg-highlight)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'var(--text-base)',cursor:'pointer',fontSize:13,fontWeight:600}}>
                    <Download size={15}/> Export as JSON
                  </button>
                  <button onClick={()=>playTrack(likedTracks[0],likedTracks)} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 18px',background:'var(--essential-bright)',border:'none',borderRadius:10,color:'black',cursor:'pointer',fontSize:13,fontWeight:700}}>
                    ▶ Play All
                  </button>
                </div>

                {/* Genre summary */}
                {Object.keys(genreCounts).length > 0 && (
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>
                    {Object.entries(genreCounts).sort((a,b)=>b[1]-a[1]).map(([genre,count])=>{
                      const style=getGenreStyle(genre);
                      return (
                        <div key={genre} style={{background:`linear-gradient(135deg,${style.c1}33,${style.c2}33)`,border:`1px solid ${style.c1}55`,borderRadius:20,padding:'4px 12px',fontSize:12,fontWeight:600,color:style.c1,display:'flex',alignItems:'center',gap:6,textTransform:'capitalize'}}>
                          {style.emoji} {genre} ({count})
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {likedTracks.length === 0 ? (
              <div style={{textAlign:'center',padding:'80px 0',color:'var(--text-subdued)'}}>
                <Heart size={64} style={{margin:'0 auto 16px',display:'block',opacity:0.3}}/>
                <h3 style={{color:'var(--text-base)',marginBottom:8}}>No liked songs yet</h3>
                <p>Click the ❤️ on any track to save it here</p>
              </div>
            ) : (
              <TrackList tracks={likedTracks} playTrack={playTrack} toggleLike={toggleLike} isLiked={isLiked} currentTrack={currentTrack} isPlaying={isPlaying} onShare={shareTrack}/>
            )}
          </>
        )}

        {/* Recently Played */}
        {tab === 'recent' && (
          recentTracks.length === 0 ? (
            <div style={{textAlign:'center',padding:'80px 0',color:'var(--text-subdued)'}}>
              <Clock size={64} style={{margin:'0 auto 16px',display:'block',opacity:0.3}}/>
              <h3 style={{color:'var(--text-base)',marginBottom:8}}>No history yet</h3>
              <p>Start playing tracks to see them here</p>
            </div>
          ) : (
            <TrackList tracks={recentTracks} playTrack={playTrack} toggleLike={toggleLike} isLiked={isLiked} currentTrack={currentTrack} isPlaying={isPlaying} onShare={shareTrack}/>
          )
        )}
      </div>
    </div>
  );
}