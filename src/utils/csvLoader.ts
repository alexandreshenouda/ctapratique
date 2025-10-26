// Import the auto-generated documents data
import { loadDocuments as loadGeneratedDocuments, DocumentData } from '../data/documents';

export interface DocumentGroup {
  id: string;
  documents: DocumentData[];
  isGroup: true;
  // Use first document's properties for display
  title: string;
  category: string;
  subCategory?: string;
  type: string;
  description: string;
  iconType: 'external' | 'download';
  color: string;
}

export interface SubCategoryGroup {
  id: string;
  subCategory: string;
  category: string;
  documents: DocumentData[];
  isSubCategory: true;
  color: string;
  count: number;
}

export interface DocumentItem {
  id: string;
  isGroup: false;
  title: string;
  category: string;
  subCategory?: string;
  type: string;
  year?: string;
  description: string;
  url?: string;
  iconType: 'external' | 'download';
  color: string;
}

export interface CategoryGroup {
  id: string;
  category: string;
  isCategory: true;
  color: string;
  count: number;
  icon: string;
}

export interface CategoryInfo {
  key: string;
  title: string;
  icon: string;
  color: string;
  count: number;
}

export type DocumentOrGroup = DocumentGroup | DocumentItem | SubCategoryGroup | CategoryGroup;

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
        subCategory: firstDoc.subCategory,
        type: `${docs.length} documents`,
        description: `${docs.length} documents disponibles`,
        iconType: firstDoc.iconType,
        color: firstDoc.color
      } as DocumentGroup);
    }
  });
  
  return result;
}

// Icon mapping for categories
const categoryIconMap: { [key: string]: string } = {
  'URPS': 'business',
  'COVID': 'shield-checkmark',
  'Guides': 'book',
  'Certification': 'ribbon',
  'Congrès': 'people',
  'Articles': 'newspaper',
  'Fiches': 'documents',
  'Surveillance': 'eye',
  'Spécialisations': 'medical',
  'Déchets': 'trash',
  'Contrôles': 'checkmark-circle',
  'Réglementation': 'document-text',
  'International': 'globe',
  'Médias': 'play-circle',
  'Partenaires': 'handshake',
};

// Get all available categories with their document counts
export function loadCategories(): CategoryGroup[] {
  const documents = loadDocuments();
  const categoryMap = new Map<string, { docs: DocumentData[], color: string }>();
  
  documents.forEach(doc => {
    if (!categoryMap.has(doc.category)) {
      categoryMap.set(doc.category, { docs: [], color: doc.color });
    }
    categoryMap.get(doc.category)!.docs.push(doc);
  });
  
  const categories: CategoryGroup[] = [];
  categoryMap.forEach((data, categoryName) => {
    categories.push({
      id: `cat-${categoryName}`,
      category: categoryName,
      isCategory: true,
      color: data.color,
      count: data.docs.length,
      icon: categoryIconMap[categoryName] || 'folder'
    });
  });
  
  return categories;
}

// Get category info for the filter chips
export function getCategoryInfoList(): CategoryInfo[] {
  const documents = loadDocuments();
  const categoryMap = new Map<string, { color: string, count: number }>();
  
  documents.forEach(doc => {
    if (!categoryMap.has(doc.category)) {
      categoryMap.set(doc.category, { color: doc.color, count: 0 });
    }
    categoryMap.get(doc.category)!.count++;
  });
  
  const categories: CategoryInfo[] = [
    {
      key: 'Tous',
      title: 'Tous',
      icon: 'apps',
      color: '#007AFF',
      count: documents.length
    }
  ];
  
  categoryMap.forEach((data, categoryName) => {
    categories.push({
      key: categoryName,
      title: categoryName,
      icon: categoryIconMap[categoryName] || 'folder',
      color: data.color,
      count: data.count
    });
  });
  
  return categories;
}

// Group documents by sub-category within a category
export function loadDocumentsBySubCategory(category: string): DocumentOrGroup[] {
  const documents = loadDocuments();
  
  // Filter by category
  const filteredDocs = documents.filter(doc => doc.category === category);
  
  // First, group by ID (for duplicate documents)
  const groupedByIdMap = new Map<string, DocumentData[]>();
  filteredDocs.forEach(doc => {
    if (!groupedByIdMap.has(doc.id)) {
      groupedByIdMap.set(doc.id, []);
    }
    groupedByIdMap.get(doc.id)!.push(doc);
  });
  
  // Convert ID groups to items or document groups
  const itemsOrGroups: DocumentOrGroup[] = [];
  groupedByIdMap.forEach((docs, id) => {
    if (docs.length === 1) {
      const doc = docs[0];
      itemsOrGroups.push({
        ...doc,
        isGroup: false
      } as DocumentItem);
    } else {
      const firstDoc = docs[0];
      itemsOrGroups.push({
        id,
        documents: docs,
        isGroup: true,
        title: firstDoc.title,
        category: firstDoc.category,
        subCategory: firstDoc.subCategory,
        type: `${docs.length} documents`,
        description: `${docs.length} documents disponibles`,
        iconType: firstDoc.iconType,
        color: firstDoc.color
      } as DocumentGroup);
    }
  });
  
  // Now group by sub-category
  const subCategoryMap = new Map<string, DocumentOrGroup[]>();
  const noSubCategoryItems: DocumentOrGroup[] = [];
  
  itemsOrGroups.forEach(item => {
    const subCat = 'subCategory' in item ? item.subCategory : undefined;
    
    if (subCat) {
      if (!subCategoryMap.has(subCat)) {
        subCategoryMap.set(subCat, []);
      }
      subCategoryMap.get(subCat)!.push(item);
    } else {
      noSubCategoryItems.push(item);
    }
  });
  
  // Build the result: sub-category groups first, then items without sub-category
  const result: DocumentOrGroup[] = [];
  
  // Add sub-category groups
  subCategoryMap.forEach((items, subCat) => {
    const firstItem = items[0];
    const color = 'color' in firstItem ? firstItem.color : '#000000';
    const categoryName = 'category' in firstItem ? firstItem.category : category;
    
    // Get all documents from this sub-category (including documents in groups)
    const allDocs: DocumentData[] = [];
    items.forEach(item => {
      if ('isGroup' in item && item.isGroup) {
        allDocs.push(...item.documents);
      } else if ('isGroup' in item && !item.isGroup) {
        allDocs.push(item as DocumentData);
      }
    });
    
    result.push({
      id: `subcat-${categoryName}-${subCat}`,
      subCategory: subCat,
      category: categoryName,
      documents: allDocs,
      isSubCategory: true,
      color,
      count: allDocs.length
    } as SubCategoryGroup);
  });
  
  // Add items without sub-category directly
  result.push(...noSubCategoryItems);
  
  return result;
}

export type { DocumentData };