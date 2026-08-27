import { api } from './client';

export const createExam = (course_id, payload) => api.post(`/courses/${course_id}/exams`, payload);
export const listCourseExams = course_id => api.get(`/courses/${course_id}/exams`);
export const getExam = exam_id => api.get(`/exams/${exam_id}`);
export const updateExam = (exam_id, payload) => api.put(`/exams/${exam_id}`, payload);
export const deleteExam = exam_id => api.del(`/exams/${exam_id}`);
export const publishExam = exam_id => api.post(`/exams/${exam_id}/publish`);
export const closeExam = exam_id => api.post(`/exams/${exam_id}/close`);
export const getExamStatistics = exam_id => api.get(`/exams/${exam_id}/statistics`);
export const getExamResults = exam_id => api.get(`/exams/${exam_id}/results`);
export const getExamAttempts = exam_id => api.get(`/exams/${exam_id}/attempts`);
