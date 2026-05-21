import React, { useState } from 'react';
import { FileText, Lightbulb, Code2 } from 'lucide-react';

const DIFF_COLOR = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };
const DIFF_BG = { Easy: 'rgba(16,185,129,0.15)', Medium: 'rgba(245,158,11,0.15)', Hard: 'rgba(239,68,68,0.15)' };

export default function ProblemPanel({ problem, language }) {
    const [tab, setTab] = useState('description');
    const [revealedHints, setRevealedHints] = useState(0);
    const [showSolution, setShowSolution] = useState(false);

    // Reset hint/solution state when problem changes
    React.useEffect(() => {
        setTab('description');
        setRevealedHints(0);
        setShowSolution(false);
    }, [problem?.id]);

    if (!problem) return null;

    const hints = problem.hints || [];
    const solution = problem.optimalSolution?.[language] || problem.optimalSolution?.python || '';

    const tabs = [
        { id: 'description', label: 'Description', icon: FileText },
        { id: 'hints', label: 'Hints', icon: Lightbulb },
        { id: 'solution', label: 'Solution', icon: Code2 },
    ];

    return (
        <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Tab bar */}
            <div style={{
                display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)',
                padding: '0 1rem', flexShrink: 0,
            }}>
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.65rem 0.9rem', background: 'none', border: 'none',
                            cursor: 'pointer', fontSize: '0.83rem', fontFamily: 'var(--font-sans)',
                            color: tab === id ? 'white' : 'rgba(255,255,255,0.45)',
                            borderBottom: tab === id ? '2px solid #3b82f6' : '2px solid transparent',
                            marginBottom: '-1px', transition: 'color 0.15s',
                        }}
                    >
                        <Icon size={14} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="panel-content" style={{ flex: 1, overflowY: 'auto' }}>
                {tab === 'description' && (
                    <>
                        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.6rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                            {problem.id}. {problem.title}
                        </h2>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span style={{
                                background: DIFF_BG[problem.difficulty],
                                color: DIFF_COLOR[problem.difficulty],
                                padding: '2px 10px', borderRadius: '12px',
                                fontSize: '0.75rem', fontWeight: 600,
                            }}>
                                {problem.difficulty}
                            </span>
                            {problem.topic && (
                                <span style={{
                                    background: 'rgba(255,255,255,0.07)',
                                    color: 'rgba(255,255,255,0.55)',
                                    padding: '2px 10px', borderRadius: '12px',
                                    fontSize: '0.75rem',
                                }}>
                                    {problem.topic}
                                </span>
                            )}
                        </div>
                        <div
                            className="problem-description"
                            style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: '1.65' }}
                            dangerouslySetInnerHTML={{ __html: problem.description }}
                        />
                    </>
                )}

                {tab === 'hints' && (
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '1.2rem' }}>
                            Reveal hints one at a time. Try to solve the problem before looking!
                        </p>

                        {hints.map((hint, i) => (
                            <div key={i} style={{ marginBottom: '0.85rem' }}>
                                {i < revealedHints ? (
                                    <div style={{
                                        background: 'rgba(59,130,246,0.08)',
                                        border: '1px solid rgba(59,130,246,0.2)',
                                        borderRadius: '10px', padding: '0.85rem 1rem',
                                    }}>
                                        <div style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Hint {i + 1}
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                                            {hint}
                                        </div>
                                    </div>
                                ) : i === revealedHints ? (
                                    <button
                                        onClick={() => setRevealedHints(i + 1)}
                                        style={{
                                            width: '100%', padding: '0.75rem 1rem',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px dashed rgba(255,255,255,0.15)',
                                            borderRadius: '10px', cursor: 'pointer',
                                            color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem',
                                            fontFamily: 'var(--font-sans)', textAlign: 'left',
                                            transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                                    >
                                        + Reveal Hint {i + 1}
                                    </button>
                                ) : null}
                            </div>
                        ))}

                        {revealedHints > 0 && revealedHints < hints.length && (
                            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.5rem' }}>
                                {hints.length - revealedHints} more hint{hints.length - revealedHints > 1 ? 's' : ''} available
                            </p>
                        )}
                        {revealedHints === hints.length && hints.length > 0 && (
                            <p style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.5rem' }}>
                                All hints revealed. Good luck!
                            </p>
                        )}
                    </div>
                )}

                {tab === 'solution' && (
                    <div>
                        {!showSolution ? (
                            <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    Make sure you've given it a solid attempt first.
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                                    Optimal solutions show the most efficient approach with clean code.
                                </p>
                                <button
                                    onClick={() => setShowSolution(true)}
                                    style={{
                                        padding: '0.6rem 1.5rem',
                                        background: 'rgba(59,130,246,0.15)',
                                        border: '1px solid rgba(59,130,246,0.35)',
                                        borderRadius: '8px', cursor: 'pointer',
                                        color: '#3b82f6', fontSize: '0.88rem',
                                        fontFamily: 'var(--font-sans)', fontWeight: 500,
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.25)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; }}
                                >
                                    Show Optimal Solution
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    marginBottom: '0.75rem',
                                }}>
                                    <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                                        Optimal Solution — {language === 'javascript' ? 'JavaScript' : 'Python'}
                                    </span>
                                    <button
                                        onClick={() => setShowSolution(false)}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem',
                                            fontFamily: 'var(--font-sans)', padding: '2px 6px',
                                        }}
                                    >
                                        Hide
                                    </button>
                                </div>
                                <pre style={{
                                    background: 'rgba(0,0,0,0.35)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '10px',
                                    padding: '1rem',
                                    overflowX: 'auto',
                                    fontSize: '0.82rem',
                                    lineHeight: 1.7,
                                    color: 'rgba(255,255,255,0.85)',
                                    fontFamily: 'var(--font-mono, monospace)',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}>
                                    {solution}
                                </pre>
                                <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.75rem' }}>
                                    Switch language in the editor panel to see the {language === 'python' ? 'JavaScript' : 'Python'} solution.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
