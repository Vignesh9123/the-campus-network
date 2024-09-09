import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

function PrivateRoute() {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsReady(true);
        }
    }, [isLoading]);

    if (!isReady) {
        return <Loader/>; // or a loading spinner
    }

    if (!user) {
        // Redirect to login, but save the current location
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;
