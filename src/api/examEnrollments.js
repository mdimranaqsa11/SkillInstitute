import { api } from './client';

export const listExamEnrollments = exam_id => api.get(`/exams/${exam_id}/enrollments`);
export const enrollStudentInExam = (exam_id, student_id) =>
  api.post(`/exams/${exam_id}/enrollments`, { student_id });
export const cancelExamEnrollment = enrollment_id => api.del(`/exam-enrollments/${enrollment_id}`);
