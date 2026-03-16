// executionService.js

const TIMEOUT_MS = 30000;

export async function executeCode(language, code, testCases = []) {
    return new Promise((resolve, reject) => {
        let worker;

        if (language === 'javascript') {
            worker = new Worker(new URL('../workers/jsWorker.js', import.meta.url), { type: 'module' });
        } else if (language === 'python') {
            worker = new Worker(new URL('../workers/pythonWorker.js', import.meta.url));
        } else {
            return reject(new Error(`Language ${language} not supported yet.`));
        }

        const t0 = performance.now();
        let hasReturned = false;

        // Timeout mechanism to prevent infinite loops (TLE)
        const timeoutId = setTimeout(() => {
            if (!hasReturned) {
                worker.terminate();
                hasReturned = true;
                resolve({
                    status: 'Time Limit Exceeded',
                    error: `Execution timed out after ${TIMEOUT_MS}ms. Check for infinite loops.`,
                    runtime: `>${TIMEOUT_MS}ms`
                });
            }
        }, TIMEOUT_MS);

        worker.onmessage = (e) => {
            const data = e.data;

            // Status messages (like Pyodide loading) don't finish the run
            if (data.type === 'status') {
                console.log('[Worker Status]:', data.message);
                return;
            }

            hasReturned = true;
            clearTimeout(timeoutId);
            worker.terminate();

            const t1 = performance.now();
            const runtime = (t1 - t0).toFixed(0);

            if (data.type === 'error') {
                resolve({
                    status: 'Runtime Error',
                    error: data.error,
                    runtime: `${runtime}ms`
                });
            } else if (data.type === 'success') {

                if (!code || code.trim() === '') {
                    resolve({
                        status: 'Wrong Answer',
                        error: 'Code cannot be empty.',
                        runtime: '0ms'
                    });
                    return;
                }

                // Did we pass all test cases?
                let status = 'Accepted';
                if (data.results && data.results.some(r => !r.passed)) {
                    // Check if the failure is just an assertion failing or a real runtime error
                    const realError = data.results.find(r =>
                        !r.passed && r.error && !r.error.includes('AssertionError') && !r.error.includes('Expected')
                    );

                    if (realError) {
                        status = 'Runtime Error';
                    } else {
                        status = 'Wrong Answer';
                    }
                } else if (!data.results || data.results.length === 0) {
                    status = 'Finished'; // Just hit "Run", not submit
                }

                resolve({
                    status,
                    logs: data.logs,
                    results: data.results || [],
                    runtime: `${runtime}ms`
                });
            }
        };

        worker.onerror = (err) => {
            hasReturned = true;
            clearTimeout(timeoutId);
            worker.terminate();
            resolve({
                status: 'Worker Error',
                error: err.message || 'Unknown Web Worker error',
                runtime: '0ms'
            });
        };

        worker.postMessage({ code, testCases });
    });
}
