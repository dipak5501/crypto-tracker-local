import test from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/logic.js";
test("run returns text", () => { assert.equal(typeof run(), "string"); assert.ok(run().length > 10); });
