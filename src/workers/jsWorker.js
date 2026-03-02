// jsWorker.js

self.onmessage = function (e) {
    const { code, testCases } = e.data;

    let capturedLogs = [];
    try {
        const originalLog = console.log;
        console.log = (...args) => {
            capturedLogs.push(args.map(a => String(a)).join(' '));
            originalLog.apply(console, args);
        };

        if (!testCases || testCases.length === 0) {
            eval(code);
            self.postMessage({ type: 'success', logs: capturedLogs.join('\n') });
            return;
        }

        // To solve scoping issues, we evaluate the user code AND the test runner in the exact same scope string.
        let runnerCode = `
            ${code};
            
            const __results = [];
            const __testCases = ${JSON.stringify(testCases)};
            
            for (let i = 0; i < __testCases.length; i++) {
                try {
                    let result = eval(__testCases[i]);
                    __results.push({ testId: i, passed: true, actualOutput: result });
                } catch (err) {
                    __results.push({ testId: i, passed: false, error: err.toString() });
                }
            }
            __results;
        `;

        const results = eval(runnerCode);
        self.postMessage({ type: 'success', results, logs: capturedLogs.join('\n') });
    } catch (error) {
        self.postMessage({ type: 'error', error: error.toString(), logs: capturedLogs.join('\n') });
    }
};

