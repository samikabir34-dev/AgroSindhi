import { useNavigate } from 'react-router-dom';
// FloatingElements now rendered globally in App.tsx
import Navbar from '@/components/Navbar';
import EarthLogo from '@/components/EarthLogo';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowRight,
  Sparkles,
  Star,
  Sprout,
  Droplets,
  Navigation,
  Brain,
  BookOpen,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParallax } from '@/hooks/useParallax';
import Footer from '@/components/Footer';
import '@/styles/footer-flip-card.css';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const parallaxOffset = useParallax(0.3);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      icon: Sprout,
      label: t('services.fieldAnalysis'),
      path: '/map',
      color: 'from-emerald-500 to-teal-400',
      glow: 'rgba(52,211,153,0.15)',
      border: 'rgba(52,211,153,0.25)',
    },
    {
      icon: Droplets,
      label: t('services.waterAnalysis'),
      path: '/water',
      color: 'from-cyan-500 to-blue-400',
      glow: 'rgba(34,211,238,0.15)',
      border: 'rgba(34,211,238,0.25)',
    },
    
    {
      icon: Navigation,
      label: t('services.savedFields'),
      path: '/saved-fields',
      color: 'from-pink-500 to-rose-400',
      glow: 'rgba(236,72,153,0.15)',
      border: 'rgba(236,72,153,0.25)',
    },
    // AI Assistant removed
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'radial-gradient(circle at 12% 14%, rgba(85,230,255,0.07) 0%, transparent 30%), radial-gradient(circle at 88% 8%, rgba(141,124,255,0.06) 0%, transparent 28%), linear-gradient(135deg, #071122, #0b1a3a)' }}>

      {/* Decorations are rendered globally */}
      <Navbar hideSearchBar={true} hideActionButtons={true} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-24 sm:pt-32 pb-16 px-4 sm:px-6 z-10">

        <div className="w-full max-w-[1220px] mx-auto relative z-10 flex flex-col items-center">
          <div className={`transform transition-all duration-1000 w-full ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            {/* ── HERO CARD (glass-section) ── */}
            <div
              className="w-full text-center mb-8 glass-section relative overflow-hidden"
              style={{
                padding: 'clamp(28px, 5vw, 56px)',
                marginTop: '90px',
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-[10%] right-[10%] h-[1px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(85,230,255,0.5), rgba(141,124,255,0.5), transparent)' }} />
              {/* Eyebrow badge */}
              <div
                className="inline-flex items-center gap-2 mb-6 px-5 py-2.5"
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                <span className="text-xs font-semibold uppercase tracking-widest">{t('home.badge')}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              </div>

              {/* Main Title */}
              <h1
                className="font-black mb-4 leading-none tracking-tight"
                style={{ fontSize: 'clamp(42px, 7vw, 82px)' }}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #55e6ff, #ffd166, #8d7cff)' }}
                >
                  {t('home.title')}
                </span>
              </h1>

              {/* Subtitles */}
              <div className="space-y-1 mb-5">
                <p
                  className="text-white/50 font-light"
                  style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', lineHeight: 1.8 }}
                >
                  {t('home.subtitle1')}
                </p>
                <p
                  className="font-black bg-clip-text text-transparent"
                  style={{
                    fontSize: 'clamp(22px, 3.5vw, 40px)',
                    backgroundImage: 'linear-gradient(90deg, #55e6ff, #8d7cff)',
                    lineHeight: 1.4,
                  }}
                >
                  {t('home.subtitle2')}
                </p>
              </div>

              {/* Description */}
              <p
                className="max-w-[1220px] mx-auto mb-8"
                style={{
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  lineHeight: 2,
                  color: 'rgba(185,203,224,1)',
                }}
              >
                {t('home.description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate('/map')}
                  className="btn-brand inline-flex items-center gap-2"
                  style={{ padding: '14px 28px', fontSize: '16px' }}
                >
                  <Sparkles className="w-5 h-5" />
                  {t('home.launchApp')}
                  <ArrowRight className="w-5 h-5" />
                </button>
                  {/* About button removed from homepage as requested */}
              </div>
            </div>

            {/* ── SERVICES GRID (glass-section cards) ── */}
            <div
              className="w-full mb-8 glass-section"
              style={{ padding: 'clamp(24px, 4vw, 44px)' }}
            >
              {/* Section Title */}
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-cyan)' }}>
                      اسان جون سهولتون
                    </span>
                    <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontFamily: 'var(--font-display)' }}>
                      موجود سهولتون
                    </h2>
                </div>
                <div className="accent-bar hidden sm:block" />
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-5 max-w-[640px] mx-auto">
                {services.map((svc, i) => (
                  <div key={i} className={`${(i === 2 && services.length % 2 === 1) ? 'col-span-2 flex justify-center' : ''}`}>
                    <button
                      onClick={() => svc.external ? window.open(svc.external, '_blank', 'noopener,noreferrer') : svc.path && navigate(svc.path)}
                      className="group glass-inner-card flex flex-col items-center gap-4 text-center cursor-pointer w-full max-w-[360px]"
                      style={{ padding: 'clamp(18px, 3vw, 28px)' }}
                    >
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${svc.glow}, transparent)`,
                          border: `1px solid ${svc.border}`,
                        }}
                      >
                        <svc.icon
                          className="w-6 h-6 sm:w-7 sm:h-7"
                          style={{ color: svc.border.replace('0.25', '0.9') }}
                        />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-white/80 group-hover:text-white transition-colors leading-tight">
                        {svc.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>



          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Index;
