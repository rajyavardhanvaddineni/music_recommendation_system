import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:5000/api';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('moodtune-user') || 'null'); } catch { return null; }
  });

  const register = async (username, email, password) => {
    const { data } = await axios.post(`${API}/auth/register`, { username, email, password });
    setUser(data);
    localStorage.setItem('moodtune-user', JSON.stringify(data));
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    setUser(data);
    localStorage.setItem('moodtune-user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('moodtune-user');
  };

  const updateTheme = async (theme) => {
    if (!user) return;
    await axios.post(`${API}/auth/theme`, { token: user.token, theme });
    const updated = { ...user, theme };
    setUser(updated);
    localStorage.setItem('moodtune-user', JSON.stringify(updated));
  };

  const likeTrack = async (track) => {
    if (!user) return;
    await axios.post(`${API}/user/likes`, { token: user.token, track });
  };

  const unlikeTrack = async (track) => {
    if (!user) return;
    await axios.delete(`${API}/user/likes`, { data: { token: user.token, track } });
  };

  const addHistory = async (track) => {
    if (!user) return;
    await axios.post(`${API}/user/history`, { token: user.token, track });
  };

  const getLikes = async () => {
    if (!user) return [];
    const { data } = await axios.get(`${API}/user/likes`, { params: { token: user.token } });
    return data.tracks || [];
  };

  const getHistory = async () => {
    if (!user) return [];
    const { data } = await axios.get(`${API}/user/history`, { params: { token: user.token } });
    return data.tracks || [];
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateTheme, likeTrack, unlikeTrack, addHistory, getLikes, getHistory }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);