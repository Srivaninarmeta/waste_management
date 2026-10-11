import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smartwaste_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('smartwaste_token');
      const storedUser = localStorage.getItem('smartwaste_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const response = await authService.getCurrentUser();
          setUser(response.data);
          localStorage.setItem('smartwaste_user', JSON.stringify(response.data));
        } catch (error) {
          console.warn('Session verification failed, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token: jwtToken, user: userData } = response.data;
    localStorage.setItem('smartwaste_token', jwtToken);
    localStorage.setItem('smartwaste_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const { token: jwtToken, user: newUserData } = response.data;
    localStorage.setItem('smartwaste_token', jwtToken);
    localStorage.setItem('smartwaste_user', JSON.stringify(newUserData));
    setToken(jwtToken);
    setUser(newUserData);
    return newUserData;
  };

  const logout = () => {
    localStorage.removeItem('smartwaste_token');
    localStorage.removeItem('smartwaste_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('smartwaste_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    role: user?.role,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
