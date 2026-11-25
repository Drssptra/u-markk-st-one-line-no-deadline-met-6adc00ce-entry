// One Line, No Deadline Met — a single-line excuse for a missed deadline.
//
// The joke flips the blame: the deadline is the one that ran away.
// Writes the line to $MAKEFUN_OUTPUT_DIR/entry.txt (default
// /output/entry.txt) with no trailing newline, and prints it to stdout.
//
// One sentence, under the 200-character gate, deterministic on every
// run. Node 22, standard library only, no network at runtime.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I didn't miss the deadline — it took one look at my to-do list, panicked, and fled before I could disappoint it.";

// The sealed gate allows 1-200 characters, a single line, not only
// whitespace. Keep the cap as a named constant so it is easy to audit.
const GATE_MAX_CHARS = 200;

function checkEntry(text: string): void {
  if (text.length === 0 || text.length > GATE_MAX_CHARS) {
    throw new Error(
      `entry must be 1-${GATE_MAX_CHARS} characters, got ${text.length}`,
    );
  }
  if (text.trim().length === 0 || text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single non-blank line");
  }
}

function main(): void {
  checkEntry(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
  console.log(ENTRY);
}

main();
