// pythonWorker.js

importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');

let pyodideReadyPromise = loadPyodide();

// Injected after user code — auto-aliases Solution methods as top-level functions
// so test cases can call twoSum(...) whether the user wrote a class or a standalone fn.
const SOLUTION_ALIAS_PREAMBLE = `
import inspect as _inspect
try:
    _sol = Solution()
    for _name, _method in _inspect.getmembers(_sol, predicate=_inspect.ismethod):
        if not _name.startswith('_'):
            globals()[_name] = _method
except NameError:
    pass  # No class Solution defined — user wrote standalone functions, which is fine
`;

self.onmessage = async function (e) {
    const { code, testCases } = e.data;

    self.postMessage({ type: 'status', message: 'Loading Python environment...' });

    let capturedLogs = [];
    try {
        const pyodide = await pyodideReadyPromise;

        self.postMessage({ type: 'status', message: 'Executing code...' });

        // Setup stdout capture
        pyodide.setStdout({ batched: (str) => capturedLogs.push(str) });
        pyodide.setStderr({ batched: (str) => capturedLogs.push(str) });

        // Run user code to define functions / class
        await pyodide.runPythonAsync(code);

        // Auto-alias Solution methods as top-level functions
        await pyodide.runPythonAsync(SOLUTION_ALIAS_PREAMBLE);

        if (!testCases || testCases.length === 0) {
            self.postMessage({ type: 'success', logs: capturedLogs.join('\n') });
            return;
        }

        const results = [];
        for (let i = 0; i < testCases.length; i++) {
            try {
                await pyodide.runPythonAsync(testCases[i]);
                results.push({ testId: i, passed: true });
            } catch (err) {
                results.push({ testId: i, passed: false, error: err.toString() });
            }
        }

        self.postMessage({ type: 'success', results, logs: capturedLogs.join('\n') });
    } catch (error) {
        self.postMessage({ type: 'error', error: error.toString(), logs: capturedLogs.join('\n') });
    }
};
