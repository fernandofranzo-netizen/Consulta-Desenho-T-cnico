export type DocumentCategory = string;

export const DEFAULT_TECHNICAL_CATEGORIES: DocumentCategory[] = [
  'Administração',
  'Almoxarifado',
  'Área Externa',
  'Central Água Gelada',
  'Central Ar Comprimido',
  'Estoque',
  'Kampf I',
  'Kampf II',
  'Rotomec',
  'Sistema Combate à Incêndio',
  'Subestação',
  'Varex I',
  'Varex II',
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
