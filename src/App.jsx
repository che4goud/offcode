import React, { useState, useEffect } from 'react';
import ProblemPanel from './components/ProblemPanel';
import EditorPanel from './components/EditorPanel';
import ConsolePanel from './components/ConsolePanel';
import { executeCode } from './services/executionService';
import { saveCode, getCode } from './services/storage';
import { Settings, Play, Check } from 'lucide-react';
import problems from './data/blind75.json';

function App() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const problem = problems[currentProblemIndex];

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
      const res = await executeCode(language, code, []);
      let out = `Status: ${res.status}\nRuntime: ${res.runtime}\n`;
      if (res.error) out += `\nError:\n${res.error}`;
      if (res.logs) out += `\nOutput:\n${res.logs}`;
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
      }

      setConsoleOutput(out);
    } catch (e) {
      setConsoleOutput(`Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header panel">
        <div className="brand-title">
          <Settings size={20} className="text-accent-primary" />
          Offline LeetCode
        </div>
        <div className="header-actions">
          <select
            value={currentProblemIndex}
            onChange={(e) => setCurrentProblemIndex(Number(e.target.value))}
            style={{ marginRight: '1rem', padding: '4px' }}
          >
            {problems.map((p, idx) => (
              <option key={p.id} value={idx}>{p.id}. {p.title}</option>
            ))}
          </select>
          <button className="btn btn-secondary" disabled={isRunning} onClick={handleRunCode}>
            {isRunning ? <div className="loader" /> : <Play size={16} />} Run Code
          </button>
          <button className="btn btn-success" disabled={isRunning} onClick={handleSubmitCode}>
            {isRunning ? <div className="loader" /> : <Check size={16} />} Submit
          </button>
        </div>
      </header>

      <main className="main-workspace">
        <div className="left-pane">
          <ProblemPanel problem={problem} />
        </div>
        <div className="right-pane">
          <div className="editor-container">
            <EditorPanel
              language={language}
              setLanguage={setLanguage}
              code={code}
              setCode={setCode}
            />
          </div>
          <div className="console-container">
            <ConsolePanel output={consoleOutput} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
