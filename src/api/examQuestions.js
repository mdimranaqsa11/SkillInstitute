import { api } from './client';

export const createQuestion = (exam_id, payload) => api.post(`/exams/${exam_id}/questions`, payload);
export const listQuestions = exam_id => api.get(`/exams/${exam_id}/questions`);
export const updateQuestion = (question_id, payload) => api.put(`/questions/${question_id}`, payload);
export const deleteQuestion = question_id => api.del(`/questions/${question_id}`);

export const createOption = (question_id, payload) =>
  api.post(`/questions/${question_id}/options`, payload);
export const updateOption = (option_id, payload) => api.put(`/options/${option_id}`, payload);
export const deleteOption = option_id => api.del(`/options/${option_id}`);
