import React from 'react';

interface LoaderProps {
    scale?: number;
    className?: string;
    reverse?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ scale = 1, className = '', reverse = false }) => {
    return (
        <div
            className="loader-container"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center'
            }}
        >
            <div className="clouds">
                <div className="cloud cloud1"></div>
                <div className="cloud cloud2"></div>
                <div className="cloud cloud3"></div>
                <div className="cloud cloud4"></div>
                <div className="cloud cloud5"></div>
            </div>

            <div className={`loader ${className} ${reverse ? 'reverse' : ''}`}>
                <span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                <div className="base">
                    <span></span>
                    <div className="face"></div>
                </div>
            </div>

            <div className="longfazers">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default Loader;
