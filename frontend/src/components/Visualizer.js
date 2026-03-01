import React, { useEffect, useRef } from 'react';
export default function Visualizer({ isPlaying, genre }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const barsRef = useRef(Array.from({ length: 32 }, () => Math.random()));
  const COLORS = { blues:['#1565C0','#42A5F5'], classical:['#6A1B9A','#CE93D8'], country:['#E65100','#FFCC80'], disco:['#F57F17','#FFF176'], hiphop:['#424242','#90A4AE'], jazz:['#1A237E','#7986CB'], metal:['#424242','#BDBDBD'], pop:['#880E4F','#F48FB1'], reggae:['#1B5E20','#A5D6A7'], rock:['#B71C1C','#EF9A9A'] };
  const colors = COLORS[genre] || ['#1db954','#1ed760'];
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const bars = barsRef.current;
    const barW = W / bars.length - 2;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      bars.forEach((h, i) => {
        bars[i] += ((isPlaying ? 0.2 + Math.random() * 0.8 : 0.05) - bars[i]) * 0.15;
        const barH = bars[i] * H, x = i * (barW + 2), y = H - barH;
        const grad = ctx.createLinearGradient(0, y, 0, H);
        grad.addColorStop(0, colors[0]); grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(x, y, barW, barH, 2); ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, genre]);
  return <canvas ref={canvasRef} width={200} height={40} style={{ borderRadius: 4, opacity: isPlaying ? 1 : 0.4, transition: 'opacity 0.3s' }} />;
}
