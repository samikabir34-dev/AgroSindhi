import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from './Loader';

const LoadingScreen: React.FC = () => {
    const location = useLocation();
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
        const timer = setTimeout(() => {
            setShow(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [location]);

    if (!show) return null;

    return (
        <div className="loading-overlay">
            <Loader />
        </div>
    );
};

export default LoadingScreen;
