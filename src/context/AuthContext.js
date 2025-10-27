import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password, role) => {
    try {
      const payload = role ? { email, password, role } : { email, password };
      const response = await axios.post('http://localhost:5000/login', payload);
      setUser({ token: response.data.token, role: response.data.role });
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};