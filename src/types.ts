export type DocumentCategory = string;

/**
 * Validates whether a category name consists exclusively of uppercase letters.
 * Categories with lowercase letters are strictly rejected and removed.
 */
export function isUpperCaseCategory(catName: string): boolean {
  if (!catName) return false;
  if (catName === 'Todos' || catName === 'TODOS') return true;
  const letters = catName.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  return letters.length > 0 && letters === letters.toUpperCase();
}

export const DEFAULT_TECHNICAL_CATEGORIES: DocumentCategory[] = [
  'KAMPF I',
  'KAMPF II',
  'ROTOMEC',
  'SUBESTAÇÃO',
  'VAREX I',
  'VAREX II',
];

export const TECHNICAL_CATEGORIES = DEFAULT_TECHNICAL_CATEGORIES;

export type DocumentType = 'drawing' | 'photo';

export type DocumentStatus = 'Aprovado' | 'Em Revisão' | 'Para Execução' | 'As-Built';

export interface Annotation {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  text: string;
  author: string;
  date: string;
  type?: 'cota' | 'nota' | 'alerta' | 'revisao';
}

export interface TechnicalDocument {
  id: string;
  code: string;
  title: string;
  description: string;
  category: DocumentCategory;
  subcategory?: string;
  type: DocumentType;
  discipline: string;
  revision: string;
  date: string;
  author: string;
  approver: string;
  scale: string;
  status: DocumentStatus;
  format: 'SVG Vector HD' | 'Hi-Res Raster' | 'DWG Render' | 'PDF Técnico';
  fileSize: string;
  resolution: string;
  isOfflineCached: boolean;
  equipmentCode: string;
  tags: string[];
  specs: Record<string, string>;
  notes: string[];
  annotations: Annotation[];
  svgContent?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  driveFolderId?: string;
  driveSubfolderName?: string;
  driveFolderPath?: string;
  isPdf?: boolean;
  fileMimeType?: string;
  pdfPreviewUrl?: string;
}

export interface SubcategoryItem {
  name: string;
  count: number;
  folderId?: string;
  category: string;
}

export interface CategoryHierarchyItem {
  name: string;
  count: number;
  folderId?: string;
  subcategories: SubcategoryItem[];
}

export interface FilterState {
  searchQuery: string;
  category: DocumentCategory | 'Todos';
  subcategory?: string | 'all';
  type: DocumentType | 'all';
  status: DocumentStatus | 'all';
  onlyOffline: boolean;
  sortBy: 'code' | 'date' | 'title' | 'revision';
  sortOrder: 'asc' | 'desc';
}

export type ViewerTheme = 'white' | 'dark' | 'blueprint';
