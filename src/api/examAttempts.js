import { api } from './client';

// Institute-facing grading view — always shows real scores regardless of show_result_immediately.
export const getAttemptDetails = attempt_id => api.get(`/exam-attempts/${attempt_id}/details`);
