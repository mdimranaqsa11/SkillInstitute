import { api } from './client';

// `thumbnail` is an optional asset picked via react-native-image-picker
// ({ uri, type, fileName }); omit it to leave the existing thumbnail untouched.
function buildCourseForm(fields, thumbnail) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value));
  });
  if (thumbnail) {
    form.append('thumbnail', {
      uri: thumbnail.uri,
      type: thumbnail.type || 'image/jpeg',
      name: thumbnail.fileName || 'thumbnail.jpg',
    });
  }
  return form;
}

export const createCourse = (fields, thumbnail) => api.postForm('/courses', buildCourseForm(fields, thumbnail));
export const listCourses = (page = 1, page_size = 20) => api.get('/courses', { page, page_size });
export const getCourse = course_id => api.get(`/courses/${course_id}`);
// Aggregate view: course + category_name + modules (with lessons, with resources) + exams (with question_count).
export const getCourseDetail = course_id => api.get(`/courses/${course_id}/detail`);
export const updateCourse = (course_id, fields, thumbnail) =>
  api.putForm(`/courses/${course_id}`, buildCourseForm(fields, thumbnail));
export const publishCourse = course_id => api.post(`/courses/${course_id}/publish`);
export const archiveCourse = course_id => api.post(`/courses/${course_id}/archive`);
export const deleteCourse = course_id => api.del(`/courses/${course_id}`);
