import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Twitter, Youtube, Instagram, Github, Mail, Phone } from 'lucide-react';
import EarthLogo from './EarthLogo';

const Footer = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <footer
      className="relative pt-4 pb-4 overflow-hidden mt-6"
      style={{ position: 'relative', zIndex: 1 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* thin gradient separator line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(85,230,255,0.3), transparent)',
        }}
      />

      {/* Content container */}
      <div
        className="mx-auto px-4 sm:px-6"
        style={{ width: 'min(1220px, calc(100% - 28px))' }}
      >
        <div className="glass-section !py-4 !px-6 mb-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Brand logo & name */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
              onClick={() => navigate('/')}
            >
              <div
                className="w-9 h-9 flex items-center justify-center rounded-xl border"
                style={{
                  background: 'linear-gradient(135deg, rgba(85,230,255,0.13), rgba(141,124,255,0.13))',
                  borderColor: 'rgba(255,255,255,0.18)',
                  boxShadow: '0 0 16px rgba(85,230,255,0.12)',
                }}
              >
                <div className="scale-75">
                  <EarthLogo />
                </div>
              </div>
              <h2 className="text-lg font-black tracking-tighter">
                <span className="brand-name">سنڌاڳڙو</span>
              </h2>
            </div>

            {/* Center: Nav links in a row */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 z-50">
              {[
                { label: 'سنڌاڳڙو بابت', path: '/about-sindhagro' },
                { label: 'اداري بابت', path: '/about-institution' },
                { label: 'سنڌاڳڙو سٿ', path: '/team' },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="text-xs sm:text-sm font-semibold transition-all duration-300 hover:text-[#55e6ff]"
                  style={{ color: 'rgba(185,203,224,0.75)' }}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Right: Social & Contact row */}
            <div className="flex items-center gap-4 flex-wrap justify-center shrink-0">
              <div className="flex items-center gap-3 text-white/50 text-xs font-mono font-medium">
                <a href="mailto:info@ambile.pk" className="hover:text-[#55e6ff] transition-colors">info@ambile.pk</a>
                <span className="opacity-20">|</span>
                <span dir="ltr">+92 22 2108151</span>
              </div>

              <div className="flex gap-2">
                {[
                  { href: 'https://github.com/ambile-official', icon: Github },
                  { href: 'https://x.com/bhittaipedia', icon: Twitter },
                  { href: 'https://www.youtube.com/@AMBILE-Sindh', icon: Youtube },
                  { href: 'https://www.instagram.com/bhittaipedia5/', icon: Instagram },
                ].map(({ href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 text-white/30 hover:text-[#55e6ff] hover:border-[#55e6ff]/30 hover:bg-[#55e6ff]/10"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* simple centered copyright */}
      <div
        className="text-center py-2 px-4"
        style={{
          color: 'rgba(185,203,224,0.4)',
          fontSize: '0.75rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        © <span className="brand-name">سنڌاڳڙو</span> · All rights reserved — سنڌ جي زراعت لاءِ مصنوعي ذهانت ۽ سيٽلائيٽ ٻوٽو ذريعو.
      </div>
    </footer>
  );
};

export default Footer;
