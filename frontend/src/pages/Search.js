import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Filter, X, Share2, Download } from 'lucide-react';
import TrackList from '../components/TrackList';
import { getAllTracks, searchTracks } from '../utils/api';
import { getGenreStyle } from '../utils/helpers';

const GENRES = ['blues','classical','country','disco','hiphop','jazz','metal','pop','reggae','rock'];
const MOODS  = ['happy','sad','energetic','chill','angry','romantic','party','melancholic','hopeful','peaceful'];

export default function Search({ playTrack, toggleLike, isLiked, currentTrack, isPlaying }) {
  const [query, setQuery]             = useState('');
  const [results, setResults]         = useState([]);
  const [allTracks, setAllTracks]     = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [shareMsg, setShareMsg]       = useState('');

  // Filters
  const [selectedMoods, setSelectedMoods]   = useState([]);
  const [energyRange, setEnergyRange]       = useState([0, 1]);
  const [tempoRange, setTempoRange]         = useState([60, 220]);
  const [valenceRange, setValenceRange]     = useState([0, 1]);

  useEffect(() => {
    getAllTracks().then(d => setAllTracks(d.tracks || []));
  }, []);

  const applyFilters = useCallback((tracks) => {
    return tracks.filter(t => {
      const moodOk    = selectedMoods.length === 0 || selectedMoods.some(m => (t.mood||[]).includes(m));
      const energyOk  = (t.energy||0) >= energyRange[0] && (t.energy||0) <= energyRange[1];
      const tempoOk   = (t.tempo||0) >= tempoRange[0]   && (t.tempo||0) <= tempoRange[1];
      const valenceOk = (t.valence||0) >= valenceRange[0] && (t.valence||0) <= valenceRange[1];
      return moodOk && energyOk && tempoOk && valenceOk;
    });
  }, [selectedMoods, energyRange, tempoRange, valenceRange]);

  // Search
  useEffect(() => {
    if (!query.trim() && !selectedGenre) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        let tracks = [];
        if (query.trim()) {
          const data = await searchTracks(query);
          tracks = data.tracks || [];
        } else if (selectedGenre) {
          tracks = allTracks.filter(t => t.genre === selectedGenre);
        }
        setResults(applyFilters(tracks));
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedGenre, allTracks, applyFilters]);

  // Genre click - show filtered
  const handleGenreClick = (genre) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
    setQuery('');
  };

  const toggleMood = (m) => setSelectedMoods(prev => prev.includes(m) ? prev.filter(x=>x!==m) : [...prev, m]);

  const resetFilters = () => {
    setSelectedMoods([]); setEnergyRange([0,1]); setTempoRange([60,220]); setValenceRange([0,1]);
  };

  const hasFilters = selectedMoods.length > 0 || energyRange[0] > 0 || energyRange[1] < 1 || tempoRange[0] > 60 || tempoRange[1] < 220 || valenceRange[0] > 0 || valenceRange[1] < 1;

  // Share a track
  const shareTrack = (track) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(track.title + ' ' + track.artist)}`;
    navigator.clipboard.writeText(`🎵 Listen to "${track.title}" by ${track.artist} on MoodTune!\n${url}`);
    setShareMsg(`Copied link for "${track.title}"!`);
    setTimeout(() => setShareMsg(''), 3000);
  };

  const displayTracks = (results.length > 0 || query || selectedGenre) ? results : applyFilters(allTracks.slice(0, 50));

  return (
    <div className="search-page">
      <div className="page-header-gradient" style={{'--header-color':'#1db954'}}>
        <h1 style={{fontSize:36,fontWeight:900}}>Search</h1>
      </div>

      <div className="page-content">
        {/* Search Bar */}
        <div style={{position:'relative',marginBottom:16}}>
          <SearchIcon size={18} style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',color:'var(--text-subdued)'}}/>
          <input
            style={{width:'100%',padding:'14px 50px 14px 48px',background:'var(--bg-highlight)',border:'none',borderRadius:12,color:'var(--text-base)',fontSize:15,outline:'none',boxSizing:'border-box'}}
            placeholder="Search songs, artists, genres..."
            value={query}
            onChange={e=>{setQuery(e.target.value);setSelectedGenre(null);}}
          />
          {query && (
            <button onClick={()=>setQuery('')} style={{position:'absolute',right:50,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--text-subdued)',cursor:'pointer'}}>
              <X size={16}/>
            </button>
          )}
          <button onClick={()=>setShowFilters(!showFilters)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:hasFilters?'var(--essential-bright)':'none',border:'none',color:hasFilters?'black':'var(--text-subdued)',cursor:'pointer',borderRadius:6,padding:4}}>
            <Filter size={18}/>
          </button>
        </div>

        {/* Share Toast */}
        {shareMsg && (
          <div style={{background:'var(--essential-bright)',color:'black',padding:'10px 20px',borderRadius:10,marginBottom:16,fontWeight:700,fontSize:14,textAlign:'center'}}>
            ✅ {shareMsg}
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <div style={{background:'var(--bg-highlight)',borderRadius:16,padding:24,marginBottom:24,border:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{margin:0,fontSize:16,fontWeight:700,color:'var(--text-base)'}}>🎛️ Advanced Filters</h3>
              {hasFilters && <button onClick={resetFilters} style={{background:'none',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,color:'var(--text-subdued)',padding:'4px 12px',cursor:'pointer',fontSize:13}}>Reset</button>}
            </div>

            {/* Mood filter */}
            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,color:'var(--text-subdued)',display:'block',marginBottom:10,fontWeight:600}}>MOOD</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {MOODS.map(m=>(
                  <button key={m} onClick={()=>toggleMood(m)} style={{padding:'5px 12px',borderRadius:20,fontSize:12,fontWeight:600,border:'1px solid',cursor:'pointer',textTransform:'capitalize',
                    background:selectedMoods.includes(m)?'var(--essential-bright)':'transparent',
                    borderColor:selectedMoods.includes(m)?'var(--essential-bright)':'rgba(255,255,255,0.2)',
                    color:selectedMoods.includes(m)?'black':'var(--text-subdued)'}}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            {[
              {label:'ENERGY', range:energyRange, setRange:setEnergyRange, min:0, max:1, step:0.05, fmt:v=>`${Math.round(v*100)}%`},
              {label:'TEMPO (BPM)', range:tempoRange, setRange:setTempoRange, min:60, max:220, step:1, fmt:v=>`${v}`},
              {label:'POSITIVITY', range:valenceRange, setRange:setValenceRange, min:0, max:1, step:0.05, fmt:v=>`${Math.round(v*100)}%`},
            ].map(({label,range,setRange,min,max,step,fmt})=>(
              <div key={label} style={{marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <label style={{fontSize:13,color:'var(--text-subdued)',fontWeight:600}}>{label}</label>
                  <span style={{fontSize:13,color:'var(--text-base)'}}>{fmt(range[0])} – {fmt(range[1])}</span>
                </div>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <input type="range" min={min} max={max} step={step} value={range[0]}
                    onChange={e=>setRange([parseFloat(e.target.value),range[1]])}
                    style={{flex:1,accentColor:'var(--essential-bright)'}}/>
                  <input type="range" min={min} max={max} step={step} value={range[1]}
                    onChange={e=>setRange([range[0],parseFloat(e.target.value)])}
                    style={{flex:1,accentColor:'var(--essential-bright)'}}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Genre Grid */}
        {!query && (
          <div style={{marginBottom:32}}>
            <div className="section-title">Browse by Genre</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
              {GENRES.map(genre=>{
                const style=getGenreStyle(genre);
                const active=selectedGenre===genre;
                return (
                  <div key={genre} onClick={()=>handleGenreClick(genre)} style={{
                    background:`linear-gradient(135deg,${style.c1},${style.c2})`,
                    borderRadius:12,padding:'20px 16px',cursor:'pointer',
                    border:active?'2px solid white':'2px solid transparent',
                    transform:active?'scale(1.03)':'scale(1)',transition:'all 0.2s',
                    display:'flex',flexDirection:'column',alignItems:'flex-start',gap:6
                  }}>
                    <span style={{fontSize:28}}>{style.emoji}</span>
                    <span style={{color:'white',fontWeight:800,fontSize:14,textTransform:'capitalize'}}>{genre}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          {selectedGenre && !query && (
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <div className="section-title" style={{margin:0}}>{selectedGenre.charAt(0).toUpperCase()+selectedGenre.slice(1)} Tracks ({displayTracks.length})</div>
              <button onClick={()=>setSelectedGenre(null)} style={{background:'none',border:'none',color:'var(--text-subdued)',cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontSize:14}}>
                <X size={14}/> Back
              </button>
            </div>
          )}
          {query && <div className="section-title">Results for "{query}" ({displayTracks.length})</div>}
          {hasFilters && !query && !selectedGenre && <div className="section-title">Filtered Tracks ({displayTracks.length})</div>}

          {loading ? (
            <div className="loading-wrap"><div className="spinner"/></div>
          ) : displayTracks.length > 0 ? (
            <TrackList
              tracks={displayTracks}
              playTrack={playTrack}
              toggleLike={toggleLike}
              isLiked={isLiked}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onShare={shareTrack}
            />
          ) : (query || selectedGenre || hasFilters) ? (
            <div style={{textAlign:'center',padding:'60px 0',color:'var(--text-subdued)'}}>
              <div style={{fontSize:48,marginBottom:16}}>🔍</div>
              <p>No tracks found. Try different filters!</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}