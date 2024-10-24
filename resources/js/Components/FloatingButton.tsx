import React from 'react';

interface FloatingButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, icon }) => {
    return (
        <button
            onClick={onClick}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {icon}
        </button>
    );
};

export default FloatingButton;
