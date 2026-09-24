import React, { useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Menu, 
  Compass
} from 'lucide-react';
import { TechnicalDocument } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleMobileMenu: () => void;
  resultsCount: number;
  // Optional legacy props kept for flexible component signature
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isOnline?: boolean;
  isSimulatedOffline?: boolean;
  onToggleSimulatedOffline?: () => void;
  onCacheAll?: () => void;
  onOpenUploadModal?: () => void;
  onOpenDriveModal?: () => void;
  isDriveConnected?: boolean;
  driveUserEmail?: string | null;
  isAutoSyncing?: boolean;
  currentDocument?: TechnicalDocument | null;
  onExportCurrentPDF?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onToggleMobileMenu,
  resultsCount,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 px-4 flex items-center justify-between gap-3 z-30 shrink-0">
      {/* Left: Mobile Menu Toggle + App Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          aria-label="Abrir Menu Lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase font-mono-tech">
                TechView<span className="text-blue-600 dark:text-blue-400">·HD</span>
              </h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                CAD & FOTOS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-none hidden sm:block">
              Consulta Técnica de Engenharia
            </p>
          </div>
        </div>
      </div>

      {/* Center: Integrated Quick Access Search Bar */}
      <div className="flex-1 max-w-2xl mx-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por código (ex: DWG-104), título, equipamento, tag ou norma..."
            className="w-full text-xs pl-9 pr-20 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition shadow-2xs font-sans"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono-tech text-zinc-400 bg-zinc-200/60 dark:bg-zinc-700 rounded border border-zinc-300/60 dark:border-zinc-600">
                ⌘K
              </kbd>
            )}

            {searchQuery && (
              <span className="text-[10px] text-zinc-400 font-mono-tech px-1">
                {resultsCount} {resultsCount === 1 ? 'item' : 'itens'}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
