// ToastMessage.tsx
import React, { useState, useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const ToastMessage: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Mesaj 5 saniye sonra kaybolacak
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`toast-message ${type}`}
            style={{
                position: 'fixed',
                top: 20,
                right: 20,
                padding: '10px 20px',
                borderRadius: '5px',
                backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
                color: '#fff',
                zIndex: 1000,
            }}
        >
            {message}
        </div>
    );
};

export default ToastMessage;
