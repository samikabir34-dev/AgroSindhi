import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Leaf,
    Droplets,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    ChevronRight,
    Sparkles,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnalysisData {
    id: number;
    date: string;
    ndvi: number;
    ndre: number;
    ndwi: number;
    stats?: {
        cloudCover?: number;
        dataQuality?: string;
        season?: string;
    };
}

// === HEALTH SCORE RING ===
const HealthRing: React.FC<{ score: number }> = ({ score }) => {
    const size = 200;
    const strokeWidth = 16;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 70) return { main: '#34d399', bg: 'rgba(52,211,153,0.1)', shadow: 'rgba(52,211,153,0.3)' };
        if (s >= 50) return { main: '#fbbf24', bg: 'rgba(251,191,36,0.1)', shadow: 'rgba(251,191,36,0.3)' };
        return { main: '#f87171', bg: 'rgba(248,113,113,0.1)', shadow: 'rgba(248,113,113,0.3)' };
    };

    const colors = getColor(score);
    const status = score >= 70 ? 'Optimal' : score >= 50 ? 'Stable' : score >= 30 ? 'Attention' : 'Critical';

    return (
        <div className="flex flex-col items-center">
            <div className="relative group transition-transform duration-700 hover:scale-105" style={{ width: size, height: size }}>
                {/* Outer Glow */}
                <div
                    className="absolute inset-0 rounded-full blur-3xl opacity-15 transition-all duration-700 group-hover:opacity-30"
                    style={{ backgroundColor: colors.main }}
                />

                <svg className="transform -rotate-90 relative z-10" width={size} height={size}>
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.main} />
                            <stop offset="100%" stopColor={colors.main} stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke="url(#scoreGradient)" strokeWidth={strokeWidth} strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        className="transition-all duration-1500 ease-out"
                        style={{ filter: `drop-shadow(0 0 8px ${colors.shadow})` }}
                    />
                </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-6xl font-black text-white tracking-tighter">{Math.round(score)}</span>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">{''}</span>
                </div>
            </div>
            <div
                className="mt-8 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all duration-500 border"
                style={{ backgroundColor: colors.bg, color: colors.main, borderColor: `${colors.main}33` }}
            >
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.main }} />
                    {''}
                </span>
            </div>
        </div>
    );
};

// === INDEX CARD (Dark) ===
const IndexCard: React.FC<{
    label: string;
    value: number;
    icon: React.ElementType;
    color: string;
    glowColor: string;
    change?: number;
    description: string;
}> = ({ label, value, icon: Icon, color, glowColor, change, description }) => (
    <div className="glass-inner-card relative p-6 hover:scale-[1.02] transition-all duration-500 group overflow-hidden">
        <div className={cn("absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700", glowColor)} />

        <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-[rgba(21,32,43,0.8)]/[0.06] border border-white/[0.06]">
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            {change !== undefined && (
                <div className={cn(
                    "flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full border",
                    change >= 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                )}>
                    {change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {Math.abs(change).toFixed(1)}%
                </div>
            )}
        </div>

        <div className="relative z-10">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-4xl font-black font-mono tracking-tighter mb-2" style={{ color }}>{value.toFixed(3)}</p>
            <p className="text-[11px] font-medium text-white/25 leading-relaxed">{description}</p>
        </div>
    </div>
);

// === INSIGHT SECTION (Dark) ===
const InsightSection: React.FC<{
    title: string;
    icon: React.ElementType;
    iconColor: string;
    items: string[];
    emptyText?: string;
    numbered?: boolean;
}> = ({ title, icon: Icon, iconColor, items, emptyText, numbered }) => (
    <div className="glass-inner-card p-8 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 rounded-2xl bg-[rgba(21,32,43,0.8)]/[0.06] border border-white/[0.06]">
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
                <div>
                <h3 className="text-sm font-black text-white/80 uppercase tracking-widest">{title}</h3>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{''}</p>
            </div>
            <span className="ml-auto text-[10px] font-black text-white/20 bg-[rgba(21,32,43,0.8)]/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
                {items.length}
            </span>
        </div>

        {items.length > 0 ? (
            <ul className="space-y-4 relative z-10">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group/item">
                        {numbered ? (
                            <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 bg-[rgba(21,32,43,0.8)]/[0.06] border border-white/[0.06]" style={{ color: iconColor }}>
                                {i + 1}
                            </span>
                        ) : (
                            <div className="mt-1.5 shrink-0">
                                <div className="w-2 h-2 rounded-full group-hover/item:scale-150 transition-transform duration-300" style={{ backgroundColor: iconColor }} />
                            </div>
                        )}
                        <span className="text-sm text-white/50 leading-relaxed font-medium">{item}</span>
                    </li>
                ))}
            </ul>
            ) : (
            <div className="text-center py-8 relative z-10">
                <p className="text-sm text-white/20 italic bg-[rgba(21,32,43,0.8)]/[0.02] rounded-2xl py-4 border border-white/[0.04]">{emptyText || ''}</p>
            </div>
        )}
    </div>
);

// === CONTRIBUTION BAR (Dark) ===
const ContributionBar: React.FC<{
    items: { label: string; value: number; percentage: number; color: string; darkColor: string }[];
}> = ({ items }) => (
    <div className="glass-inner-card p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
            <h3 className="text-sm font-black text-white/80 uppercase tracking-widest">{''}</h3>
        </div>

        {/* Stacked bar */}
        <div className="h-6 bg-[rgba(21,32,43,0.8)]/[0.04] rounded-2xl overflow-hidden flex mb-8 p-1 border border-white/[0.06]">
            {items.map((item, i) => (
                <div
                    key={i}
                    className={cn("h-full transition-all duration-1000 first:rounded-l-xl last:rounded-r-xl relative group/bar", item.darkColor)}
                    style={{ width: `${item.percentage}%` }}
                >
                    <div className="absolute inset-0 bg-[rgba(21,32,43,0.8)]/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>
            ))}
        </div>

        {/* Legend */}
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between group/legend">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-lg transition-transform group-hover/legend:scale-150", item.darkColor)} />
                        <div>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block leading-none mb-1">{item.label}</span>
                            <span className="text-xs font-bold text-white/50">{item.percentage}% Contribution</span>
                        </div>
                    </div>
                    <span className="text-lg font-black font-mono tracking-tighter text-white/80">{item.value.toFixed(3)}</span>
                </div>
            ))}
        </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-tight leading-relaxed">{''}</p>
        </div>
    </div>
);

// === MAIN SUMMARY ===
const Summary = () => {
    const { t } = useLanguage();
    const [data, setData] = useState<AnalysisData | null>(null);
    const [history, setHistory] = useState<AnalysisData[]>([]);
    const [healthScore, setHealthScore] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('analysis_history');
        if (saved) {
            const parsed = JSON.parse(saved);
            setHistory(parsed);
            if (parsed.length > 0) {
                const latest = parsed[0];
                setData(latest);

                const ndvi = latest.ndvi || 0;
                const ndre = latest.ndre || 0;
                const ndwi = latest.ndwi || 0;

                const normalizedNdwi = Math.max(0, Math.min(1, (ndwi + 0.5) / 1.5));
                const score = (ndvi * 0.5 + ndre * 0.3 + normalizedNdwi * 0.2) * 100;

                setTimeout(() => setHealthScore(Math.min(100, Math.max(0, score))), 200);
            }
        }
    }, []);

    const prevData = history.length > 1 ? history[1] : null;
    const getChange = (current: number, previous?: number) => {
        if (!previous) return undefined;
        return ((current - previous) / Math.abs(previous || 0.01)) * 100;
    };

    const getInsights = () => {
        const positive: string[] = [];
        const warnings: string[] = [];
        const actions: string[] = [];

        if (!data) return { positive, warnings, actions };

        if (data.ndvi >= 0.65) {
            positive.push('');
            positive.push('');
        } else if (data.ndvi >= 0.45) {
            positive.push('');
        } else if (data.ndvi >= 0.3) {
            warnings.push('');
            actions.push('');
        } else {
            warnings.push('');
            actions.push('');
            actions.push('');
        }

        if (data.ndre >= 0.55) {
            positive.push('');
        } else if (data.ndre >= 0.35) {
            positive.push('');
        } else {
            warnings.push('');
            actions.push('');
        }

        if (data.ndwi > 0.1) {
            positive.push('');
        } else if (data.ndwi > -0.05) {
            positive.push('');
        } else {
            warnings.push('');
            actions.push('');
            actions.push('');
        }

        if (actions.length === 0) {
            actions.push('');
            actions.push('');
            actions.push('');
        }

        return { positive, warnings, actions };
    };

    const insights = getInsights();

    const contributions = data ? [
        { label: t('dashboard.ndvi'), value: data.ndvi, percentage: 50, color: 'bg-green-500', darkColor: 'bg-emerald-500' },
        { label: t('dashboard.ndre'), value: data.ndre, percentage: 30, color: 'bg-teal-500', darkColor: 'bg-teal-500' },
        { label: t('dashboard.ndwi'), value: Math.abs(data.ndwi), percentage: 20, color: 'bg-blue-500', darkColor: 'bg-blue-500' }
    ] : [];

    return (
        <DashboardLayout>
            <div className="h-full overflow-auto">
                {/* Ambient glows */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 right-1/3 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[150px]" />
                    <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[130px]" />
                </div>

                <div className="relative z-10 p-6 lg:p-8 w-full pb-20">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{''}</span>
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight">{''}</h1>
                            <p className="text-sm text-white/30 font-medium">{''}</p>
                        </div>
                        {data && (
                            <div className="flex items-center gap-3 px-4 py-2.5 bg-[rgba(21,32,43,0.8)]/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06]">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-bold text-white/60 font-mono">{data.date}</span>
                                {data.stats?.season && (
                                    <span className="text-xs text-white/25 capitalize">• {data.stats.season}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {data ? (
                        <div className="space-y-8">
                            {/* Top Row: Health Score & Index Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Health Score */}
                                <div className="lg:col-span-1 glass-inner-card p-6 flex flex-col items-center justify-center">
                                    <HealthRing score={healthScore} />
                                </div>

                                {/* Index Cards */}
                                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <IndexCard
                                        label={t('dashboard.ndvi')} value={data.ndvi} icon={TrendingUp}
                                        color="#34d399" glowColor="bg-emerald-500"
                                        change={getChange(data.ndvi, prevData?.ndvi)}
                                        description=""
                                    />
                                    <IndexCard
                                        label={t('dashboard.ndre')} value={data.ndre} icon={Leaf}
                                        color="#2dd4bf" glowColor="bg-teal-500"
                                        change={getChange(data.ndre, prevData?.ndre)}
                                        description=""
                                    />
                                    <IndexCard
                                        label={t('dashboard.ndwi')} value={data.ndwi} icon={Droplets}
                                        color="#60a5fa" glowColor="bg-blue-500"
                                        change={getChange(data.ndwi, prevData?.ndwi)}
                                        description=""
                                    />
                                </div>
                            </div>

                            {/* Contribution Breakdown */}
                            <ContributionBar items={contributions} />

                            {/* Insights Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <InsightSection
                                    title="" icon={CheckCircle}
                                    iconColor="#34d399" items={insights.positive}
                                    emptyText=""
                                />
                                <InsightSection
                                    title="" icon={AlertTriangle}
                                    iconColor="#fbbf24" items={insights.warnings}
                                    emptyText=""
                                />
                                <InsightSection
                                    title="" icon={Target}
                                    iconColor="#60a5fa" items={insights.actions}
                                    numbered
                                />
                            </div>

                            {/* Quick Stats Footer */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: '', value: `${history.length}` },
                                    { label: '', value: data.stats?.dataQuality || '' },
                                    { label: '', value: `${data.stats?.cloudCover?.toFixed(0) || 0}%` },
                                    { label: '', value: data.stats?.season || '' },
                                ].map((stat, i) => (
                                    <div key={i} className="glass-inner-card p-4">
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-xl font-black text-white/70 capitalize">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="glass-section flex flex-col items-center justify-center py-24 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-400/5 rounded-full blur-[80px]" />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-3xl bg-[rgba(21,32,43,0.8)]/[0.04] flex items-center justify-center mb-6 border border-white/[0.08]">
                                    <Sparkles className="w-12 h-12 text-white/15" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{''}</h3>
                                <p className="text-sm text-white/30 text-center max-w-[1220px] mb-8 leading-relaxed">{''}</p>
                                <a
                                    href="/map"
                                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-blue-500 text-foreground text-sm font-black rounded-2xl hover:from-blue-300 hover:to-sky-400 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:scale-105"
                                >
                                    {''} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Summary;
