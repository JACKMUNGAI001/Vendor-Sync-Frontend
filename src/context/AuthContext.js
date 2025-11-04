import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      const userWithToken = { ...userData, token };
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      setUser(userWithToken);
      
      return { success: true, user: userWithToken };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || "Invalid credentials";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, data);
      
      const { token, user: userData } = response.data;
      const userWithToken = { ...userData, token };
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      setUser(userWithToken);
      
      return { success: true, user: userWithToken };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || "Registration failed";
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};