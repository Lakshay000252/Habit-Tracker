import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

const REQUEST_TIMEOUT = 20000;

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
  });
  return { result: Promise.race([promise, timeout]).finally(() => clearTimeout(timer)), cancel: () => clearTimeout(timer) };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('habitai_token');
    const storedUser = localStorage.getItem('habitai_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearAuthStorage();
      }
    }
    setLoading(false);
  }, []);

  function clearAuthStorage() {
    localStorage.removeItem('habitai_token');
    localStorage.removeItem('habitai_refresh');
    localStorage.removeItem('habitai_user');
  }

  const handleAuthResponse = (res) => {
    const body = res.data;
    if (!body || !body.success) {
      throw new Error(body?.message || 'Authentication failed');
    }
    const payload = body.data || body;
    const userData = payload.user || payload;
    const token = payload.token;
    if (!token) throw new Error('No token received from server');
    localStorage.setItem('habitai_token', token);
    if (payload.refreshToken) localStorage.setItem('habitai_refresh', payload.refreshToken);
    localStorage.setItem('habitai_user', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  };

  const login = async (email, password) => {
    try {
      console.log('[AuthContext] login started');
      const { result } = withTimeout(authAPI.login({ email, password }), REQUEST_TIMEOUT);
      const res = await result;
      console.log('[AuthContext] login response received');
      return handleAuthResponse(res);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Login failed';
      console.log('[AuthContext] login error:', msg);
      return { success: false, error: msg };
    }
  };

  const signup = async (name, email, password) => {
    try {
      console.log('[AuthContext] signup started');
      const { result } = withTimeout(authAPI.register({ name, email, password }), REQUEST_TIMEOUT);
      const res = await result;
      console.log('[AuthContext] signup response received');
      return handleAuthResponse(res);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Registration failed';
      console.log('[AuthContext] signup error:', msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (data) => {
    try {
      const res = await userAPI.updateProfile(data);
      const body = res.data;
      const updated = body.data || body;
      localStorage.setItem('habitai_user', JSON.stringify(updated));
      setUser(updated);
      return { success: true };
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Update failed';
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
