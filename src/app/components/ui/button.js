import React from 'react';

export const Button = ({ children, ...props }) => {
    return (
        <button {...props} className="bg-blue-500 text-white p-2 rounded">
            {children}
        </button>
    );
};
