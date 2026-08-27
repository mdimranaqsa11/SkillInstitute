import { api } from './client';

// `file` is a document/image asset ({ uri, type, name }) picked on-device; the
// server infers resource_type (PDF/DOCUMENT/IMAGE/VIDEO/OTHER) from it.
export const createLessonResource = (lesson_id, name, file) => {
  const form = new FormData();
  form.append('name', name);
  form.append('file', {
    uri: file.uri,
    type: file.type || 'application/octet-stream',
    name: file.name || 'file',
  });
  return api.postForm(`/lessons/${lesson_id}/resources`, form);
};

// For a LINK-type resource pointing at an external URL instead of an uploaded file.
export const createLessonResourceLink = (lesson_id, name, url) =>
  api.post(`/lessons/${lesson_id}/resources/link`, { name, url });

export const listLessonResources = lesson_id => api.get(`/lessons/${lesson_id}/resources`);
export const deleteLessonResource = resource_id => api.del(`/resources/${resource_id}`);
