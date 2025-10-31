import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    console.log('AuthContext: login function called.');
    try {
      console.log('AuthContext: Making API call to /api/login...');
      const response = await api.post("/api/login", { email, password });
      console.log('AuthContext: API call successful. Response:', response.data);
      const { token, user: userData } = response.data;
      const userWithToken = { ...userData, token };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      setUser(userWithToken);
      console.log('AuthContext: User set, returning success.');
      return { success: true };
    } catch (error) {
      console.error('AuthContext: API call failed. Error:', error);
      const errorMessage = error.response?.data?.message || "Invalid credentials or server error";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (data) => {
    try {
      await api.post("/api/register", data);
      navigate("/login");
    } catch (error) {
      alert("Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
