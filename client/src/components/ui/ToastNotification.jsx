import React, { useEffect } from 'react';

const ToastNotification = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bg = type === 'success' ? '#10B981' : '#EF4444'; // Green or Red

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: bg,
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 3000,
            animation: 'slideIn 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            {message}
        </div>
    );
};

export default ToastNotification;
