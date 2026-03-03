import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    if (!needRefresh) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--accent-primary)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem'
        }}>
            <span>A new version is available!</span>
            <button
                onClick={() => updateServiceWorker(true)}
                style={{
                    background: 'white',
                    color: 'var(--accent-primary)',
                    border: 'none',
                    padding: '0.4rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                }}
            >
                Update Now
            </button>
        </div>
    );
}
