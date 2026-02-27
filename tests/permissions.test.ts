import { describe, expect, it } from "vitest";

import { canEdit, canManageMembers } from "../src/lib/permissions";

describe("permissions", () => {
  it("allows owner/admin to manage members", () => {
    expect(canManageMembers("OWNER")).toBe(true);
    expect(canManageMembers("ADMIN")).toBe(true);
    expect(canManageMembers("MEMBER")).toBe(false);
  });

  it("allows member+ to edit", () => {
    expect(canEdit("OWNER")).toBe(true);
    expect(canEdit("ADMIN")).toBe(true);
    expect(canEdit("MEMBER")).toBe(true);
    expect(canEdit("GUEST")).toBe(false);
  });
});
