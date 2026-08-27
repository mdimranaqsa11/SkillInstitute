import { colors } from '../constants';

const ACTION_META = {
  CREATE_EXAM: { icon: 'quiz', tint: colors.primary, verb: 'Exam created' },
  PUBLISH_EXAM: { icon: 'publish', tint: colors.secondary, verb: 'Exam published' },
  DELETE_EXAM: { icon: 'delete', tint: colors.error, verb: 'Exam deleted' },
  APPROVE_ENROLLMENT: { icon: 'person-add', tint: colors.success, verb: 'Enrollment approved' },
  REJECT_ENROLLMENT: { icon: 'person-remove', tint: colors.error, verb: 'Enrollment rejected' },
  SUBMIT_EXAM: { icon: 'assignment-turned-in', tint: colors.tertiary, verb: 'Exam submitted' },
};

export function describeAuditLog(log) {
  const meta = ACTION_META[log.action] || { icon: 'history', tint: colors.onSurfaceVariant, verb: log.action };
  const entity = log.entity_type ? `${log.entity_type} #${log.entity_id}` : '';
  const actor = log.actor_student_id ? `student #${log.actor_student_id}` : log.user_id ? `user #${log.user_id}` : 'system';
  return {
    icon: meta.icon,
    tint: meta.tint,
    title: entity ? `${meta.verb} — ${entity}` : meta.verb,
    meta: `By ${actor}`,
  };
}
