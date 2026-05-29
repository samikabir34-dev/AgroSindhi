import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, languageNames, type Language } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
    className?: string;
    variant?: 'default' | 'compact' | 'dropdown';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    className = '',
    variant = 'default'
}) => {
    const { language, setLanguage, isRTL, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
        { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇵🇰' },
        { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
    ];

    const currentLang = languages.find(l => l.code === language);

    if (variant === 'compact') {
        return (
            <div className={cn("relative", className)}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[rgba(21,32,43,0.8)]/[0.04] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.15] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-white/60">{currentLang?.flag}</span>
                    <ChevronDown className={cn(
                        "w-3 h-3 text-white/30 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )} />
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className={cn(
                            "absolute top-full mt-2 z-50 min-w-[160px] py-2 bg-midnight/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl shadow-black/30 animate-fade-in-scale",
                            isRTL ? "left-0" : "right-0"
                        )}>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 hover:bg-blue-500/5",
                                        language === lang.code && "bg-blue-500/10 text-blue-500"
                                    )}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <div className={cn("flex-1 text-left", isRTL && "text-right")}>
                                        <span className={cn(
                                            "font-medium",
                                            language === lang.code ? "text-blue-500" : "text-white/60"
                                        )}>{lang.nativeName}</span>
                                    </div>
                                    {language === lang.code && (
                                        <Check className="w-4 h-4 text-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }

    if (variant === 'dropdown') {
        return (
            <div className={cn("relative", className)}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(21,32,43,0.8)]/[0.04] border border-white/[0.08] hover:border-white/[0.15] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group"
                >
                    <Globe className="w-4 h-4 text-blue-500 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-semibold text-white/60">{currentLang?.nativeName}</span>
                    <ChevronDown className={cn(
                        "w-4 h-4 text-blue-500 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )} />
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className={cn(
                            "absolute top-full mt-2 z-50 min-w-[200px] py-2 bg-midnight/98 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/30 animate-fade-in-scale overflow-hidden",
                            isRTL ? "left-0" : "right-0"
                        )}>
                            <div className="px-4 py-2 border-b border-white/[0.06]">
                                <p className={cn(
                                    "text-xs font-bold text-white/20 uppercase tracking-widest",
                                    isRTL && "text-right"
                                )}>
                                    {t('common.language')}
                                </p>
                            </div>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-blue-500/5",
                                        language === lang.code && "bg-blue-500/10"
                                    )}
                                >
                                    <span className="text-xl">{lang.flag}</span>
                                    <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                                        <p className={cn(
                                            "text-sm font-semibold",
                                            language === lang.code ? "text-blue-500" : "text-white/60"
                                        )}>{lang.nativeName}</p>
                                        <p className="text-xs text-white/25">{lang.name}</p>
                                    </div>
                                    {language === lang.code && (
                                        <div className="p-1 rounded-full bg-blue-500/10">
                                            <Check className="w-4 h-4 text-blue-500" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Default variant - button group
    return (
        <div className={cn(
            "flex items-center gap-1 p-1 bg-[rgba(21,32,43,0.8)]/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl shadow-sm",
            className
        )}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300",
                        language === lang.code
                            ? "bg-gradient-to-r from-blue-500 to-blue-500 text-foreground shadow-md shadow-blue-600/20"
                            : "text-white/40 hover:bg-[rgba(21,32,43,0.8)]/[0.04]"
                    )}
                    title={lang.name}
                >
                    <span>{lang.flag}</span>
                    <span className="hidden sm:inline">{lang.nativeName}</span>
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
