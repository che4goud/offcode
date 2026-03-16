import React from 'react';
import { Terminal, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import ghostData from '../data/ghostData.json';

export default function ConsolePanel({ output, problemId }) {
    // Let's parse the output if it's the structured string from App.jsx
    // In a real app we'd pass an object as prop, but string parsing is fine for MVP
    const isFinished = output && output.includes('Status:');
    const isAccepted = output && output.includes('Accepted');
    const isWrong = output && output.includes('Wrong Answer');
    const isRuntimeError = output && output.includes('Runtime Error');
    const isTLE = output && output.includes('Time Limit Exceeded');
    const isError = isRuntimeError || isTLE || (output && output.includes('Error'));

    // Extract runtime
    const runtimeMatch = output?.match(/Runtime: (\d+)ms/);
    const runtime = runtimeMatch ? parseInt(runtimeMatch[1], 10) : null;

    // Determine Ghost Tier
    let tier = null;
    let tierColor = 'var(--text-secondary)';

    if (isAccepted && runtime && ghostData[problemId]) {
        const limits = ghostData[problemId];
        if (runtime <= limits.optimalTime) {
            tier = '🏆 Optimal Tier (Beats 95%)';
            tierColor = 'var(--accent-secondary)';
        } else if (runtime <= limits.averageTime) {
            tier = '👍 Average Tier (Beats 50%)';
            tierColor = 'var(--success)';
        } else {
            tier = '🐢 Slow Tier (Needs Optimization)';
            tierColor = 'var(--warning)';
        }
    }

    return (
        <div className="panel" style={{ height: '100%' }}>
            <div className="panel-header">
                <Terminal size={16} />
                <span>Test Console</span>
            </div>
            <div className="panel-content" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                {!output ? (
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center', margin: 'auto' }}>
                        Run your code to see results here
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>

                        {/* Status Header */}
                        {isFinished && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                color: isAccepted ? 'var(--success)' : isError || isWrong ? 'var(--error)' : 'var(--text-primary)',
                                fontSize: '1.25rem', fontWeight: '600'
                            }}>
                                {isAccepted && <CheckCircle2 size={24} />}
                                {isWrong && <XCircle size={24} />}
                                {isError && <AlertCircle size={24} />}
                                {!isAccepted && !isWrong && !isError && <Clock size={24} />}

                                {isAccepted ? 'Accepted' :
                                    isWrong ? 'Wrong Answer' :
                                        isTLE ? 'Time Limit Exceeded' :
                                            isRuntimeError ? 'Runtime Error' :
                                                isError ? 'Error' : 'Finished'}
                            </div>
                        )}

                        {/* Performance Gamification */}
                        {tier && (
                            <div style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                background: 'var(--bg-panel-border)',
                                border: `1px solid ${tierColor}`,
                                color: tierColor,
                                fontWeight: '600',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>{tier}</span>
                                <span style={{ fontSize: '1.5rem' }}>{runtime}ms</span>
                            </div>
                        )}

                        {/* Raw Console Logs */}
                        <div style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '1rem',
                            borderRadius: '8px',
                            flex: 1,
                            overflowY: 'auto',
                            border: '1px solid var(--bg-panel-border)'
                        }}>
                            <pre style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                                margin: 0
                            }}>
                                {output}
                            </pre>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
