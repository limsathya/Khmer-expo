/**
 * Enterprise RBAC & Capability Permissions for EXPO Week 2026
 * Integrates with lib/auth-service.js
 */

import { hasPermission, Permission, normalizeRole, canManageCommittee } from './auth-service';
import { UserRole } from './schemas';

export { Permission, UserRole };

/**
 * Checks if user belongs to the Reception & Protocol subcommittee
 */
export function isReceptionAndProtocol(user) {
  if (!user) return false;
  const comm = String(user.committee || '').toLowerCase();
  const uname = String(user.username || '').toLowerCase();
  return (
    comm.includes('reception') ||
    comm.includes('protocol') ||
    comm.includes('បដិសណ្ឋារកិច្ច') ||
    comm.includes('ពិធីការ') ||
    comm.includes('礼宾') ||
    comm.includes('sub_protocol') ||
    uname === 'sarah_lin'
  );
}

/**
 * Checks if user belongs to the Executive Central Committee (Super Admin)
 */
export function isCentralCommittee(user) {
  if (!user) return false;
  const role = normalizeRole(user.role);
  if (role === UserRole.SUPER_ADMIN) return true;

  const comm = String(user.committee || '').toLowerCase();
  const uname = String(user.username || '').toLowerCase();
  return (
    comm.includes('central') ||
    comm.includes('កណ្តាល') ||
    comm.includes('中央') ||
    comm.includes('executive steering') ||
    uname === 'admin'
  );
}

/**
 * Checks if user has global administrative authority across all modules
 */
export function canManageEverything(user) {
  if (!user) return false;
  return isCentralCommittee(user) || isReceptionAndProtocol(user);
}

/**
 * Checks if user has authorization to triage or modify a specific event
 */
export function canManageEvent(user, event) {
  if (!user) return false;
  if (canManageEverything(user)) return true;

  // Use capability permission check
  if (!hasPermission(user, Permission.EVENTS_EDIT)) return false;

  const eventComm = event?.subCommittee || event?.committee_id;
  return canManageCommittee(user, eventComm);
}
