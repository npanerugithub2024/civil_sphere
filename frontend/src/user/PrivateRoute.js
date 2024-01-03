

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    if (user === null) {
        // If user is null, we're still waiting for rehydration to complete
        return <div>Please Login To Continue.....</div>; // Or any other loading indicator
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
