export const ROLES = {
  INSTITUTE_ADMIN: 'INSTITUTE_ADMIN',
  BRANCH_ADMIN: 'BRANCH_ADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  STAFF: 'STAFF',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
};

const CONTENT_WRITE_ROLES = [ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.CONTENT_MANAGER];
const AUDIT_ROLES = [ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN];

/** @param {{ role: string, institute_type?: string }} user */
export function can(user, action) {
  if (!user) return false;
  switch (action) {
    case 'manageBranches':
      return user.role === ROLES.INSTITUTE_ADMIN && user.institute_type === 'MAIN';
    case 'deleteInstitute':
      return user.role === ROLES.INSTITUTE_ADMIN && user.institute_type === 'MAIN';
    case 'writeContent': // categories, courses, modules, lessons, resources, exams, questions
      return CONTENT_WRITE_ROLES.includes(user.role);
    case 'manageEnrollments': // approve/reject requests
      return CONTENT_WRITE_ROLES.includes(user.role);
    case 'editInstituteProfile':
      return user.role === ROLES.INSTITUTE_ADMIN || user.role === ROLES.BRANCH_ADMIN;
    case 'viewAuditLogs':
      return AUDIT_ROLES.includes(user.role);
    default:
      return false;
  }
}
