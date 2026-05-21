import React, { useState, useEffect, useCallback } from 'react';
import ProblemPanel from '../components/ProblemPanel';
import EditorPanel from '../components/EditorPanel';
import ConsolePanel from '../components/ConsolePanel';
import SupportModal from '../components/SupportModal';
import Resizer from '../components/Resizer';
import ThemeToggle from '../components/ThemeToggle';
import { executeCode } from '../services/executionService';
import { saveCode, getCode, markSolved, getAllSolved } from '../services/storage';
import ProblemSelector from '../components/ProblemSelector';
import problems from '../data/blind75.json';
import OfflineIndicator from '../components/OfflineIndicator';
import { useNavigate } from 'react-router-dom';

function Editor() {
    const navigate = useNavigate();
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState('');
    const [consoleOutput, setConsoleOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [solvedSet, setSolvedSet] = useState(new Set());

    const [appTheme, setAppTheme] = useState(() => localStorage.getItem('offcode_theme') || 'dark');

    // Keep appTheme in sync when ThemeToggle changes the DOM
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const t = document.documentElement.getAttribute('data-theme');
            setAppTheme(t === 'light' ? 'light' : 'dark');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    // Pane sizes: leftPct = left pane width %, editorPct = editor height % within right pane
    const [leftPct, setLeftPct] = useState(40);
    const [editorPct, setEditorPct] = useState(65);

    const handleHorizontalResize = useCallback((delta) => {
        setLeftPct(prev => {
            const workspaceWidth = document.querySelector('.main-workspace')?.offsetWidth || window.innerWidth;
            const newPct = prev + (delta / workspaceWidth) * 100;
            return Math.min(Math.max(newPct, 20), 70);
        });
    }, []);

    const handleVerticalResize = useCallback((delta) => {
        setEditorPct(prev => {
            const rightPane = document.querySelector('.right-pane')?.offsetHeight || window.innerHeight;
            const newPct = prev + (delta / rightPane) * 100;
            return Math.min(Math.max(newPct, 20), 80);
        });
    }, []);

    // Load solved set from IndexedDB on mount
    useEffect(() => {
        getAllSolved().then(setSolvedSet);
    }, []);

    const problem = problems[currentProblemIndex];

    const handleProblemSelect = (idx) => {
        setCurrentProblemIndex(idx);
    };

    // Load code from IndexedDB or fallback to starter code
    useEffect(() => {
        async function loadInitialCode() {
            const savedCode = await getCode(problem.id, language);
            if (savedCode) {
                setCode(savedCode);
            } else {
                setCode(problem.starterCode[language] || '');
            }
        }
        loadInitialCode();
    }, [problem.id, language]);

    // Save code dynamically as it changes
    useEffect(() => {
        if (code) {
            saveCode(problem.id, language, code);
        }
    }, [code, problem.id, language]);

    const handleRunCode = async () => {
        setIsRunning(true);
        setConsoleOutput('Running...\n');

        try {
            // Run the first min(3, testcases.length) tests to give basic feedback on Run
            const allTests = problem.testCases[language] || [];
            const exampleTests = allTests.slice(0, 3);
            const res = await executeCode(language, code, exampleTests);

            let out = `Status: ${res.status}\nRuntime: ${res.runtime}\n`;
            if (res.error) out += `\nError:\n${res.error}`;
            if (res.logs) out += `\nOutput:\n${res.logs}\n`;

            if (res.results && res.results.length > 0) {
                const passed = res.results.filter(r => r.passed).length;
                out += `\nPassed ${passed} / ${res.results.length} example testcases.`;

                // Show first failing test error
                const firstFailed = res.results.find(r => !r.passed);
                if (firstFailed) {
                    out += `\n\nTestcase ${firstFailed.testId + 1} Failed:\n${firstFailed.error}`;
                }
            }

            setConsoleOutput(out);
        } catch (e) {
            setConsoleOutput(`Error: ${e.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmitCode = async () => {
        setIsRunning(true);
        setConsoleOutput('Running all tests...\n');

        try {
            // Pass the actual testcases from the static data
            const tests = problem.testCases[language] || [];
            const res = await executeCode(language, code, tests);

            let out = `Status: ${res.status}\nRuntime: ${res.runtime}\n`;
            if (res.error) out += `\nError:\n${res.error}`;
            if (res.logs) out += `\nStdout:\n${res.logs}\n`;

            if (res.results && res.results.length > 0) {
                const passed = res.results.filter(r => r.passed).length;
                out += `\nPassed ${passed} / ${res.results.length} testcases.`;

                // Mark solved if all tests pass
                if (passed === res.results.length) {
                    await markSolved(problem.id);
                    setSolvedSet(prev => new Set([...prev, problem.id]));
                }

                // Show first failing test error
                const firstFailed = res.results.find(r => !r.passed);
                if (firstFailed) {
                    out += `\n\nTestcase ${firstFailed.testId + 1} Failed:\n${firstFailed.error}`;
                }
            }

            setConsoleOutput(out);
        } catch (e) {
            setConsoleOutput(`Error: ${e.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    // Keyboard Shortcuts: Cmd/Ctrl + Enter (Run), Cmd/Ctrl + Shift + Enter (Submit)
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isMod = e.metaKey || e.ctrlKey;
            const isShift = e.shiftKey;
            const isEnter = e.key === 'Enter';

            if (isMod && isEnter) {
                e.preventDefault();
                if (isRunning) return;

                if (isShift) {
                    handleSubmitCode();
                } else {
                    handleRunCode();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRunning, code, language, currentProblemIndex]); // Re-bind when state changes to ensure latest refs if needed, though handle functions are usually stable

    return (
        <div className="app-container">
            <header className="app-header panel">
                {/* Top-left: theme toggle */}
                <div style={{ position: 'absolute', top: '0.5rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ThemeToggle />
                    <button className="btn btn-secondary" onClick={() => { localStorage.removeItem('offcode_onboarded'); navigate('/'); }} style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }} title="Home">🏠</button>
                </div>

                {/* Top-right: coffee + online */}
                <div style={{ position: 'absolute', top: '0.5rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <OfflineIndicator />
                    <button
                        onClick={() => setShowSupportModal(true)}
                        title="Support OffCode"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            background: '#FFDD00', color: '#1a1a1a',
                            border: 'none', borderRadius: '8px',
                            padding: '0.3rem 0.65rem', fontSize: '0.78rem',
                            fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                        }}
                    >
                        ☕ Buy me a coffee
                    </button>
                </div>

                {/* Row 1: title */}
                <div className="brand-title" style={{ fontSize: '1.1rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary, #3b82f6)', fontFamily: 'var(--font-mono)' }}>&lt;/&gt;</span>
                    OffCode
                </div>

                {/* Row 2: problem selector */}
                <ProblemSelector
                    problems={problems}
                    currentIndex={currentProblemIndex}
                    solvedSet={solvedSet}
                    onSelect={handleProblemSelect}
                />
            </header>

            {showSupportModal && (
                <SupportModal onDismiss={() => setShowSupportModal(false)} />
            )}

            <main className="main-workspace">
                <div className="left-pane" style={{ flex: 'none', width: `${leftPct}%` }}>
                    <ProblemPanel problem={problem} language={language} />
                </div>
                <Resizer direction="horizontal" onResize={handleHorizontalResize} />
                <div className="right-pane" style={{ flex: 1 }}>
                    <div className="editor-container" style={{ flex: 'none', height: `${editorPct}%` }}>
                        <EditorPanel
                            language={language}
                            setLanguage={setLanguage}
                            code={code}
                            setCode={setCode}
                            monacoTheme={appTheme === 'light' ? 'vs' : 'vs-dark'}
                            onRun={handleRunCode}
                            onSubmit={handleSubmitCode}
                            isRunning={isRunning}
                        />
                    </div>
                    <Resizer direction="vertical" onResize={handleVerticalResize} />
                    <div className="console-container" style={{ flex: 1 }}>
                        <ConsolePanel output={consoleOutput} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Editor;
