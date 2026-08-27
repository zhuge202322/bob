export type Role = 'ADMIN' | 'EDITOR' | 'RFQ_OPERATOR'
export type Permission = 'content:read' | 'content:write' | 'content:publish' | 'rfq:read' | 'rfq:write' | 'rfq:export' | 'users:manage'

const permissions: Record<Role, ReadonlySet<Permission>> = {
  ADMIN: new Set(['content:read', 'content:write', 'content:publish', 'rfq:read', 'rfq:write', 'rfq:export', 'users:manage']),
  EDITOR: new Set(['content:read', 'content:write']),
  RFQ_OPERATOR: new Set(['content:read', 'rfq:read', 'rfq:write', 'rfq:export'])
}

export function can(role: Role, permission: Permission) {
  return permissions[role].has(permission)
}

export function isSessionExpired(expiresAt: Date, now = new Date()) {
  return expiresAt.getTime() <= now.getTime()
}
