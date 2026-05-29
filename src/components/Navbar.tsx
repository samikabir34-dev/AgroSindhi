import { useState } from 'react';
import { Search, Navigation, Satellite, Loader2, Square, Trash2, X, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import '../orbit-logo.css';
import EarthLogo from '@/components/EarthLogo';

interface NavbarProps {
  onSearch?: (query: string) => Promise<void>;
  onAnalyze?: () => void;
  onDrawPolygon?: () => void;
  onResetPolygon?: () => void;
  isAnalyzing?: boolean;
  canAnalyze?: boolean;
  hideActionButtons?: boolean;
  hideSearchBar?: boolean;
}

const Navbar = ({ onSearch, onAnalyze, onDrawPolygon, onResetPolygon, isAnalyzing, canAnalyze, hideActionButtons = false, hideSearchBar = false }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  const handleSearch = async () => {
    if (!searchQuery.trim() || !onSearch) return;
    setIsSearching(true);
    try {
      await onSearch(searchQuery);
      setIsMobileSearchOpen(false);
    } finally {
      setIsSearching(false);
    }
  };

  const navLinks = [
    { label: t('services.fieldAnalysis') || 'ٻني جو جائزو', path: '/map' },
    { label: t('services.waterAnalysis') || 'پاني جو جائزو', path: '/water' },
    { label: t('services.savedFields') || 'محفوظ ٿيل ٻنيون', path: '/saved-fields' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isMapPage = location.pathname === '/map' || location.pathname.startsWith('/map');
  const showActionButtons = !hideActionButtons && isMapPage && (!!onDrawPolygon || !!onResetPolygon || !!onAnalyze);
  const showSearchBar = !hideSearchBar;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        // Floating container style like sindhilanguage.org
        "flex items-center px-3 sm:px-4"
      )}
      style={{ paddingTop: '14px' }}
    >
      <div
        className="w-full max-w-[1220px] mx-auto flex items-center justify-between gap-3 px-3 sm:px-4 h-[62px]"
        style={{
          background: 'color-mix(in srgb, rgba(255,255,255,0.14) 72%, transparent)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '36px',
          boxShadow: '0 28px 90px rgba(0,0,0,0.42)',
        }}
      >
          {/* Logo: image + stacked title + subtitle */}
          <div
            className={cn(
              "flex items-center gap-3 shrink-0 cursor-pointer transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5",
              isMobileSearchOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}
            onClick={() => navigate('/')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl overflow-hidden border border-white/20 bg-white/10 shrink-0 shadow-[0_0_16px_rgba(85,230,255,0.15)]">
              <div className="w-7 h-7">
                <EarthLogo />
              </div>
            </div>
            <span className="flex flex-col leading-tight">
              <b className="text-white font-black text-xl sm:text-2xl tracking-tight font-display whitespace-nowrap"
                 style={{ textShadow: '0 0 20px rgba(85,230,255,0.3)' }}>
                <span className="brand-name">{t('common.appName')}</span>
              </b>
            </span>
          </div>

          {/* Center: Pill Nav Links (desktop only) */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="main navigation">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={cn(
                  "glass-pill-nav text-sm font-semibold transition-all duration-250 whitespace-nowrap",
                  isActive(link.path)
                    ? "!bg-gradient-to-r from-[#55e6ff22] to-[#8d7cff22] !border-[rgba(85,230,255,0.4)] !text-[#55e6ff] shadow-[0_0_18px_rgba(85,230,255,0.2)]"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>

        {/* Center: Search Bar (map page) */}
        {showSearchBar && (
          <div className={cn(
            "flex items-center justify-center transition-all duration-300",
            isMobileSearchOpen
              ? "absolute inset-0 px-3 z-50 h-full w-full rounded-[26px]"
              : "hidden lg:flex flex-1 max-w-md mx-4"
          )}
          style={isMobileSearchOpen ? { background: 'rgba(13,17,23,0.98)', backdropFilter: 'blur(22px)', borderRadius: '26px' } : {}}
          >
            <div className={cn("flex gap-2 w-full items-center", !isMobileSearchOpen && "hidden lg:flex")}>
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                <Input
                  type="text"
                  placeholder={t('common.searchLocation')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-white/[0.04] border-white/[0.10] focus:border-blue-500/40 text-sm h-10 transition-all rounded-full placeholder:text-white/20 font-medium text-white/80"
                  autoFocus={isMobileSearchOpen}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                size="sm"
                className="h-10 px-4 shrink-0 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500/20 hover:-translate-y-0.5 transition-all"
              >
                <Navigation className="w-4 h-4" />
              </Button>
              {isMobileSearchOpen && (
                <Button
                  onClick={() => setIsMobileSearchOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-full text-white/40 hover:text-white/70"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className={cn(
          "flex items-center gap-2 shrink-0 z-20 ml-auto transition-all duration-200",
          isMobileSearchOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}>

          {/* Mobile search toggle */}
          {showSearchBar && (
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="lg:hidden glass-pill-nav flex items-center justify-center w-10 h-10 !p-0"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Action Buttons: pill style */}
          {showActionButtons && (
            <div className="flex items-center gap-2">
              {/* Draw */}
              <button
                onClick={onDrawPolygon}
                className="flex items-center gap-2 glass-pill-nav text-xs sm:text-sm font-semibold whitespace-nowrap transition-all hover:-translate-y-0.5"
                aria-label={t('navbar.draw')}
              >
                <Square className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{t('navbar.draw')}</span>
              </button>

              {/* Reset */}
              <button
                onClick={onResetPolygon}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all hover:-translate-y-0.5 px-3 sm:px-4 py-2.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                aria-label={t('navbar.reset')}
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{t('navbar.reset')}</span>
              </button>

              {/* Analyze */}
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing || !canAnalyze}
                className={cn(
                  "flex items-center gap-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all px-3 sm:px-5 py-2.5 rounded-full border",
                  isAnalyzing || !canAnalyze
                    ? "opacity-50 cursor-not-allowed border-white/10 bg-white/5 text-white/30"
                    : "border-transparent bg-gradient-to-r from-blue-500 to-sky-400 text-white hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
                )}
              >
                {isAnalyzing
                  ? <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                  : <Satellite className="w-3.5 h-3.5 shrink-0" />
                }
                <span className="hidden sm:inline">{isAnalyzing ? t('navbar.scanning') : t('navbar.analyze')}</span>
                <span className="sm:hidden">{isAnalyzing ? '...' : t('navbar.analyze')}</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger for nav links */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden glass-pill-nav flex items-center justify-center w-10 h-10 !p-0"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="absolute top-[86px] left-3 right-3 lg:hidden z-50 flex flex-col gap-1 p-3"
          style={{
            background: 'rgba(13,17,23,0.97)',
            backdropFilter: 'blur(22px)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '20px',
            boxShadow: '0 28px 90px rgba(0,0,0,0.42)',
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
              className={cn(
                "text-right px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
                isActive(link.path)
                  ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
