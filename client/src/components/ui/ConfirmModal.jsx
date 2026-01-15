import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 4000
        }}>
            <div style={{
                backgroundColor: 'var(--bg-layer-2)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
                    <button onClick={onConfirm} className="btn btn-primary" style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
