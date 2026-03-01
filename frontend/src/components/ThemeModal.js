import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useTheme, THEMES } from '../utils/ThemeContext';
import { useAuth } from '../utils/AuthContext';

export default function ThemeModal({ onClose }) {
  const { theme, setTheme, setCustomColors } = useTheme();
  const { user, updateTheme } = useAuth();
  const [customMode, setCustomMode] = useState(false);
  const [custom, setCustom] = useState({
    '--bg-base': '#121212',
    '--bg-elevated': '#1a1a1a',
    '--bg-highlight': '#282828',
    '--bg-press': '#000000',
    '--text-base': '#ffffff',
    '--text-subdued': '#b3b3b3',
    '--essential-bright': '#1db954',
    '--card-hover': '#3e3e3e',
    '--nav-bg': '#000000',
  });

  const selectTheme = async (key) => {
    setTheme(key);
    setCustomColors(null);
    localStorage.removeItem('moodtune-custom');
    if (user) await updateTheme(key);
  };

  const applyCustom = () => {
    setCustomColors(custom);
    localStorage.setItem('moodtune-custom', JSON.stringify(custom));
    setTheme('custom');
  };

  const colorFields = [
    { key: '--bg-base', label: 'Background' },
    { key: '--bg-highlight', label: 'Cards' },
    { key: '--text-base', label: 'Text' },
    { key: '--text-subdued', label: 'Subtle Text' },
    { key: '--essential-bright', label: 'Accent Color' },
    { key: '--nav-bg', label: 'Sidebar' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        background: 'var(--bg-highlight)', borderRadius: 16, padding: 40,
        width: 520, maxHeight: '85vh', overflowY: 'auto',
        position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'none',
          border: 'none', color: 'var(--text-subdued)', cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: 'var(--text-base)' }}>
          🎨 Choose Theme
        </h2>
        <p style={{ color: 'var(--text-subdued)', fontSize: 14, marginBottom: 24 }}>
          Pick a preset or create your own custom theme
        </p>

        {/* Preset Themes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {Object.entries(THEMES).map(([key, t]) => (
            <div
              key={key}
              onClick={() => selectTheme(key)}
              style={{
                padding: '16px', borderRadius: 12, cursor: 'pointer',
                background: t['--bg-base'],
                border: `2px solid ${theme === key ? t['--essential-bright'] : 'rgba(255,255,255,0.1)'}`,
                transition: 'all 0.2s', position: 'relative',
              }}
            >
              {theme === key && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 20, height: 20, borderRadius: '50%',
                  background: t['--essential-bright'],
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Check size={12} color="black" />
                </div>
              )}
              <div style={{ fontSize: 28, marginBottom: 8 }}>{t.emoji}</div>
              <div style={{ color: t['--text-base'], fontWeight: 700, fontSize: 14 }}>{t.name}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {[t['--bg-highlight'], t['--essential-bright'], t['--text-subdued']].map((c, i) => (
                  <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Theme */}
        <div style={{
          border: `2px solid ${customMode ? 'var(--essential-bright)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 12, padding: 20,
        }}>
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: customMode ? 20 : 0 }}
            onClick={() => setCustomMode(!customMode)}
          >
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-base)', fontSize: 15 }}>🎛️ Custom Theme</div>
              <div style={{ color: 'var(--text-subdued)', fontSize: 13 }}>Pick your own colors</div>
            </div>
            <span style={{ color: 'var(--text-subdued)', fontSize: 20 }}>{customMode ? '▲' : '▼'}</span>
          </div>

          {customMode && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {colorFields.map(({ key, label }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, color: 'var(--text-subdued)', display: 'block', marginBottom: 6 }}>
                      {label}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="color"
                        value={custom[key]}
                        onChange={e => setCustom({ ...custom, [key]: e.target.value })}
                        style={{ width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }}
                      />
                      <span style={{ fontSize: 13, color: 'var(--text-subdued)', fontFamily: 'monospace' }}>
                        {custom[key]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={applyCustom}
                style={{
                  marginTop: 20, width: '100%', padding: '12px',
                  background: 'var(--essential-bright)', border: 'none',
                  borderRadius: 30, color: 'black', fontWeight: 800,
                  cursor: 'pointer', fontSize: 14
                }}
              >
                Apply Custom Theme
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}