importScripts('https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js');

let pyodideReadyPromise = loadPyodide();

// Standard LeetCode imports + common data structures pre-defined so user code
// works exactly like it does on LeetCode (no manual imports required).
const PREAMBLE = `
from typing import *
from collections import *
from heapq import *
from math import *
from itertools import *
from functools import *
import sys, re, bisect, random

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    def __repr__(self):
        vals, cur = [], self
        while cur:
            vals.append(str(cur.val))
            cur = cur.next
        return '[' + ' -> '.join(vals) + ']'

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
    def __repr__(self):
        return f'TreeNode({self.val})'

class Node:
    def __init__(self, val=0, neighbors=None, left=None, right=None, next=None, children=None):
        self.val = val
        self.neighbors = neighbors or []
        self.left = left
        self.right = right
        self.next = next
        self.children = children or []

def list_to_tree(vals):
    """Build a binary tree from a level-order list (None for missing nodes)."""
    if not vals:
        return None
    root = TreeNode(vals[0])
    queue = [root]
    i = 1
    while queue and i < len(vals):
        node = queue.pop(0)
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i])
            queue.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i])
            queue.append(node.right)
        i += 1
    return root

def tree_to_list(root):
    """Serialize a binary tree to level-order list."""
    if not root:
        return []
    result, queue = [], [root]
    while queue:
        node = queue.pop(0)
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    while result and result[-1] is None:
        result.pop()
    return result

def list_to_linked(lst):
    """Convert a list to a linked list, returning the head ListNode."""
    if not lst:
        return None
    head = ListNode(lst[0])
    cur = head
    for v in lst[1:]:
        cur.next = ListNode(v)
        cur = cur.next
    return head

def linked_to_list(node):
    """Convert a linked list to a Python list."""
    result = []
    while node:
        result.append(node.val)
        node = node.next
    return result
`;

// Auto-aliases Solution class methods as top-level functions so test cases
// work whether the user writes a class or standalone functions.
const SOLUTION_ALIAS_PREAMBLE = `
import inspect as _inspect
try:
    _sol = Solution()
    for _name, _method in _inspect.getmembers(_sol, predicate=_inspect.ismethod):
        if not _name.startswith('_'):
            globals()[_name] = _method
except NameError:
    pass
`;

// Strip Pyodide-internal frames from Python tracebacks so users only see
// the lines that are relevant to their own code.
function cleanPythonError(errStr) {
    const lines = errStr.split('\n');
    const cleaned = lines.filter(line =>
        !line.includes('/_pyodide/') &&
        !line.includes('/lib/python3.11.zip/_pyodide') &&
        !line.includes('eval_code_async') &&
        !line.includes('run_async') &&
        !line.includes('CodeRunner(')
    );
    return cleaned.join('\n').trim();
}

self.onmessage = async function (e) {
    const { code, testCases } = e.data;

    self.postMessage({ type: 'status', message: 'Loading Python environment...' });

    let capturedLogs = [];
    try {
        const pyodide = await pyodideReadyPromise;

        self.postMessage({ type: 'status', message: 'Executing code...' });

        pyodide.setStdout({ batched: (str) => capturedLogs.push(str) });
        pyodide.setStderr({ batched: (str) => capturedLogs.push(str) });

        await pyodide.runPythonAsync(PREAMBLE);
        await pyodide.runPythonAsync(code);
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
                results.push({ testId: i, passed: false, error: cleanPythonError(err.toString()) });
            }
        }

        self.postMessage({ type: 'success', results, logs: capturedLogs.join('\n') });
    } catch (error) {
        self.postMessage({ type: 'error', error: cleanPythonError(error.toString()), logs: capturedLogs.join('\n') });
    }
};
