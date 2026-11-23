import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "This morning the street cat I have fed for a year finally let me touch her head, then purred like a tiny engine starting up.";

const OUTPUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

// Gate check, mirroring the competition rules: UTF-8 text, 1 to 200
// characters, a single line, not only white space, no control characters.
function validate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`Entry must be 1 to 200 characters, got ${text.length}.`);
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code < 0x20 || code === 0x7f) {
      throw new Error("Entry must not contain control characters.");
    }
  }
}

try {
  validate(ENTRY);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
  const roundTrip = readFileSync(OUTPUT_PATH, "utf8");
  if (roundTrip !== ENTRY) {
    throw new Error("Verification failed: file content does not match entry.");
  }
  console.log(ENTRY);
  console.log(`Characters: ${ENTRY.length}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
