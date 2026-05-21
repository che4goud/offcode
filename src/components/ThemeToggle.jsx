import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

function getInitialTheme() {
    const saved = localStorage.getItem('offcode_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
        localStorage.setItem('offcode_theme', theme);
    }, [theme]);

    const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggle}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.7rem',
                background: 'var(--bg-panel)',
                border: '1px solid var(--bg-panel-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
    );
}
