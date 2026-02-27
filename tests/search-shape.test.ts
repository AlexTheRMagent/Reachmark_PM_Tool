import { describe, expect, it } from "vitest";

describe("search result model", () => {
  it("contains expected top-level keys", () => {
    const shape = { tasks: [], docs: [], goals: [], dashboards: [] };
    expect(Object.keys(shape)).toEqual(["tasks", "docs", "goals", "dashboards"]);
  });
});
