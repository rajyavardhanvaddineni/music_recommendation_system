import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:5000/api' });

export const getAllTracks = async (genre = null) => {
  if (genre) {
    const { data } = await api.get('/tracks', { params: { genre, limit: 100, page: 1 } });
    return data;
  }
  // Fetch all 1000 tracks across 10 genres
  const genres = ['blues','classical','country','disco','hiphop','jazz','metal','pop','reggae','rock'];
  const results = await Promise.all(
    genres.map(g => api.get('/tracks', { params: { genre: g, limit: 100, page: 1 } }).then(r => r.data.tracks))
  );
  return { tracks: results.flat() };
};

export const getRecommendations = async (mood, genres = [], n = 12) => {
  const { data } = await api.post('/recommend', { mood, genres, n });
  return data;
};

export const searchTracks = async (query) => {
  const { data } = await api.get('/search', { params: { q: query } });
  return data;
};

export const getGenres = async () => {
  const { data } = await api.get('/genres');
  return data;
};

export const getSimilar = async (trackId) => {
  const { data } = await api.get(`/similar/${trackId}`);
  return data;
};

export default api;
