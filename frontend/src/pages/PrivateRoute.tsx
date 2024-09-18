import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

function PrivateRoute() {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    const [isReady, setIsReady] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (!isLoading) {
            setIsReady(true);
            if(user && (!user.college || !user.engineeringDomain)){
                navigate('/add-personal-details');
            }
        }
    }, [isLoading]);

    if (!isReady) {
        return <Loader/>; // or a loading spinner
    }

    if (!user) {
        // Redirect to login, but save the current location
        return <Navigate to='/login' state={{ from: location }} replace />;
    }
    // if(!user.engineeringDomain || !user.college){
    //     return <Navigate to='/add-personal-details' state={{ from: location }} replace />;
    // }

    return <Outlet />;
}

export default PrivateRoute;
