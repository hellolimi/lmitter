import React, { useEffect, useState } from 'react';

function LoadingBar({loadingOn}) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => { setLoading(true); }
    }, [loadingOn]);

    return (
        <>
            {loading&&<div className="loading">
                <svg>
                    <defs>
                        <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#ff7bac"/>
                        <stop offset="100%" stopColor="#06a3c4"/>
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="10" stroke="url(#linear)" />
                </svg>
            </div>}
        </>
    );
}

export default LoadingBar;