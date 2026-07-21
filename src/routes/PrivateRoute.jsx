import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ( {children}) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <span className="loading loading-ring loading-xl"></span>
        // Show a loading indicator while checking authentication
    }

    if (!user) {
        // Redirect to login page if not authenticated
        return <Navigate state={location.pathname} to="/login" replace />;
    }

    return children; // Render the protected component if authenticated
};

export default PrivateRoute;