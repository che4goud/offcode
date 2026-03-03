import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        localStorage.setItem('offcode_onboarded', 'true');
        navigate('/editor');
    };

    return (
        <div className="home-container" style={{
            minHeight: '100vh',
            background: 'var(--bg-main)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            padding: '2rem 1rem',
            overflowY: 'auto'
        }}>
            {/* Hero Section */}
            <section className="hero" style={{
                textAlign: 'center',
                padding: '4rem 0',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: '700',
                    color: 'var(--accent-primary)',
                    marginBottom: '1rem'
                }}>&lt;/&gt;</div>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '800',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>OffCode</h1>
                <p style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem'
                }}>Practice Blind 75 problems. Offline. Forever.</p>
                <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-tertiary)',
                    marginBottom: '3rem',
                    letterSpacing: '0.05em'
                }}>
                    76 Problems • Python & JS • 100% Offline • Free & Open Source
                </div>
                <button
                    onClick={handleStart}
                    className="btn"
                    style={{
                        fontSize: '1.25rem',
                        padding: '1rem 2.5rem',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                        transition: 'transform 0.2s, filter 0.2s'
                    }}
                >
                    Start Solving →
                </button>
            </section>

            {/* Installation Cards */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                maxWidth: '1100px',
                margin: '4rem auto'
            }}>
                <div className="panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📱</span> Install as App
                    </h3>
                    <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8' }}>
                        <li>• Visit in Chrome or Edge</li>
                        <li>• Click the install icon in your URL bar</li>
                        <li>• Or use Menu → Install App</li>
                        <li>• Works offline forever after first visit</li>
                    </ul>
                </div>
                <div className="panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>💻</span> Run Locally
                    </h3>
                    <code style={{
                        display: 'block',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-primary)',
                        lineHeight: '1.6'
                    }}>
                        git clone https://github.com/che4goud/offcode.git<br />
                        cd offcode && npm install<br />
                        npm run build<br />
                        npx serve dist
                    </code>
                </div>
                <div className="panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📦</span> Download & Run
                    </h3>
                    <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8' }}>
                        <li>• Download the latest release from GitHub</li>
                        <li>• Extract the ZIP</li>
                        <li>• Open index.html in your browser</li>
                    </ul>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '2rem',
                maxWidth: '1100px',
                margin: '4rem auto',
                padding: '4rem 2rem',
                borderTop: '1px solid var(--bg-panel-border)'
            }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>⚡</span>
                    <p style={{ color: 'var(--text-secondary)' }}>Run Python & JS in your browser — no server needed</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🔒</span>
                    <p style={{ color: 'var(--text-secondary)' }}>No accounts, no tracking, no data leaves your device</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>SAVE</span>
                    <p style={{ color: 'var(--text-secondary)' }}>Your code auto-saves locally between sessions</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📶</span>
                    <p style={{ color: 'var(--text-secondary)' }}>Works in airplane mode, trains, cafés — anywhere</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                padding: '4rem 0',
                borderTop: '1px solid var(--bg-panel-border)',
                color: 'var(--text-tertiary)',
                fontSize: '0.9rem'
            }}>
                <p style={{ marginBottom: '1rem' }}>Built with ❤️</p>
                <a
                    href="https://github.com/che4goud/offcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}
                >
                    View on GitHub
                </a>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
        .home-container .panel { transition: transform 0.3s ease, border-color 0.3s ease; }
        .home-container .panel:hover { transform: translateY(-5px); border-color: var(--accent-primary); }
        @media (max-width: 768px) {
          .hero h1 { font-size: 2.5rem; }
          .hero p { font-size: 1.2rem; }
        }
      `}} />
        </div>
    );
};

export default Home;
