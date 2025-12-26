import test from "node:test";
import assert from "node:assert/strict";
import { formatTempC, formatWindKmh } from "../src/utils.js";

test("formatTempC", () => {
  assert.equal(formatTempC(25.4), "25°C");
  assert.equal(formatTempC("x"), "—");
});

test("formatWindKmh", () => {
  assert.equal(formatWindKmh(10.1), "10 km/h");
});
