import test from "node:test";
import assert from "node:assert/strict";
import { fmtUsd, fmtPct } from "../src/logic.js";
test("fmt", () => {
  assert.match(fmtUsd(12.3), /\$/);
  assert.equal(fmtPct(1.5), "+1.50%");
});
