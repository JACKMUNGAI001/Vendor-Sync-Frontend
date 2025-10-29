import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('https://vendor-sync-backend-4bre.onrender.com/login', {
                email,
                password
            });
            
            const userData = {
                token: response.data.token,
                email: response.data.user.email,
                role: response.data.user.role,
                firstName: response.data.user.first_name,
                lastName: response.data.user.last_name,
                id: response.data.user.id
            };
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setLoading(false);
            return { success: true, data: response.data };
        } catch (error) {
            setLoading(false);
            const message = error?.response?.data?.message || 'Login failed';
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await axios.post('https://vendor-sync-backend-4bre.onrender.com/register', userData);
            
            if (response.data.token) {
                const newUser = {
                    token: response.data.token,
                    email: response.data.user.email,
                    role: response.data.user.role,
                    firstName: response.data.user.first_name,
                    lastName: response.data.user.last_name,
                    id: response.data.user.id
                };
                
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
            }
            
            setLoading(false);
            return { success: true, data: response.data };
        } catch (error) {
            setLoading(false);
            const message = error?.response?.data?.message || 'Registration failed';
            return { success: false, error: message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const checkAuth = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;