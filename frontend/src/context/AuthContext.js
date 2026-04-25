import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('herwall_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('herwall_token', data.token);
    localStorage.setItem('herwall_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await API.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('herwall_token', data.token);
    localStorage.setItem('herwall_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('herwall_token');
    localStorage.removeItem('herwall_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = ['admin', 'moderator'].includes(user?.role);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
