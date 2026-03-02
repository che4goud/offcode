import React from 'react';
import { FileText } from 'lucide-react';

export default function ProblemPanel({ problem }) {
    if (!problem) return null;

    return (
        <div className="panel" style={{ height: '100%' }}>
            <div className="panel-header">
                <FileText size={16} />
                <span>Description</span>
            </div>
            <div className="panel-content">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    {problem.id}. {problem.title}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{
                        background: problem.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: problem.difficulty === 'Easy' ? 'var(--success)' : 'var(--warning)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                    }}>
                        {problem.difficulty}
                    </span>
                </div>

                <div
                    className="problem-description"
                    style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}
                    dangerouslySetInnerHTML={{ __html: problem.description }}
                />
            </div>
        </div>
    );
}
