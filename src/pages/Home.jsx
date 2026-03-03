import React from 'react';
import { useNavigate } from 'react-router-dom';
import MatrixRain from '../components/MatrixRain';
import FloatingParticles from '../components/FloatingParticles';

const Home = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        localStorage.setItem('offcode_onboarded', 'true');
        navigate('/editor');
    };

    return (
        <div className="home-wrapper" style={{
            position: 'relative',
            minHeight: '100vh',
            background: '#0B0E14',
            color: 'white',
            fontFamily: 'var(--font-sans)',
            overflowX: 'hidden'
        }}>
            {/* Background Layers */}
            <MatrixRain />
            <FloatingParticles />

            {/* UI Content Layer */}
            <div className="content-layer" style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4rem 1rem',
                minHeight: '100vh'
            }}>

                {/* Central Frosted Glass Card */}
                <div className="main-card" style={{
                    background: 'rgba(11, 14, 20, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(59, 130, 246, 0.15)',
                    borderRadius: '24px',
                    padding: '3.5rem 2rem',
                    textAlign: 'center',
                    maxWidth: '800px',
                    width: '100%',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                    marginBottom: '3rem'
                }}>
                    <div style={{
                        fontSize: '3.5rem',
                        color: '#3b82f6',
                        marginBottom: '1rem',
                        lineHeight: 1
                    }}>&lt;/&gt;</div>

                    <h1 style={{
                        fontSize: '4.5rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        color: 'white',
                        textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                    }}>OffCode</h1>

                    <p style={{
                        fontSize: '1.5rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '1.5rem',
                        fontWeight: '500'
                    }}>Practice Blind 75 problems offline. Load once, use forever.</p>

                    <div style={{
                        fontSize: '1rem',
                        color: '#3b82f6',
                        marginBottom: '2.5rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        76 Problems • Python & JS • 100% Offline
                    </div>

                    <button
                        onClick={handleStart}
                        className="start-btn"
                        style={{
                            fontSize: '1.25rem',
                            padding: '1.1rem 3rem',
                            background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                            marginBottom: '1rem'
                        }}
                    >
                        Start Solving →
                    </button>
                    <p style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.4)',
                        margin: 0
                    }}>Works on Chrome, Edge, Firefox & Safari • No account needed</p>
                </div>

                {/* Single PWA Info Banner */}
                <div style={{
                    background: 'rgba(11, 14, 20, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '1.25rem 2.5rem',
                    textAlign: 'center',
                    maxWidth: '800px',
                    width: '100%',
                    marginBottom: '4rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem'
                }}>
                    🌐 Just visit once — this app installs itself. Come back anytime, even without internet.
                </div>

                {/* 4 Feature Lines */}
                <div className="feature-lines" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '2.5rem',
                    marginBottom: '4rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1.1rem'
                }}>
                    <div className="feature-item"><span>⚡</span> Python & JS</div>
                    <div className="feature-item"><span>🔒</span> No tracking</div>
                    <div className="feature-item"><span>💾</span> Auto-saves</div>
                    <div className="feature-item"><span>📶</span> Airplane mode</div>
                </div>

                {/* Footer */}
                <footer style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.95rem'
                }}>
                    <p>Built with ❤️ • <a href="https://github.com/che4goud/offcode" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>GitHub</a></p>
                </footer>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .main-card {
                    animation: fadeInDown 0.8s ease-out;
                }
                .start-btn:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 15px 40px rgba(59, 130, 246, 0.6);
                    filter: brightness(1.1);
                }
                .info-card {
                    background: rgba(11, 14, 20, 0.5);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(59, 130, 246, 0.1);
                    border-radius: 20px;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                }
                .info-card:hover {
                    border-color: rgba(59, 130, 246, 0.5);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
                    transform: translateY(-5px);
                }
                .info-card h3 {
                    color: #3b82f6;
                    margin-bottom: 0.75rem;
                    font-size: 1.1rem;
                }
                .info-card p {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .feature-item span {
                    color: #3b82f6;
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 768px) {
                    .main-card h1 { font-size: 3rem; }
                    .main-card { padding: 2.5rem 1.5rem; }
                }
            `}} />
        </div>
    );
};

export default Home;
