// Import the auto-generated documents data
import { loadDocuments as loadGeneratedDocuments, DocumentData } from '../data/documents';

export function loadDocuments(): DocumentData[] {
  // Simply return the data from the generated file
  // This file is automatically updated when you run: node scripts/generateDocuments.js
  return loadGeneratedDocuments();
}

export type { DocumentData };