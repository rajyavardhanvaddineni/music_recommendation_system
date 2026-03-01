import React, { useState, useEffect } from 'react';
import { Music, Clock, Heart, TrendingUp, Headphones, BarChart2, Activity, Award } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { getGenreStyle } from '../utils/helpers';

const API = 'http://127.0.0.1:5000/api';

export default function Dashboard({ playTrack, toggleLike, isLiked, likedTracks }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch(`${API}/user/history?token=${user.token}`)
      .then(r => r.json())
      .then(d => setHistory(d.tracks || []))
      .finally(() => setLoading(false));
  }, [user]);

  // ── Compute stats ────────────────────────────────────────────────────────
  const totalListened   = history.length;
  const totalMinutes    = Math.round(history.length * 0.5); // ~30s avg per GTZAN track
  const uniqueArtists   = new Set(history.map(t => t.artist)).size;
  const uniqueGenres    = new Set(history.map(t => t.genre)).size;

  // Genre breakdown
  const genreCounts = {};
  history.forEach(t => { genreCounts[t.genre] = (genreCounts[t.genre] || 0) + 1; });
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const topGenre = sortedGenres[0]?.[0] || 'None';

  // Mood breakdown
  const moodCounts = {};
  history.forEach(t => (t.mood || []).forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1; }));
  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Most played tracks
  const trackCounts = {};
  history.forEach(t => { trackCounts[t.id] = { track: t, count: (trackCounts[t.id]?.count || 0) + 1 }; });
  const topTracks = Object.values(trackCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  // Activity by genre (for bar chart)
  const maxGenreCount = sortedGenres[0]?.[1] || 1;

  // Energy profile
  const avgEnergy  = history.length ? (history.reduce((s, t) => s + (t.energy || 0), 0) / history.length).toFixed(2) : 0;
  const avgValence = history.length ? (history.reduce((s, t) => s + (t.valence || 0), 0) / history.length).toFixed(2) : 0;

  const MOOD_EMOJI = { happy:'😊', sad:'😢', energetic:'⚡', chill:'😌', angry:'😠', romantic:'❤️', party:'🎉', melancholic:'🌧️', hopeful:'🌟', peaceful:'🕊️' };

  if (!user) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
      <div style={{ fontSize:64 }}>📊</div>
      <h2 style={{ color:'var(--text-base)', fontSize:24, fontWeight:800 }}>Your Dashboard</h2>
      <p style={{ color:'var(--text-subdued)' }}>Log in to see your personalized listening stats</p>
    </div>
  );

  return (
    <div style={{ padding:'0 0 120px 0' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, var(--essential-bright)22, var(--bg-base))`, padding:'40px 32px 32px', marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:8 }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--essential-bright)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:900, color:'black' }}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize:32, fontWeight:900, color:'var(--text-base)', margin:0 }}>{user.username}'s Dashboard</h1>
            <p style={{ color:'var(--text-subdued)', margin:0 }}>{user.email}</p>
          </div>
        </div>
      </div>

      <div style={{ padding:'0 32px' }}>
        {/* Stat Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 }}>
          {[
            { icon:<Headphones size={22}/>, label:'Tracks Played', value:totalListened, color:'#1db954' },
            { icon:<Clock size={22}/>, label:'Minutes Listened', value:totalMinutes, color:'#00b4d8' },
            { icon:<Heart size={22}/>, label:'Liked Songs', value:likedTracks.length, color:'#e91429' },
            { icon:<Music size={22}/>, label:'Genres Explored', value:uniqueGenres, color:'#8b5cf6' },
          ].map(({ icon, label, value, color }) => (
            <div key={label} style={{ background:'var(--bg-highlight)', borderRadius:16, padding:24, border:`1px solid ${color}22` }}>
              <div style={{ color, marginBottom:12 }}>{icon}</div>
              <div style={{ fontSize:32, fontWeight:900, color:'var(--text-base)', marginBottom:4 }}>{value}</div>
              <div style={{ fontSize:13, color:'var(--text-subdued)' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:32 }}>
          {/* Genre Breakdown */}
          <div style={{ background:'var(--bg-highlight)', borderRadius:16, padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <BarChart2 size={18} style={{ color:'var(--essential-bright)' }} />
              <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'var(--text-base)' }}>Genre Breakdown</h3>
            </div>
            {sortedGenres.length === 0 ? (
              <p style={{ color:'var(--text-subdued)', fontSize:14 }}>Play some tracks to see your genre stats!</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {sortedGenres.slice(0, 6).map(([genre, count]) => {
                  const style = getGenreStyle(genre);
                  const pct = Math.round((count / maxGenreCount) * 100);
                  return (
                    <div key={genre}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                        <span style={{ fontSize:13, color:'var(--text-base)', textTransform:'capitalize', fontWeight:600 }}>
                          {style.emoji} {genre}
                        </span>
                        <span style={{ fontSize:13, color:'var(--text-subdued)' }}>{count} plays</span>
                      </div>
                      <div style={{ height:8, background:'var(--bg-elevated)', borderRadius:4, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${style.c1},${style.c2})`, borderRadius:4, transition:'width 0.8s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mood Profile */}
          <div style={{ background:'var(--bg-highlight)', borderRadius:16, padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <Activity size={18} style={{ color:'var(--essential-bright)' }} />
              <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'var(--text-base)' }}>Your Mood Profile</h3>
            </div>
            {sortedMoods.length === 0 ? (
              <p style={{ color:'var(--text-subdued)', fontSize:14 }}>Play some tracks to see your mood profile!</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {sortedMoods.map(([mood, count]) => (
                  <div key={mood} style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ fontSize:22, width:32 }}>{MOOD_EMOJI[mood] || '🎵'}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:13, color:'var(--text-base)', textTransform:'capitalize', fontWeight:600 }}>{mood}</span>
                        <span style={{ fontSize:13, color:'var(--text-subdued)' }}>{count}</span>
                      </div>
                      <div style={{ height:6, background:'var(--bg-elevated)', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${Math.round((count/(sortedMoods[0][1]))*100)}%`, background:'var(--essential-bright)', borderRadius:3 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:32 }}>
          {/* Top Tracks */}
          <div style={{ background:'var(--bg-highlight)', borderRadius:16, padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <TrendingUp size={18} style={{ color:'var(--essential-bright)' }} />
              <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'var(--text-base)' }}>Most Played</h3>
            </div>
            {topTracks.length === 0 ? (
              <p style={{ color:'var(--text-subdued)', fontSize:14 }}>Play some tracks to see your top songs!</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {topTracks.map(({ track, count }, idx) => {
                  const style = getGenreStyle(track.genre);
                  return (
                    <div key={track.id} style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer', padding:'6px 0' }}
                      onClick={() => playTrack(track, [track])}>
                      <span style={{ width:20, color:'var(--text-subdued)', fontSize:13, fontWeight:700 }}>{idx+1}</span>
                      <div style={{ width:36, height:36, borderRadius:8, background:`linear-gradient(135deg,${style.c1},${style.c2})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{style.emoji}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:'var(--text-base)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{track.title}</div>
                        <div style={{ fontSize:12, color:'var(--text-subdued)' }}>{track.artist}</div>
                      </div>
                      <span style={{ fontSize:12, color:'var(--essential-bright)', fontWeight:700, background:'var(--bg-elevated)', padding:'2px 8px', borderRadius:20 }}>{count}x</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Listening Personality */}
          <div style={{ background:'var(--bg-highlight)', borderRadius:16, padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <Award size={18} style={{ color:'var(--essential-bright)' }} />
              <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'var(--text-base)' }}>Listening Personality</h3>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[
                { label:'Energy Level', value:avgEnergy, color:'#ff6b35', desc: avgEnergy > 0.6 ? 'High Energy 🔥' : avgEnergy > 0.3 ? 'Balanced ⚖️' : 'Relaxed 😌' },
                { label:'Positivity', value:avgValence, color:'#1db954', desc: avgValence > 0.6 ? 'Upbeat 😊' : avgValence > 0.3 ? 'Neutral 😐' : 'Melancholic 🌧️' },
              ].map(({ label, value, color, desc }) => (
                <div key={label}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:13, color:'var(--text-base)', fontWeight:600 }}>{label}</span>
                    <span style={{ fontSize:13, color:'var(--text-subdued)' }}>{desc}</span>
                  </div>
                  <div style={{ height:10, background:'var(--bg-elevated)', borderRadius:5, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${value*100}%`, background:color, borderRadius:5, transition:'width 0.8s ease' }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop:8, padding:16, background:'var(--bg-elevated)', borderRadius:12, textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>
                  {totalListened === 0 ? '🎵' : avgEnergy > 0.6 && avgValence > 0.6 ? '🚀' : avgEnergy > 0.6 ? '⚡' : avgValence > 0.6 ? '😊' : avgEnergy < 0.3 ? '🧘' : '🎵'}
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:'var(--text-base)', marginBottom:4 }}>
                  {totalListened === 0 ? 'Start Listening!' : avgEnergy > 0.6 && avgValence > 0.6 ? 'Party Animal' : avgEnergy > 0.6 ? 'Intensity Seeker' : avgValence > 0.6 ? 'Happy Listener' : avgEnergy < 0.3 ? 'Zen Master' : 'Balanced Explorer'}
                </div>
                <div style={{ fontSize:12, color:'var(--text-subdued)' }}>
                  {totalListened === 0 ? 'Play tracks to discover your personality' : `Based on ${totalListened} tracks played`}
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:4 }}>
                <div style={{ background:'var(--bg-elevated)', borderRadius:10, padding:12, textAlign:'center' }}>
                  <div style={{ fontSize:18, fontWeight:900, color:'var(--essential-bright)' }}>{uniqueArtists}</div>
                  <div style={{ fontSize:11, color:'var(--text-subdued)' }}>Artists</div>
                </div>
                <div style={{ background:'var(--bg-elevated)', borderRadius:10, padding:12, textAlign:'center' }}>
                  <div style={{ fontSize:18, fontWeight:900, color:'var(--essential-bright)', textTransform:'capitalize' }}>{topGenre}</div>
                  <div style={{ fontSize:11, color:'var(--text-subdued)' }}>Fav Genre</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liked Songs */}
        {likedTracks.length > 0 && (
          <div style={{ background:'var(--bg-highlight)', borderRadius:16, padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <Heart size={18} style={{ color:'#e91429' }} />
              <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'var(--text-base)' }}>Liked Songs ({likedTracks.length})</h3>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
              {likedTracks.slice(0, 8).map(track => {
                const style = getGenreStyle(track.genre);
                return (
                  <div key={track.id} onClick={() => playTrack(track, likedTracks)}
                    style={{ background:'var(--bg-elevated)', borderRadius:12, padding:16, cursor:'pointer', transition:'transform 0.2s', display:'flex', alignItems:'center', gap:12 }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                    <div style={{ width:40, height:40, borderRadius:8, background:`linear-gradient(135deg,${style.c1},${style.c2})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{style.emoji}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--text-base)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{track.title}</div>
                      <div style={{ fontSize:12, color:'var(--text-subdued)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{track.artist}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}