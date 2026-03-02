"""
testcase_generator.py — Step 2: Generate edge-case test assertions from LeetCode metaData.

Given a parsed problem (function name, param types, return type, and example inputs),
this module produces 10–20 executable test strings for both Python and JavaScript.
"""

import json
import random
import re


# ── Helpers ──────────────────────────────────────────────────────────────────

def _rand_int(lo=-100, hi=100):
    return random.randint(lo, hi)

def _rand_int_list(length=None, lo=-100, hi=100):
    n = length if length is not None else random.randint(0, 8)
    return [random.randint(lo, hi) for _ in range(n)]

def _rand_string(length=None):
    chars = "abcdefghijklmnopqrstuvwxyz"
    n = length if length is not None else random.randint(0, 10)
    return "".join(random.choice(chars) for _ in range(n))

def _py(v):
    """Format a Python literal."""
    if isinstance(v, bool): return "True" if v else "False"
    if isinstance(v, str):  return json.dumps(v)
    if isinstance(v, list): return "[" + ", ".join(_py(x) for x in v) + "]"
    return str(v)

def _js(v):
    """Format a JavaScript literal."""
    if isinstance(v, bool): return "true" if v else "false"
    if isinstance(v, str):  return json.dumps(v)
    if isinstance(v, list): return "[" + ", ".join(_js(x) for x in v) + "]"
    return str(v)

# ── Two Sum–specific test case builder ───────────────────────────────────────
# Returns assertions that actually validate correctness, not just "not None".

def _make_two_sum_tests(num_tests=15):
    """Generate proper correctness-checking tests for Two Sum."""
    cases = [
        ([2, 7, 11, 15], 9,  [0, 1]),
        ([3, 2, 4],       6,  [1, 2]),
        ([3, 3],           6,  [0, 1]),
        ([1, 2, 3, 4],    7,  [2, 3]),
        ([0, 4, 3, 0],    0,  [0, 3]),
        ([-3, 4, 3, 90], 0,  [0, 2]),
        ([1, 5, 5],       10, [1, 2]),
        ([2, 5, 5, 11],   10, [1, 2]),
        ([1, 3, 4, 2],    6,  [2, 3]),
        ([100, 1, 99],    199,[0, 2]),
        ([-1, -2, -3, -4, -5], -8, [2, 4]),
        ([5, 75, 25],     100,[1, 2]),
        ([1, 1000000000], 1000000001, [0, 1]),
    ]
    py_tests, js_tests = [], []
    for nums, target, expected in cases[:num_tests]:
        exp_set = set(expected)  # order-independent
        py_tests.append(
            f"_r = twoSum({_py(nums)}, {target}); "
            f"assert _r is not None and len(_r)==2 and set(_r)=={{{expected[0]},{expected[1]}}} and "
            f"{nums}[_r[0]]+{nums}[_r[1]]=={target}, "
            f"f'Expected indices {expected} but got {{_r}}'"
        )
        js_tests.append(
            f"(() => {{ const _r = twoSum({_js(nums)}, {target}); "
            f"if (!_r || _r.length!==2 || !_r.includes({expected[0]}) || !_r.includes({expected[1]}) || "
            f"{_js(nums)}[_r[0]]+{_js(nums)}[_r[1]]!=={target}) "
            f"throw new Error('Expected {expected} but got '+JSON.stringify(_r)); return true; }})()"
        )
    return {"python": py_tests, "javascript": js_tests}


# ── Type-aware value generators ───────────────────────────────────────────────

def _gen_values_for_type(type_str: str, edge_idx: int):
    """Return a value appropriate for the given LeetCode type string."""
    t = type_str.strip().lower()

    # Integer[]
    if t in ("integer[]", "int[]", "number[]"):
        edge_cases = [
            [],                              # empty
            [0],                             # single zero
            [-1],                            # single negative
            [1000000, -1000000],             # large bounds
            [1, 1, 1, 1],                    # all duplicates
            _rand_int_list(2),
            _rand_int_list(5),
            _rand_int_list(6, 0, 10),        # small positives
            sorted(_rand_int_list(5)),       # sorted
            sorted(_rand_int_list(5), reverse=True),  # reverse sorted
        ]
        return edge_cases[edge_idx % len(edge_cases)]

    # Integer
    if t in ("integer", "int", "number", "long"):
        edge_cases = [0, 1, -1, 2**31 - 1, -(2**31), 100, -100, 7, 13, 999]
        return edge_cases[edge_idx % len(edge_cases)]

    # String
    if t == "string":
        edge_cases = [
            "",           # empty
            "a",          # single char
            "aa",         # two same
            "ab",         # two different
            "abcde",
            "racecar",    # palindrome
            "A man a plan a canal Panama".lower().replace(" ", ""),
            "aaabbbccc",
            "abcdefghij",
            "zzzzzz",
        ]
        return edge_cases[edge_idx % len(edge_cases)]

    # String[]
    if t == "string[]":
        edge_cases = [
            [],
            [""],
            ["a"],
            ["a", "b"],
            ["eat", "tea", "tan", "ate", "nat", "bat"],
            ["", "a", "ab"],
            ["abc", "bca", "cab"],
        ]
        return edge_cases[edge_idx % len(edge_cases)]

    # Boolean
    if t == "boolean":
        return edge_idx % 2 == 0

    # Character
    if t in ("character", "char"):
        return random.choice("abcde"[edge_idx % 5])

    # Default fallback
    return 0


# ── Main generator ────────────────────────────────────────────────────────────

def generate_test_cases(func_name: str, params: list, return_type: str,
                        example_inputs: list, num_tests: int = 15) -> dict:
    """
    Build `num_tests` test case strings for Python and JavaScript.

    Args:
        func_name:      e.g. "twoSum"
        params:         list of {"name": str, "type": str}
        return_type:    e.g. "integer[]"
        example_inputs: list of lists — each inner list is one full call's args
        num_tests:      target number of test cases (10–20)

    Returns:
        {"python": [...], "javascript": [...]}
    """
    py_tests = []
    js_tests = []

    # ── 1. Use the official example inputs first ──────────────────────────────
    for args in example_inputs:
        if len(args) != len(params):
            continue
        py_call  = f"{func_name}(" + ", ".join(_py(a) for a in args) + ")"
        js_call  = f"{func_name}(" + ", ".join(_js(a) for a in args) + ")"

        # We don't know the expected output, so just assert it doesn't throw
        py_tests.append(f"assert {py_call} is not None, 'Should not be None'")
        js_tests.append(
            f"(() => {{ const _r = {js_call}; "
            f"if (_r === undefined) throw new Error('Got undefined'); return true; }})()"
        )

    # ── 2. Generate edge-case calls ───────────────────────────────────────────
    i = 0
    while len(py_tests) < num_tests:
        args = [_gen_values_for_type(p["type"], i + j) for j, p in enumerate(params)]
        py_call = f"{func_name}(" + ", ".join(_py(a) for a in args) + ")"
        js_call = f"{func_name}(" + ", ".join(_js(a) for a in args) + ")"

        py_tests.append(f"assert {py_call} is not None, 'Should not be None'")
        js_tests.append(
            f"(() => {{ const _r = {js_call}; "
            f"if (_r === undefined) throw new Error('Got undefined'); return true; }})()"
        )
        i += 1

    return {"python": py_tests[:num_tests], "javascript": js_tests[:num_tests]}


# ── Parse example test cases from LeetCode raw string ─────────────────────────

def parse_example_inputs(raw: str, params: list) -> list:
    """
    Convert LeetCode's raw exampleTestcases string into a list of argument lists.
    Each line is one parameter value; groups of len(params) lines = one test call.
    """
    lines = [l.strip() for l in raw.strip().splitlines() if l.strip()]
    np = len(params)
    examples = []
    for i in range(0, len(lines) - np + 1, np):
        group = lines[i:i + np]
        try:
            parsed = [json.loads(g) for g in group]
            examples.append(parsed)
        except Exception:
            pass  # skip malformed lines
    return examples


# ── Quick smoke test ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Simulate what we'd get from the GraphQL fetch for "two-sum"
    meta = {
        "name": "twoSum",
        "params": [
            {"name": "nums",   "type": "integer[]"},
            {"name": "target", "type": "integer"},
        ],
        "return": {"type": "integer[]"}
    }
    raw_examples = "[2,7,11,15]\n9\n[3,2,4]\n6\n[3,3]\n6"
    examples = parse_example_inputs(raw_examples, meta["params"])
    tests = generate_test_cases(
        func_name=meta["name"],
        params=meta["params"],
        return_type=meta["return"]["type"],
        example_inputs=examples,
        num_tests=15
    )
    print(f"Generated {len(tests['python'])} Python tests:")
    for t in tests["python"]:
        print(" ", t)
    print(f"\nGenerated {len(tests['javascript'])} JS tests:")
    for t in tests["javascript"]:
        print(" ", t)
