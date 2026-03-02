#!/usr/bin/env python3
"""
build_blind75.py — Step 3 (Final): Fetch all 75 problems + generate test cases → blind75.json
Usage: python3 build_blind75.py
"""

import json, time, re, urllib.request, urllib.error
from testcase_generator import generate_test_cases, parse_example_inputs, _make_two_sum_tests

# ── Starter-code helpers ──────────────────────────────────────────────────────

def clean_python_starter(code: str) -> str:
    """Strip 'class Solution:' wrapper and remove 'self' so functions are standalone."""
    lines = code.splitlines()
    result = []
    inside_class = False
    for line in lines:
        if re.match(r'\s*class Solution\s*:', line):
            inside_class = True
            continue
        if inside_class and line.startswith('    '):
            line = line[4:]                         # dedent
        # Remove self param
        line = re.sub(r'\(self,\s*', '(', line)
        line = re.sub(r'\(self\)', '()', line)
        result.append(line)
    return '\n'.join(result).strip()

# ── The canonical Blind 75 list (slug → display number) ──────────────────────
BLIND_75_SLUGS = [
    "two-sum",
    "best-time-to-buy-and-sell-stock",
    "contains-duplicate",
    "product-of-array-except-self",
    "maximum-subarray",
    "maximum-product-subarray",
    "find-minimum-in-rotated-sorted-array",
    "search-in-rotated-sorted-array",
    "3sum",
    "container-with-most-water",
    # Strings
    "longest-substring-without-repeating-characters",
    "longest-repeating-character-replacement",
    "minimum-window-substring",
    "valid-anagram",
    "group-anagrams",
    "valid-parentheses",
    "valid-palindrome",
    "longest-palindromic-substring",
    "palindromic-substrings",
    "encode-and-decode-strings",
    # Trees
    "maximum-depth-of-binary-tree",
    "same-tree",
    "invert-binary-tree",
    "binary-tree-maximum-path-sum",
    "binary-tree-level-order-traversal",
    "serialize-and-deserialize-binary-tree",
    "subtree-of-another-tree",
    "construct-binary-tree-from-preorder-and-inorder-traversal",
    "validate-binary-search-tree",
    "kth-smallest-element-in-a-bst",
    "lowest-common-ancestor-of-a-binary-search-tree",
    "implement-trie-prefix-tree",
    "design-add-and-search-words-data-structure",
    "word-search-ii",
    # Heap / Priority Queue
    "find-median-from-data-stream",
    "top-k-frequent-elements",
    "kth-largest-element-in-an-array",
    # Graphs
    "number-of-islands",
    "clone-graph",
    "pacific-atlantic-water-flow",
    "course-schedule",
    "number-of-connected-components-in-an-undirected-graph",
    "graph-valid-tree",
    "longest-consecutive-sequence",
    "alien-dictionary",
    # Dynamic Programming
    "climbing-stairs",
    "coin-change",
    "longest-increasing-subsequence",
    "word-break",
    "combination-sum-iv",
    "house-robber",
    "house-robber-ii",
    "decode-ways",
    "unique-paths",
    "jump-game",
    # Intervals
    "insert-interval",
    "merge-intervals",
    "non-overlapping-intervals",
    "meeting-rooms",
    "meeting-rooms-ii",
    # Linked List
    "reverse-linked-list",
    "linked-list-cycle",
    "merge-two-sorted-lists",
    "merge-k-sorted-lists",
    "remove-nth-node-from-end-of-list",
    "reorder-list",
    # Matrix
    "set-matrix-zeroes",
    "spiral-matrix",
    "rotate-image",
    "word-search",
    # Binary
    "sum-of-two-integers",
    "number-of-1-bits",
    "counting-bits",
    "reverse-bits",
    "missing-number",
    "reverse-integer",
]

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"
QUERY = """
query getProblem($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId title difficulty content
    codeSnippets { lang langSlug code }
    exampleTestcases metaData
  }
}
"""

def fetch_problem(slug):
    payload = json.dumps({"query": QUERY, "variables": {"titleSlug": slug}}).encode()
    req = urllib.request.Request(
        LEETCODE_GRAPHQL_URL, data=payload,
        headers={
            "Content-Type": "application/json",
            "Referer": f"https://leetcode.com/problems/{slug}/",
            "User-Agent": "Mozilla/5.0",
        }, method="POST"
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode())
    return data.get("data", {}).get("question")

def get_starter(snippets, lang_slug):
    for s in (snippets or []):
        if s["langSlug"] == lang_slug:
            return s["code"]
    return ""

def build():
    problems = []
    for idx, slug in enumerate(BLIND_75_SLUGS, 1):
        print(f"[{idx:02d}/75] Fetching: {slug} ...", end=" ", flush=True)
        try:
            q = fetch_problem(slug)
            if not q:
                print("SKIPPED (not found)")
                continue

            meta = json.loads(q.get("metaData") or "{}")
            func_name  = meta.get("name", slug.replace("-", "_"))
            params     = meta.get("params", [])
            return_t   = (meta.get("return") or {}).get("type", "void")
            raw_ex     = q.get("exampleTestcases", "")
            examples   = parse_example_inputs(raw_ex, params) if params else []

            # Route specific problems to dedicated test generators for real assertions
            if slug == "two-sum":
                tests = _make_two_sum_tests(num_tests=13)
            else:
                tests = generate_test_cases(func_name, params, return_t, examples, num_tests=15)

            problems.append({
                "id":          int(q["questionId"]),
                "title":       q["title"],
                "difficulty":  q["difficulty"],
                "description": q.get("content") or "",
                "starterCode": {
                    "python":     clean_python_starter(get_starter(q.get("codeSnippets"), "python3")),
                    "javascript": get_starter(q.get("codeSnippets"), "javascript"),
                },
                "testCases": tests,
            })
            print(f"OK  ({len(tests['python'])} py / {len(tests['javascript'])} js tests)")
        except Exception as e:
            print(f"ERROR: {e}")

        # Be polite to the server
        time.sleep(0.4)

    out_path = "blind75.json"
    with open(out_path, "w") as f:
        json.dump(problems, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Done! {len(problems)} problems written to {out_path}")

if __name__ == "__main__":
    build()
