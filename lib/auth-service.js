import crypto from 'crypto';
import { UserRole } from './schemas';

const AUTH_SECRET = process.env.AUTH_SECRET || 'expo_week_2026_bilateral_secret_key_prod';

/**
 * Granular Capability Permissions Matrix
 */
export const Permission = {
  // Events
  EVENTS_CREATE: 'events:create',
  EVENTS_EDIT: 'events:edit',
  EVENTS_APPROVE: 'events:approve',
  EVENTS_DELETE: 'events:delete',
  EVENTS_PUBLISH: 'events:publish',

  // Registrations & Badges
  REGISTRATIONS_VIEW: 'registrations:view',
  REGISTRATIONS_TRIAGE: 'registrations:triage',
  REGISTRATIONS_CHECKIN: 'registrations:checkin',
  REGISTRATIONS_EXPORT: 'registrations:export',

  // Exhibitors & Booths
  BOOTHS_MANAGE: 'booths:manage',
  EXHIBITORS_APPROVE: 'exhibitors:approve',

  // Committees & Protocol
  COMMITTEES_MANAGE: 'committees:manage',
  PROTOCOL_VIP: 'protocol:vip',

  // System Administration
  SYSTEM_CONFIG: 'system:config',
  AUDIT_LOGS_VIEW: 'audit_logs:view',
};

const ROLE_PERMISSIONS = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  
  [UserRole.COMMITTEE_LEAD]: [
    Permission.EVENTS_CREATE,
    Permission.EVENTS_EDIT,
    Permission.EVENTS_APPROVE,
    Permission.REGISTRATIONS_VIEW,
    Permission.REGISTRATIONS_TRIAGE,
    Permission.REGISTRATIONS_CHECKIN,
    Permission.BOOTHS_MANAGE,
    Permission.PROTOCOL_VIP,
  ],

  [UserRole.COMMITTEE_MEMBER]: [
    Permission.EVENTS_CREATE,
    Permission.EVENTS_EDIT,
    Permission.REGISTRATIONS_VIEW,
    Permission.REGISTRATIONS_CHECKIN,
  ],

  [UserRole.EXHIBITOR_ADMIN]: [
    Permission.EVENTS_CREATE,
    Permission.REGISTRATIONS_VIEW,
  ],

  [UserRole.DELEGATE]: [
    Permission.REGISTRATIONS_VIEW,
  ],

  [UserRole.VISITOR]: [],
};

/**
 * Creates an HMAC signed session token with claims.
 */
export function createSessionToken(user, expiresInHours = 24) {
  const normalizedRole = normalizeRole(user.role);
  const permissions = ROLE_PERMISSIONS[normalizedRole] || [];

  const payload = {
    sub: user.id || user.username,
    username: user.username,
    name: user.name,
    role: normalizedRole,
    committee: user.committee || 'None',
    permissions,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (expiresInHours * 3600),
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadString)
    .digest('base64url');

  return `${payloadString}.${signature}`;
}

/**
 * Verifies an HMAC signed session token.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadString, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadString)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadString, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Normalizes legacy roles into UserRole enum values.
 */
export function normalizeRole(role) {
  if (!role) return UserRole.VISITOR;
  const lower = String(role).toLowerCase().trim();
  if (lower === 'admin' || lower === 'super_admin') return UserRole.SUPER_ADMIN;
  if (lower === 'sub_committee' || lower === 'committee_lead') return UserRole.COMMITTEE_LEAD;
  if (lower === 'member' || lower === 'committee_member') return UserRole.COMMITTEE_MEMBER;
  if (lower === 'exhibitor') return UserRole.EXHIBITOR_ADMIN;
  return UserRole.VISITOR;
}

/**
 * Check if a user possesses a specific permission.
 */
export function hasPermission(user, permission) {
  if (!user) return false;
  const role = normalizeRole(user.role);
  if (role === UserRole.SUPER_ADMIN) return true;
  const perms = user.permissions || ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

/**
 * Check if a user can manage a specific committee or domain.
 */
export function canManageCommittee(user, targetCommitteeId) {
  if (!user) return false;
  const role = normalizeRole(user.role);
  if (role === UserRole.SUPER_ADMIN) return true;

  if (role === UserRole.COMMITTEE_LEAD) {
    if (!targetCommitteeId) return true;
    const userComm = String(user.committee || '').toLowerCase();
    const target = String(targetCommitteeId).toLowerCase();
    return userComm.includes(target) || target.includes(userComm);
  }

  return false;
}
