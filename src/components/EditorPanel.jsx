import React from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Play, Check } from 'lucide-react';

export default function EditorPanel({ language, setLanguage, code, setCode, monacoTheme, onRun, onSubmit, isRunning }) {
    return (
        <div className="panel" style={{ height: '100%' }}>
            <div className="panel-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code2 size={16} />
                    <span>Code Editor</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="custom-select"
                        style={{ padding: '0.25rem 2rem 0.25rem 0.75rem', fontSize: '0.8rem' }}
                    >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                    <button className="btn btn-secondary" disabled={isRunning} onClick={onRun} title="Cmd/Ctrl + Enter" style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}>
                        {isRunning ? <div className="loader" /> : <Play size={13} />} Run
                    </button>
                    <button className="btn btn-success" disabled={isRunning} onClick={onSubmit} title="Cmd/Ctrl + Shift + Enter" style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}>
                        {isRunning ? <div className="loader" /> : <Check size={13} />} Submit
                    </button>
                </div>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
                <Editor
                    height="100%"
                    language={language}
                    theme={monacoTheme || 'vs-dark'}
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
                        automaticLayout: true,
                    }}
                />
            </div>
        </div>
    );
}
