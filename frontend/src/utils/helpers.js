export const GENRE_COLORS = {
  blues: { c1: '#1565C0', c2: '#0D47A1', emoji: '🎸' },
  classical: { c1: '#6A1B9A', c2: '#4A148C', emoji: '🎻' },
  country: { c1: '#E65100', c2: '#BF360C', emoji: '🤠' },
  disco: { c1: '#F57F17', c2: '#E65100', emoji: '🪩' },
  hiphop: { c1: '#212121', c2: '#424242', emoji: '🎤' },
  jazz: { c1: '#1A237E', c2: '#283593', emoji: '🎷' },
  metal: { c1: '#424242', c2: '#212121', emoji: '🤘' },
  pop: { c1: '#880E4F', c2: '#AD1457', emoji: '⭐' },
  reggae: { c1: '#1B5E20', c2: '#2E7D32', emoji: '🌿' },
  rock: { c1: '#B71C1C', c2: '#C62828', emoji: '🎸' },
};

export const getGenreStyle = (genre) => {
  const g = GENRE_COLORS[genre] || { c1: '#1db954', c2: '#145a32', emoji: '🎵' };
  return g;
};

export const formatDuration = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const MOOD_SUGGESTIONS = [
  "I'm feeling happy and want to dance",
  "Sad and need something melancholic",
  "Need focus music for studying",
  "Pumped up for a workout",
  "Romantic evening vibes",
  "Chill Sunday morning",
  "Angry and want heavy music",
  "Feeling hopeful and motivated",
];
