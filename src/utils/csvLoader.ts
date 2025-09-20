// Import the auto-generated documents data
import { loadDocuments as loadGeneratedDocuments, DocumentData } from '../data/documents';

export interface DocumentGroup {
  id: string;
  documents: DocumentData[];
  isGroup: true;
  // Use first document's properties for display
  title: string;
  category: string;
  type: string;
  description: string;
  iconType: 'external' | 'download';
  color: string;
}

export interface DocumentItem {
  id: string;
  isGroup: false;
  title: string;
  category: string;
  type: string;
  year?: string;
  description: string;
  url?: string;
  iconType: 'external' | 'download';
  color: string;
}

export type DocumentOrGroup = DocumentGroup | DocumentItem;

export function loadDocuments(): DocumentData[] {
  // Simply return the data from the generated file
  // This file is automatically updated when you run: node scripts/generateDocuments.js
  return loadGeneratedDocuments();
}

export function loadDocumentsGrouped(): DocumentOrGroup[] {
  const documents = loadDocuments();
  const groupedMap = new Map<string, DocumentData[]>();
  
  // Group documents by ID
  documents.forEach(doc => {
    if (!groupedMap.has(doc.id)) {
      groupedMap.set(doc.id, []);
    }
    groupedMap.get(doc.id)!.push(doc);
  });
  
  // Convert to DocumentOrGroup array
  const result: DocumentOrGroup[] = [];
  
  groupedMap.forEach((docs, id) => {
    if (docs.length === 1) {
      // Single document - convert to DocumentItem
      const doc = docs[0];
      result.push({
        ...doc,
        isGroup: false
      } as DocumentItem);
    } else {
      // Multiple documents - create a group
      const firstDoc = docs[0];
      result.push({
        id,
        documents: docs,
        isGroup: true,
        title: firstDoc.title,
        category: firstDoc.category,
        type: `${docs.length} documents`,
        description: `${docs.length} documents disponibles`,
        iconType: firstDoc.iconType,
        color: firstDoc.color
      } as DocumentGroup);
    }
  });
  
  return result;
}

export type { DocumentData };