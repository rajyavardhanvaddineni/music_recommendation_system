import React, { createContext, useContext, useState, useEffect } from 'react';
export const THEMES = {
  dark: { name:'Dark', emoji:'🌑', '--bg-base':'#121212','--bg-elevated':'#1a1a1a','--bg-highlight':'#282828','--bg-press':'#000000','--text-base':'#ffffff','--text-subdued':'#b3b3b3','--essential-bright':'#1db954','--card-hover':'#3e3e3e','--nav-bg':'#000000'},
  light: { name:'Light', emoji:'☀️', '--bg-base':'#ffffff','--bg-elevated':'#f5f5f5','--bg-highlight':'#e8e8e8','--bg-press':'#d0d0d0','--text-base':'#000000','--text-subdued':'#555555','--essential-bright':'#1db954','--card-hover':'#d5d5d5','--nav-bg':'#f0f0f0'},
  purple: { name:'Purple Neon', emoji:'🟣', '--bg-base':'#0d0d1a','--bg-elevated':'#13132a','--bg-highlight':'#1e1e3a','--bg-press':'#080810','--text-base':'#ffffff','--text-subdued':'#a78bfa','--essential-bright':'#8b5cf6','--card-hover':'#2a2a50','--nav-bg':'#080810'},
  sunset: { name:'Sunset', emoji:'🌅', '--bg-base':'#1a0a0a','--bg-elevated':'#2a1010','--bg-highlight':'#3a1818','--bg-press':'#0d0505','--text-base':'#fff0e0','--text-subdued':'#ffb366','--essential-bright':'#ff6b35','--card-hover':'#4a2020','--nav-bg':'#0d0505'},
  ocean: { name:'Ocean', emoji:'🌊', '--bg-base':'#0a1628','--bg-elevated':'#0f1f3a','--bg-highlight':'#162840','--bg-press':'#060e1a','--text-base':'#e0f0ff','--text-subdued':'#7ab8f5','--essential-bright':'#00b4d8','--card-hover':'#1e3050','--nav-bg':'#060e1a'},
  forest: { name:'Forest', emoji:'🌲', '--bg-base':'#0a1a0a','--bg-elevated':'#102010','--bg-highlight':'#162816','--bg-press':'#060e06','--text-base':'#e0ffe0','--text-subdued':'#7abf7a','--essential-bright':'#2d9e2d','--card-hover':'#1e3a1e','--nav-bg':'#060e06'},
};
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('moodtune-theme') || 'dark');
  const [customColors, setCustomColors] = useState(() => { try { return JSON.parse(localStorage.getItem('moodtune-custom') || 'null'); } catch { return null; } });
  useEffect(() => {
    const t = customColors || THEMES[theme] || THEMES.dark;
    Object.entries(t).forEach(([key, val]) => { if (key.startsWith('--')) document.documentElement.style.setProperty(key, val); });
    localStorage.setItem('moodtune-theme', theme);
  }, [theme, customColors]);
  return <ThemeContext.Provider value={{ theme, setTheme, customColors, setCustomColors }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
