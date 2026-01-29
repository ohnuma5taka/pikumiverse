import _ from 'lodash';

const createLink = (blob: Blob, fileName: string) => {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadExcel = (buffer: ArrayBuffer, fileName: string) => {
  const blob = new Blob([buffer], { type: 'file/xlsx' });
  createLink(blob, fileName);
};

const extractFilename = (disposition: string | null) => {
  let filename = 'data';
  if (!disposition || disposition.indexOf('attachment') === -1) return filename;
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(disposition);
  if (matches != null && matches[1]) {
    filename = matches[1].replace(/['"]/g, '');
  }
  return decodeURI(filename);
};

export const fileUtil = {
  downloadExcel,
  extractFilename,
};
