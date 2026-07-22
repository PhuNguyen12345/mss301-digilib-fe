const SYSTEM_ROLES = new Set([
  'offline_access',
  'uma_authorization',
  'default-roles-digilib-realm',
])

function normalizeRoleName(role) {
  return String(role || '')
    .replace(/^ROLE_/i, '')
    .trim()
    .toLowerCase()
}

export function extractRolesFromJwtPayload(payload) {
  if (!payload) return []

  const realmRoles = Array.isArray(payload.realm_access?.roles) ? payload.realm_access.roles : []
  const resourceRoles = Object.values(payload.resource_access || {}).flatMap((resource) =>
    Array.isArray(resource?.roles) ? resource.roles : [],
  )
  const directRoles = Array.isArray(payload.roles) ? payload.roles : []

  return [...new Set([...realmRoles, ...resourceRoles, ...directRoles]
    .map(normalizeRoleName)
    .filter((role) => role && !SYSTEM_ROLES.has(role)))]
}

export function buildUserFromJwtPayload(payload, roles = []) {
  if (!payload) return null

  return {
    id: payload.sub || payload.sid || '',
    email: payload.email || payload.preferred_username || '',
    firstName: payload.given_name || payload.firstName || '',
    lastName: payload.family_name || payload.lastName || '',
    roles,
  }
}

function normalizeStatus(member) {
  const candidates = [
    member?.status,
    member?.memberStatus,
    member?.accountStatus,
    member?.userStatus,
  ]
  const value = candidates.find((item) => item != null && String(item).trim() !== '')
  const normalized = String(value || '').trim().toUpperCase()

  if (['UNLOCKED', 'SOFT_LOCKED', 'LOCKED'].includes(normalized)) return normalized
  if (member?.enabled === false || member?.isLocked === true || member?.locked === true) return 'LOCKED'
  return normalized || 'UNKNOWN'
}

function normalizeMemberType(member) {
  return member?.memberType || member?.type || member?.userType || member?.member_role || 'READER'
}

export function normalizeMemberProfile(member, options = {}) {
  if (!member || typeof member !== 'object') return null

  const roles = Array.isArray(options.roles) ? options.roles : Array.isArray(member.roles) ? member.roles : []

  return {
    ...member,
    id: member.id || member.memberId || member.userId || member.sub || '',
    email: member.email || member.username || member.preferredUsername || '',
    firstName: member.firstName || member.given_name || member.givenName || '',
    lastName: member.lastName || member.family_name || member.familyName || '',
    phone: member.phone || member.phoneNumber || '',
    memberType: normalizeMemberType(member),
    memberCode: member.memberCode || member.code || member.member_code || '',
    borrowingLimit: member.borrowingLimit ?? member.loanLimit ?? member.maxBorrowLimit ?? null,
    loanPeriodDays: member.loanPeriodDays ?? member.defaultLoanDays ?? null,
    outstandingBalance: member.outstandingBalance ?? member.balance ?? 0,
    avatarKey: member.avatarKey || member.avatarUrl || '',
    status: normalizeStatus(member),
    roles: [...new Set(roles.map(normalizeRoleName).filter(Boolean))],
  }
}

export function normalizeMemberList(data) {
  if (!Array.isArray(data)) return []
  return data.map((item) => normalizeMemberProfile(item)).filter(Boolean)
}
