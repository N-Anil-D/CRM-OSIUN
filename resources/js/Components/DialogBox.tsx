import React from 'react';

interface DialogBoxProps {
    isOpen: boolean;
    title: string;
    content: string;
    onClose: () => void;
}

const DialogBox: React.FC<DialogBoxProps> = ({ isOpen, title, content, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <p>{content}</p>
                <div className="mt-4 flex justify-end">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={onClose}
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DialogBox;
