import React from 'react';
import Editor from '@monaco-editor/react';
import { Code2 } from 'lucide-react';

export default function EditorPanel({ language, setLanguage, code, setCode }) {
    return (
        <div className="panel" style={{ height: '100%' }}>
            <div className="panel-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code2 size={16} />
                    <span>Code Editor</span>
                </div>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="custom-select"
                    style={{ padding: '0.25rem 2rem 0.25rem 0.75rem', fontSize: '0.8rem' }}
                >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                </select>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'var(--font-mono)',
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                    }}
                />
            </div>
        </div>
    );
}
