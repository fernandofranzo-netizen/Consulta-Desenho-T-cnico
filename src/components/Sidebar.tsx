import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FolderOpen,
  X, 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  Factory, 
  Flame, 
  Wind, 
  Snowflake, 
  Boxes, 
  Archive, 
  Trees, 
  Sliders, 
  Printer, 
  Zap, 
  RefreshCw, 
  Cloud, 
  CloudCheck, 
  CornerDownRight, 
  FileText,
  Sun,
  Moon
} from 'lucide-react';
import { 
  DocumentCategory, 
  FilterState, 
  SubcategoryItem 
} from '../types';

export interface CategoryWithSubcategories {
  name: DocumentCategory | 'Todos';
  count: number;
  subcategories?: SubcategoryItem[];
}

interface SidebarProps {
  categories: CategoryWithSubcategories[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  cachedCount: number;
  totalCount: number;
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenDriveModal?: () => void;
  isDriveConnected?: boolean;
  isAutoSyncing?: boolean;
  onTriggerSync?: () => void;
  lastSyncTime?: string | null;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Todos': <Folder className="w-4 h-4" />,
  'Administração': <Factory className="w-4 h-4" />,
  'Almoxarifado': <Archive className="w-4 h-4" />,
  'Área Externa': <Trees className="w-4 h-4" />,
  'Central Água Gelada': <Snowflake className="w-4 h-4" />,
  'Central Ar Comprimido': <Wind className="w-4 h-4" />,
  'Estoque': <Boxes className="w-4 h-4" />,
  'Kampf I': <Sliders className="w-4 h-4" />,
  'Kampf II': <Sliders className="w-4 h-4" />,
  'Rotomec': <Printer className="w-4 h-4" />,
  'Sistema Combate à Incêndio': <Flame className="w-4 h-4" />,
  'Subestação': <Zap className="w-4 h-4" />,
  'Varex I': <Factory className="w-4 h-4" />,
  'Varex II': <Factory className="w-4 h-4" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  cachedCount,
  totalCount,
  isOpen,
  onCloseMobile,
  onOpenDriveModal,
  isDriveConnected,
  isAutoSyncing,
  onTriggerSync,
  lastSyncTime,
  isDarkMode,
  onToggleDarkMode,
}) => {
  // State to track which categories are expanded in the menu
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Auto-expand active category
  useEffect(() => {
    if (filters.category && filters.category !== 'Todos') {
      setExpandedCategories((prev) => ({
        ...prev,
        [filters.category]: true,
      }));
    }
  }, [filters.category]);

  const toggleCategoryExpand = (catName: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const hasActiveFilters = 
    filters.category !== 'Todos' ||
    (filters.subcategory && filters.subcategory !== 'all') ||
    filters.searchQuery.trim().length > 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200/80 dark:border-zinc-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header of Sidebar */}
        <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Navegação & Filtros
            </h2>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Limpar
            </button>
          )}

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Categories and Filters Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* 1. Categorias Principais e Subcategorias Sincronizadas com o Drive */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Categorias do Drive
                </span>
                {isDriveConnected && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isAutoSyncing ? 'animate-ping' : ''}`} />
                    Drive
                  </span>
                )}
              </div>

              {isDriveConnected ? (
                <button
                  onClick={onTriggerSync}
                  disabled={isAutoSyncing}
                  title={isAutoSyncing ? 'Sincronizando pastas e subpastas...' : `Sincronizar categorias agora (Última: ${lastSyncTime || 'recente'})`}
                  className="p-1 rounded text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAutoSyncing ? 'animate-spin text-blue-500' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={onOpenDriveModal}
                  title="Conectar Google Drive para sincronizar as pastas e subpastas automaticamente"
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Cloud className="w-3 h-3" />
                  <span>Conectar</span>
                </button>
              )}
            </div>

            {/* Folder connection banner */}
            <div className="px-2 mb-2.5">
              {!isDriveConnected ? (
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 mb-1">
                    <Cloud className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                    <span>Conectar Google Drive</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mb-2 leading-tight">
                    Pasta: <strong>"CONSULTA IMAGENS E DESENHO TÉCNICO"</strong>. Conecte sua conta para buscar os arquivos reais do Drive.
                  </p>
                  <button
                    onClick={onOpenDriveModal}
                    className="w-full py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Cloud className="w-3 h-3" />
                    <span>Conectar e Buscar Arquivos</span>
                  </button>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 flex items-center justify-between text-[11px]">
                  <div className="truncate flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                    <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate font-mono text-[10px] font-medium" title="CONSULTA IMAGENS E DESENHO TÉCNICO">
                      CONSULTA IMAGENS E DES...
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <CloudCheck className="w-3 h-3" />
                      {isAutoSyncing ? 'Buscando...' : 'Conectado'}
                    </span>
                    <button
                      onClick={onTriggerSync}
                      disabled={isAutoSyncing}
                      title="Sincronizar arquivos agora"
                      className="p-1 rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isAutoSyncing ? 'animate-spin text-blue-500' : ''}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Active Subcategory Chip if filtering by subcategory */}
            {filters.subcategory && filters.subcategory !== 'all' && (
              <div className="mx-2 mb-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between text-xs animate-in fade-in-50">
                <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 truncate">
                  <CornerDownRight className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div className="truncate">
                    <div className="text-[9px] uppercase font-bold text-blue-500">Subcategoria Ativa</div>
                    <div className="text-[11px] font-bold truncate">{filters.subcategory}</div>
                  </div>
                </div>
                <button
                  onClick={() => onFilterChange({ subcategory: 'all' })}
                  title="Ver todos os itens desta categoria"
                  className="p-1 text-blue-600 dark:text-blue-300 hover:bg-blue-200/60 dark:hover:bg-blue-900 rounded-md transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Categories & Subcategories Tree List */}
            <nav className="space-y-1">
              {categories.map((cat) => {
                const isAll = cat.name === 'Todos';
                const isCategoryActive = filters.category === cat.name;
                const hasSubcategories = !!cat.subcategories && cat.subcategories.length > 0;
                const isExpanded = expandedCategories[cat.name] ?? isCategoryActive;

                return (
                  <div key={cat.name} className="space-y-0.5">
                    {/* Main Category Row */}
                    <div
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition group ${
                        isCategoryActive && (!filters.subcategory || filters.subcategory === 'all')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <button
                        onClick={() => {
                          onFilterChange({ category: cat.name, subcategory: 'all' });
                          if (!isExpanded && hasSubcategories) {
                            toggleCategoryExpand(cat.name);
                          }
                          onCloseMobile();
                        }}
                        className="flex-1 flex items-center gap-2.5 truncate text-left cursor-pointer"
                      >
                        <span className={isCategoryActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}>
                          {CATEGORY_ICONS[cat.name] || <Folder className="w-4 h-4" />}
                        </span>
                        <span className="truncate">{cat.name}</span>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {/* File count pill */}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono-tech ${
                            isCategoryActive
                              ? 'bg-blue-200/60 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                              : cat.count > 0 
                              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold' 
                              : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400'
                          }`}
                        >
                          {cat.count}
                        </span>

                        {/* Chevron expand/collapse button if has subcategories */}
                        {hasSubcategories && (
                          <button
                            type="button"
                            onClick={(e) => toggleCategoryExpand(cat.name, e)}
                            title={isExpanded ? 'Recolher subcategorias' : `Ver ${cat.subcategories!.length} subcategorias`}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Subcategories (Subpastas do Drive) */}
                    {hasSubcategories && isExpanded && (
                      <div className="pl-5 pr-1 py-1 space-y-1 border-l-2 border-zinc-200 dark:border-zinc-800 ml-3.5 animate-in slide-in-from-top-1 duration-150">
                        {/* Option: All files in this category */}
                        <button
                          onClick={() => {
                            onFilterChange({ category: cat.name, subcategory: 'all' });
                            onCloseMobile();
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] transition text-left cursor-pointer ${
                            isCategoryActive && (!filters.subcategory || filters.subcategory === 'all')
                              ? 'bg-blue-100/70 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-semibold'
                              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span className="truncate">Todos da pasta ({cat.count})</span>
                          </div>
                        </button>

                        {/* Subfolder rows */}
                        {cat.subcategories!.map((sub) => {
                          const isSubActive = isCategoryActive && filters.subcategory === sub.name;
                          return (
                            <button
                              key={sub.name}
                              onClick={() => {
                                onFilterChange({ category: cat.name, subcategory: sub.name });
                                onCloseMobile();
                              }}
                              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] transition text-left cursor-pointer ${
                                isSubActive
                                  ? 'bg-blue-500 text-white font-semibold shadow-xs'
                                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <FolderOpen className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-amber-500'}`} />
                                <span className="truncate">{sub.name}</span>
                              </div>

                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-tech shrink-0 ml-1 ${
                                  isSubActive
                                    ? 'bg-white/20 text-white font-bold'
                                    : sub.count > 0
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium'
                                    : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400'
                                }`}
                              >
                                {sub.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span>Acervo Técnico Laminor</span>
            <span className="font-mono-tech">({totalCount})</span>
          </div>
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Noturno'}
              className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              aria-label="Alternar tema escuro/claro"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
