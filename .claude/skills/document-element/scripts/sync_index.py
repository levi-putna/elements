#!/usr/bin/env python3
"""Sync derived docs from each element's <name>.md (the source of truth).

Scans registry/<name>/<name>.md and, from their frontmatter + purpose line:
  - updates each registry/<name>/registry.json "description"
  - regenerates the element index table in AGENTS.md (between markers)
  - regenerates the root llms.txt

Only files whose content actually changes are rewritten. No external deps.

Usage:
  python3 .claude/skills/document-element/scripts/sync_index.py [REPO_ROOT]
(defaults REPO_ROOT to the current working directory)
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

INDEX_BEGIN = "<!-- BEGIN:element-index -->"
INDEX_END = "<!-- END:element-index -->"
CATEGORY_ORDER = [
    "actions", "inputs", "data-display", "feedback",
    "layout", "marketing", "strata-domain",
]


def find_root(arg: str | None) -> Path:
    start = Path(arg).resolve() if arg else Path.cwd()
    for d in [start, *start.parents]:
        if (d / "registry").is_dir() and (d / "AGENTS.md").exists():
            return d
    if (start / "registry").is_dir():
        return start
    sys.exit(f"Could not find repo root (a dir with registry/ and AGENTS.md) from {start}")


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Return (frontmatter_dict, body). Minimal YAML: scalars and [inline, lists]."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    block = text[3:end].strip("\n")
    body = text[end + 4:]
    fm: dict = {}
    for line in block.splitlines():
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, _, val = line.partition(":")
        key = key.strip()
        val = val.strip()
        if val.startswith("[") and val.endswith("]"):
            inner = val[1:-1].strip()
            fm[key] = [x.strip().strip("'\"") for x in inner.split(",") if x.strip()] if inner else []
        else:
            fm[key] = val.strip("'\"")
    return fm, body


def purpose_line(body: str) -> str:
    """First markdown blockquote ('> ...') after the H1 = the element's purpose."""
    for line in body.splitlines():
        s = line.strip()
        if s.startswith(">"):
            return s.lstrip("> ").strip()
    return ""


def cat_rank(cat: str) -> int:
    return CATEGORY_ORDER.index(cat) if cat in CATEGORY_ORDER else len(CATEGORY_ORDER)


def write_if_changed(path: Path, content: str, changed: list[str]) -> None:
    if not path.exists() or path.read_text() != content:
        path.write_text(content)
        changed.append(str(path))


def main() -> None:
    root = find_root(sys.argv[1] if len(sys.argv) > 1 else None)
    changed: list[str] = []
    elements = []

    for md in sorted(root.glob("registry/*/*.md")):
        if md.stem != md.parent.name:  # only <name>/<name>.md
            continue
        fm, body = parse_frontmatter(md.read_text())
        name = fm.get("name") or md.stem
        purpose = purpose_line(body)
        elements.append({
            "name": name,
            "dir": md.parent.name,
            "category": fm.get("category", "uncategorised"),
            "use_when": fm.get("use_when", purpose),
            "purpose": purpose,
            "rel": md.relative_to(root).as_posix(),
        })

        # 1. sync registry.json description
        reg = md.parent / "registry.json"
        if reg.exists() and purpose:
            data = json.loads(reg.read_text())
            data["description"] = purpose
            write_if_changed(reg, json.dumps(data, indent=2, ensure_ascii=False) + "\n", changed)

    elements.sort(key=lambda e: (cat_rank(e["category"]), e["name"]))

    # 2. regenerate AGENTS.md index table
    agents = root / "AGENTS.md"
    if agents.exists():
        rows = ["| Element | Category | Use when | Docs |", "|---|---|---|---|"]
        for e in elements:
            rows.append(
                f"| `{e['name']}` | {e['category']} | {e['use_when']} | [docs]({e['rel']}) |"
            )
        table = "\n".join(rows)
        txt = agents.read_text()
        if INDEX_BEGIN in txt and INDEX_END in txt:
            pre = txt[: txt.index(INDEX_BEGIN) + len(INDEX_BEGIN)]
            post = txt[txt.index(INDEX_END):]
            new = f"{pre}\n{table}\n{post}"
            write_if_changed(agents, new, changed)
        else:
            print(f"  ! AGENTS.md has no {INDEX_BEGIN}/{INDEX_END} markers — skipped table")

    # 3. regenerate root llms.txt
    lines = [
        "# Instant Strata Elements",
        "",
        "> UI element library for the Instant Strata strata-management platform.",
        "> Components are owned source (shadcn distribution, Base UI primitives).",
        "> Each element's full agent docs live at registry/<name>/<name>.md.",
        "",
        "## Elements",
        "",
    ]
    current = None
    for e in elements:
        if e["category"] != current:
            current = e["category"]
            lines.append(f"### {current}")
        lines.append(f"- [{e['name']}]({e['rel']}): {e['use_when']}")
    write_if_changed(root / "llms.txt", "\n".join(lines) + "\n", changed)

    print(f"Scanned {len(elements)} documented element(s).")
    if changed:
        print("Updated:")
        for c in changed:
            print(f"  - {Path(c).relative_to(root)}")
    else:
        print("Everything already in sync.")


if __name__ == "__main__":
    main()
