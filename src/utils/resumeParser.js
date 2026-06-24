import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}

async function readPdfFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    pages.push(pageText);
  }

  return pages.join('\n');
}

function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to encode file.'));
    reader.readAsDataURL(file);
  });
}

export const LOADING_STEPS = [
  'Reading resume text...',
  'Extracting engineering keywords...',
  'Recalculating university matches...',
];

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseResumeFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt') {
    return readTextFile(file);
  }

  if (extension === 'pdf') {
    return readPdfFile(file);
  }

  throw new Error('Unsupported file type. Please upload a .pdf or .txt resume.');
}

export async function processResumeUpload(file, onStepChange) {
  const totalDuration = 2000;
  const stepDuration = totalDuration / LOADING_STEPS.length;
  const startTime = Date.now();

  const parsePromise = parseResumeFile(file).catch((error) => {
    throw error;
  });

  for (let i = 0; i < LOADING_STEPS.length; i++) {
    onStepChange(i);
    const elapsed = Date.now() - startTime;
    const targetElapsed = (i + 1) * stepDuration;
    const waitMs = Math.max(0, targetElapsed - elapsed);
    await delay(waitMs);
  }

  const [text, dataUrl] = await Promise.all([parsePromise, readDataUrl(file)]);

  if (!text || !text.trim()) {
    throw new Error('No readable text found in the uploaded document.');
  }

  return {
    text: text.trim(),
    fileName: file.name,
    dataUrl,
  };
}
