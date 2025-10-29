import React, { createContext, useState, useContext } from 'react';
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
    const [loading, setLoading] = useState(false);

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
                lastName: response.data.user.last_name
            };
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setLoading(false);
            return { success: true, data: response.data };
        } catch (error) {
            setLoading(false);
            const message = error?.response?.data?.message || error.message || 'Login failed';
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
            setUser(JSON.parse(storedUser));
            return true;
        }
        return false;
    };

    const value = {
        user,
        login,
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