import api from './api';

export interface UploadedFile {
  id?: number;
  filename?: string;
  url?: string;
}

// Завантаження файлу (multipart/form-data). Адресу й поле адаптуйте до файлового сервісу API.
export const filesService = {
  upload: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    // Content-Type не задаємо вручну: браузер сам додасть boundary
    const { data } = await api.post<UploadedFile>('/files/upload', form, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },
};
