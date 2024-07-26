import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ children }) => {
    const { auth } = useAuth();

    //return auth.token ? children : <Navigate to="/login" />;
    if(!auth.isAuthenticated){
        return <Navigate to="/welcome" />;
    }

    else return children;
};

export default PrivateRoute;
