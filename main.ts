// One Line, No Deadline Met — v2 rewrite.
//
// Premise: the speaker skipped a deadline deliberately, on the
// word of a traveller from their own future — the only witness
// who has already survived the fallout. The joke turns on the
// last two words: the expert is just "me".
// This file assembles that one line from its clauses, checks it
// against the 1–200 character single-line gate, then drops it
// into entry.txt with no trailing newline.

import * as fs from "node:fs";
import * as path from "node:path";

// Clauses of the excuse, in order. Joined with single spaces;
// the em dash and the final "me." carry the punchline.
const CLAUSES: readonly string[] = [
  "My future self warned me",
  "the deadline wasn't worth meeting,",
  "so I listened to the only expert",
  "who'd already lived through it — me.",
];

const GATE = { min: 1, max: 200 } as const;

class OneLineEntry {
  readonly line: string;

  constructor(clauses: readonly string[]) {
    this.line = clauses.join(" ");
    this.assertInGate();
  }

  private assertInGate(): void {
    const { line } = this;
    if (line.length < GATE.min || line.length > GATE.max) {
      throw new RangeError(
        `entry is ${line.length} chars, gate is ${GATE.min}-${GATE.max}`,
      );
    }
    if (/[\r\n]/.test(line) || line.trim() !== line || line.length === 0) {
      throw new RangeError("entry must be one non-blank line");
    }
  }

  save(directory: string): string {
    const target = path.resolve(directory, "entry.txt");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.from(this.line, "utf8"));
    return target;
  }
}

const entry = new OneLineEntry(CLAUSES);
const outputDir = process.env["MAKEFUN_OUTPUT_DIR"] ?? "/output";
const writtenTo = entry.save(outputDir);
process.stdout.write(`${entry.line}\n`);
process.stderr.write(`wrote ${entry.line.length} chars to ${writtenTo}\n`);
