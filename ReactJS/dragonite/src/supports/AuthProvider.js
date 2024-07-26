import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token : localStorage.getItem('token') || null,
        isAuthenticated : !!localStorage.getItem('token')
    });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuth({ 
                token: token, 
                isAuthenticated: true 
            });
        } 
        setLoading(false);
    }, []);

    useEffect(() => {
        if(!loading && !auth.isAuthenticated){
        // navigate('/login');
        }
    }, [loading, auth.isAuthenticated, navigate]);


    const login = (token) => {
        localStorage.setItem('token', token);
        setAuth({ 
            token: token, 
            isAuthenticated: true 
        });
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ 
            token: null,
            isAuthenticated: false 
        });
        navigate('/login');
    };

    if(loading) {
        return (
            <div>
                <p>Đang tải nội dung...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
