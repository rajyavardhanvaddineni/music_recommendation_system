import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, ExternalLink } from 'lucide-react';
import { getGenreStyle } from '../utils/helpers';
import Visualizer from './Visualizer';
export default function Player({ currentTrack, isPlaying, setIsPlaying, onNext, onPrev, toggleLike, isLiked }) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  useEffect(() => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    fetch(`http://127.0.0.1:5000/api/audio-url/${currentTrack.genre}`).then(r=>r.json()).then(data => {
      if (data.url) { audio.src=`http://127.0.0.1:5000${data.url}`; audio.load(); audio.play().catch(()=>{}); setIsPlaying(true); }
    });
    setProgress(0); setCurrentTime(0);
  }, [currentTrack]);
  useEffect(() => { const a=audioRef.current; if(!a||!a.src) return; isPlaying?a.play().catch(()=>{}):a.pause(); }, [isPlaying]);
  useEffect(() => { if(audioRef.current) audioRef.current.volume=volume; }, [volume]);
  const fmt = s => (!s||isNaN(s)) ? '0:00' : `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
  const genre = currentTrack?.genre||'pop';
  const style = getGenreStyle(genre);
  return (
    <div className="player">
      <audio ref={audioRef}
        onTimeUpdate={()=>{const a=audioRef.current;setCurrentTime(a.currentTime);setProgress((a.currentTime/a.duration)*100||0);}}
        onLoadedMetadata={()=>setDuration(audioRef.current?.duration||0)}
        onEnded={()=>{setIsPlaying(false);onNext();}}/>
      {!currentTrack ? <p style={{color:'var(--text-subdued)',margin:'auto'}}>Select a track to start listening</p> : (<>
        <div className="player-left">
          <div className="player-art" style={{'--c1':style.c1,'--c2':style.c2}}>{style.emoji}</div>
          <div className="player-info"><h4>{currentTrack.title}</h4><p>{currentTrack.artist}</p></div>
          <button className={`icon-btn ${isLiked(currentTrack.id)?'liked':''}`} onClick={()=>toggleLike(currentTrack)}><Heart size={18} fill={isLiked(currentTrack.id)?'currentColor':'none'}/></button>
          {currentTrack.streaming&&<a href={currentTrack.streaming.spotify} target="_blank" rel="noreferrer" className="icon-btn"><ExternalLink size={16}/></a>}
        </div>
        <div className="player-center">
          <div className="player-controls">
            <button className="ctrl-btn"><Shuffle size={18}/></button>
            <button className="ctrl-btn" onClick={onPrev}><SkipBack size={22}/></button>
            <button className="play-btn" onClick={()=>setIsPlaying(!isPlaying)}>{isPlaying?<Pause size={18}/>:<Play size={18}/>}</button>
            <button className="ctrl-btn" onClick={onNext}><SkipForward size={22}/></button>
            <button className="ctrl-btn"><Repeat size={18}/></button>
          </div>
          <div className="progress-bar-wrap">
            <span className="progress-time">{fmt(currentTime)}</span>
            <div className="progress-bar" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();audioRef.current.currentTime=((e.clientX-r.left)/r.width)*audioRef.current.duration;}}>
              <div className="progress-fill" style={{width:`${progress}%`}}/>
            </div>
            <span className="progress-time right">{fmt(duration)}</span>
          </div>
        </div>
        <div className="player-right">
          <Visualizer isPlaying={isPlaying} genre={genre}/>
          <button className="ctrl-btn" style={{marginLeft:8}}><Volume2 size={18}/></button>
          <div className="volume-bar" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setVolume(Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)));}}>
            <div className="volume-fill" style={{width:`${volume*100}%`}}/>
          </div>
        </div>
      </>)}
    </div>
  );
}
