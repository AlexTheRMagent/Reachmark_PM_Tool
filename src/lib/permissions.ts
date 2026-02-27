import { WorkspaceRole } from "@prisma/client";

const roleRank: Record<WorkspaceRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  GUEST: 1
};

export function canManageMembers(role: WorkspaceRole) {
  return roleRank[role] >= roleRank.ADMIN;
}

export function canEdit(role: WorkspaceRole) {
  return roleRank[role] >= roleRank.MEMBER;
}
