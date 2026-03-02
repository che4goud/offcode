#!/usr/bin/env python3
"""
fetch_problem.py — Step 1: Fetch a single LeetCode problem via GraphQL.
Usage: python3 fetch_problem.py <problem-slug>
Example: python3 fetch_problem.py two-sum
"""

import sys
import json
import urllib.request
import urllib.error

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

QUERY = """
query getProblem($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    title
    difficulty
    content
    codeSnippets {
      lang
      langSlug
      code
    }
    exampleTestcases
    metaData
  }
}
"""

def fetch_problem(slug: str) -> dict:
    payload = json.dumps({
        "query": QUERY,
        "variables": {"titleSlug": slug}
    }).encode("utf-8")

    req = urllib.request.Request(
        LEETCODE_GRAPHQL_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Referer": f"https://leetcode.com/problems/{slug}/",
            "User-Agent": "Mozilla/5.0",
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read().decode("utf-8")
        data = json.loads(body)

    question = data.get("data", {}).get("question")
    if not question:
        raise ValueError(f"Problem '{slug}' not found or rate-limited.")
    return question


def main():
    slug = sys.argv[1] if len(sys.argv) > 1 else "two-sum"
    print(f"Fetching: {slug} ...\n")

    try:
        q = fetch_problem(slug)
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

    print(f"ID:         {q['questionId']}")
    print(f"Title:      {q['title']}")
    print(f"Difficulty: {q['difficulty']}")
    print(f"\nMeta:")
    try:
        meta = json.loads(q.get("metaData") or "{}")
        print(json.dumps(meta, indent=2))
    except Exception:
        print(q.get("metaData"))

    print(f"\nExample Test Cases (raw):\n{q.get('exampleTestcases', '')}")

    print(f"\nCode Snippets Available:")
    for snippet in (q.get("codeSnippets") or []):
        print(f"  - {snippet['lang']} ({snippet['langSlug']})")

    # Save raw output for inspection
    out_path = f"{slug}_raw.json"
    with open(out_path, "w") as f:
        json.dump(q, f, indent=2)
    print(f"\nFull response saved to: {out_path}")


if __name__ == "__main__":
    main()
