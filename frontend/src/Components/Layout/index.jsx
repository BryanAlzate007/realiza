import React from 'react';

const Layout = ({ children, className = "" }) => {
    return (
        <div className={`min-h-screen w-full ${className}`}>
            {children}
        </div>
    )
}

export default Layout