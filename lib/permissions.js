/**
 * Permissions & Access Control for EXPO Week 2026
 *
 * Rules:
 * 1. Central Committee (admin / គណៈកម្មការកណ្តាល / 中央委员会) has executive authority to manage everything.
 * 2. Subcommittee on Reception and Protocol (sub_protocol / អនុគណៈកម្មការបដិសណ្ឋារកិច្ច និងពិធីការ / 礼宾接待分委员会)
 *    CAN MANAGE EVERYTHING (super-administrative authority across all events, committees, and users).
 * 3. Other subcommittees: Their role is tied to their specific committee domain.
 *    They can review, approve, reject, edit, and create events for their respective subcommittee.
 */

export function isReceptionAndProtocol(user) {
  if (!user) return false;
  const comm = (user.committee || '').toLowerCase();
  const uname = (user.username || '').toLowerCase();
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

export function isCentralCommittee(user) {
  if (!user) return false;
  const comm = (user.committee || '').toLowerCase();
  const role = (user.role || '').toLowerCase();
  const uname = (user.username || '').toLowerCase();
  return (
    role === 'admin' ||
    comm.includes('central') ||
    comm.includes('កណ្តាល') ||
    comm.includes('中央') ||
    comm.includes('executive steering') ||
    uname === 'admin'
  );
}

export function canManageEverything(user) {
  return isCentralCommittee(user) || isReceptionAndProtocol(user);
}

export function canManageEvent(user, event) {
  if (!user) return false;
  if (canManageEverything(user)) return true;

  // Other subcommittees can manage events assigned to their committee
  const userComm = (user.committee || '').toLowerCase();
  const eventComm = (event?.subCommittee || '').toLowerCase();

  if (!eventComm) return true; // General unassigned events can be triaged

  return (
    userComm.includes(eventComm) ||
    eventComm.includes(userComm)
  );
}
