import React from 'react';

export const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white border border-gray-300 rounded-lg shadow-md p-4 ${className}`}>
            {children}
        </div>
    );
};

export const CardContent = ({ children }) => {
    return (
        <div className="p-4">
            {children}
        </div>
    );
};
