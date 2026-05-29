import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    TrendingUp,
    Droplets,
    Leaf,
    Calendar,
    Cloud,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    ChevronRight,
    Activity,
    Zap,
    BarChart3,
    Eye,
    Map as MapIcon,
    Home
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import Loader from '@/components/Loader';
import DashboardSatelliteViewer from '@/components/DashboardSatelliteViewer';

interface AnalysisRecord {
    id: number;
    date: string;
    fieldName?: string;
    ndvi: number;
    ndre: number;
    ndwi: number;
    stats?: {
        cloudCover?: number;
        dataQuality?: string;
        season?: string;
    };
    bbox?: number[];
    geometry?: any;
}

interface YearlyData {
    year: number;
    ndvi: number;
    ndre: number;
    ndwi: number;
}

// === HERO STAT CARD ===
const HeroStatCard: React.FC<{
    title: string;
    value: string;
    subtitle?: string;
    trend?: number;
    icon: React.ElementType;
    gradientFrom: string;
    gradientTo: string;
    glowColor: string;
    sparkData?: number[];
    delay?: number;
}> = ({ title, value, subtitle, trend, icon: Icon, gradientFrom, gradientTo, glowColor, sparkData, delay = 0 }) => {
    return (
        <div
            className="relative group rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03]"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Animated gradient border */}
            <div className={cn("absolute inset-0 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 p-[1px]")}>
                <div className={cn("absolute inset-0 rounded-3xl", `bg-gradient-to-br ${gradientFrom} ${gradientTo}`)} />
            </div>

            {/* Inner card */}
            <div className="glass-inner-card relative p-6 m-[1px] overflow-hidden">
                {/* Background glow */}
                <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700", glowColor)} />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[rgba(21,32,43,0.02)] rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

                <div className="relative z-10">
                    {/* Header: icon + trend */}
                    <div className="flex items-center justify-between mb-5">
                        <div className={cn("p-3 rounded-2xl bg-[rgba(21,32,43,0.06)] border border-white/[0.06] backdrop-blur-sm")}>
                            <Icon className="w-5 h-5 text-white/80" />
                        </div>
                        {trend !== undefined && (
                            <div className={cn(
                                "flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold border",
                                trend >= 0
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                            )}>
                                {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {Math.abs(trend).toFixed(1)}%
                            </div>
                        )}
                    </div>

                    {/* Value */}
                    <div className="mb-2">
                        <span className="text-4xl font-black text-white tracking-tighter font-mono drop-shadow-xl">{value}</span>
                    </div>

                    {/* Title & Subtitle */}
                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">{title}</p>
                    {subtitle && <p className="text-[11px] text-white/30 font-medium mt-0.5">{subtitle}</p>}

                    {/* Sparkline */}
                    {sparkData && sparkData.length > 1 && (
                        <div className="flex items-end gap-[3px] h-10 mt-5">
                            {sparkData.map((val, i) => {
                                const max = Math.max(...sparkData, 0.001);
                                const height = (val / max) * 100;
                                const isLast = i === sparkData.length - 1;
                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex-1 rounded-full transition-all duration-1000",
                                            isLast ? cn("shadow-lg", glowColor.replace('bg-', 'bg-')) : "bg-[rgba(21,32,43,0.1)]"
                                        )}
                                        style={{
                                            height: `${Math.max(height, 10)}%`,
                                            transitionDelay: `${i * 60}ms`,
                                            backgroundColor: isLast ? undefined : 'rgba(255,255,255,0.08)'
                                        }}
                                    >
                                        {isLast && <div className={cn("w-full h-full rounded-full", `bg-gradient-to-t ${gradientFrom} ${gradientTo}`)} />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// === ANALYSIS TABLE (Dark Theme) ===
const AnalysisTable: React.FC<{ data: AnalysisRecord[] }> = ({ data }) => {
    const { t } = useLanguage();
    if (data.length === 0) return null;

    return (
        <div className="glass-inner-card overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-black text-white/80 uppercase tracking-[0.2em]">{''}</h3>
                </div>
                <span className="text-[10px] text-white/30 font-mono">{data.length}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.04]">
                            <th className="px-6 py-4 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{''}</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black text-emerald-400/70 uppercase tracking-[0.2em]">{t('dashboard.ndvi')}</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black text-teal-400/70 uppercase tracking-[0.2em]">{t('dashboard.ndre')}</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{''}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 5).map((record, i) => (
                            <tr
                                key={record.id}
                                className={cn(
                                    "border-b border-white/[0.03] transition-all duration-300 hover:bg-[rgba(21,32,43,0.03)]",
                                    i === 0 && "bg-blue-500/[0.03]"
                                )}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {i === 0 && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
                                        <div>
                                            <span className={cn("text-sm font-bold block", i === 0 ? "text-white" : "text-white/70")}>
                                                {record.fieldName || `Field ${record.id.toString().slice(-4)}`}
                                            </span>
                                            <span className="text-[10px] text-white/30 font-mono">{record.date}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20">
                                        {record.ndvi.toFixed(3)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-mono text-sm font-bold text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-lg border border-teal-400/20">
                                        {record.ndre.toFixed(3)}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <span className="text-xs font-bold text-white/50 font-mono">{record.stats?.cloudCover?.toFixed(0) || '0'}%</span>
                                        <div className="w-14 h-1.5 bg-[rgba(21,32,43,0.06)] rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-white/30 to-white/10 rounded-full" style={{ width: `${record.stats?.cloudCover || 0}%` }} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// === YEAR COMPARISON CHART (Dark) ===
const YearChart: React.FC<{
    data: YearlyData[];
    metric: 'ndvi' | 'ndre' | 'ndwi';
    title: string;
    color: string;
    barColor: string;
}> = ({ data, metric, title, color, barColor }) => {
    const values = data.map(d => d[metric]);
    const max = Math.max(...values.map(v => Math.abs(v)), 0.01);
    const currentYear = new Date().getFullYear();

    return (
        <div className="glass-inner-card p-6 group hover:border-white/[0.12] transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" style={{ color }} />
                    <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">{title}</h4>
                </div>
                <div className="text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border" style={{ color, borderColor: `${color}33`, backgroundColor: `${color}11` }}>
                    {''}
                </div>
            </div>

            <div className="w-full space-y-8">
                {data.map((item, idx) => {
                    const width = (Math.abs(item[metric]) / max) * 100;
                    const isCurrent = item.year === currentYear;

                    return (
                        <div key={item.year} className="flex items-center gap-3">
                            <span className={cn(
                                "text-[11px] font-mono font-bold w-10 tracking-tight",
                                isCurrent ? "text-white" : "text-white/30"
                            )}>
                                {item.year}
                            </span>
                            <div className="flex-1 h-7 bg-[rgba(21,32,43,0.04)] rounded-xl overflow-hidden relative">
                                <div
                                    className={cn(
                                        "h-full rounded-xl transition-all duration-1200 ease-out flex items-center justify-end pr-3",
                                        isCurrent ? barColor : "bg-[rgba(21,32,43,0.08)]"
                                    )}
                                    style={{ width: `${width}%`, transitionDelay: `${idx * 80}ms` }}
                                >
                                    {isCurrent && <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-xl" />}
                                </div>
                                <span className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black font-mono",
                                    isCurrent && width > 50 ? "text-white/90" : "text-white/40"
                                )}>
                                    {item[metric].toFixed(3)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// === INSIGHT CARD (Dark) ===
const InsightCard: React.FC<{
    title: string;
    value: string;
    status: 'good' | 'warning' | 'neutral';
    description: string;
}> = ({ title, value, status, description }) => {
    const statusMap = {
        good: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
        warning: { border: 'border-blue-500/20', bg: 'bg-blue-500/10', text: 'text-sky-400', dot: 'bg-sky-400' },
        neutral: { border: 'border-white/10', bg: 'bg-[rgba(21,32,43,0.05)]', text: 'text-white/60', dot: 'bg-[rgba(21,32,43,0.4)]' }
    };
    const s = statusMap[status];

    return (
        <div className={cn("glass-inner-card rounded-2xl p-4 border transition-all duration-300 hover:scale-[1.02]", s.border)}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{title}</span>
                <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                    <span className={cn("text-[10px] font-bold uppercase", s.text)}>{value}</span>
                </div>
            </div>
            <p className="text-[11px] text-white/30 leading-relaxed">{description}</p>
        </div>
    );
};

// === MAIN DASHBOARD ===
const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord | null>(null);
    const [history, setHistory] = useState<AnalysisRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);

        const savedHistory = localStorage.getItem('analysis_history');
        if (savedHistory) {
            const parsed = JSON.parse(savedHistory);
            setHistory(parsed);

            if (location.state?.analysis) {
                setCurrentAnalysis(location.state.analysis);
            } else if (parsed.length > 0) {
                setCurrentAnalysis(parsed[0]);
            }
        } else if (location.state?.analysis) {
            setCurrentAnalysis(location.state.analysis);
        }

        return () => clearTimeout(timer);
    }, [location.state]);

    const yearlyData = useMemo(() => {
        if (!currentAnalysis) return [];
        const currentYear = new Date().getFullYear();
        const years: YearlyData[] = [];
        const seed = currentAnalysis.id / 1000000;

        for (let i = 4; i >= 0; i--) {
            const year = currentYear - i;
            const getVariance = (offset: number) => Math.sin(seed + year + offset) * 0.1;

            if (i === 0) {
                years.push({ year, ndvi: currentAnalysis.ndvi, ndre: currentAnalysis.ndre, ndwi: currentAnalysis.ndwi });
            } else {
                years.push({
                    year,
                    ndvi: Math.max(0.15, Math.min(0.85, currentAnalysis.ndvi + getVariance(1))),
                    ndre: Math.max(0.15, Math.min(0.8, currentAnalysis.ndre + getVariance(2))),
                    ndwi: Math.max(-0.4, Math.min(0.4, currentAnalysis.ndwi + getVariance(3) * 0.5))
                });
            }
        }
        return years;
    }, [currentAnalysis]);

    const previousAnalysis = history.length > 1 ? history[1] : null;

    const getTrend = (current: number, previous: number | undefined) => {
        if (!previous) return undefined;
        return ((current - previous) / Math.abs(previous || 0.01)) * 100;
    };

    const getSparkline = (metric: 'ndvi' | 'ndre' | 'ndwi') =>
        history.slice(0, 8).reverse().map(h => Math.abs(h[metric]));

    const getInsights = () => {
        if (!currentAnalysis) return [];
        const insights = [];
        if (currentAnalysis.ndvi >= 0.6) insights.push({ title: 'Vegetation', value: 'Healthy', status: 'good' as const, description: 'Dense vegetation with strong photosynthetic activity detected.' });
        else if (currentAnalysis.ndvi >= 0.4) insights.push({ title: 'Vegetation', value: 'Moderate', status: 'neutral' as const, description: 'Acceptable levels. Continue monitoring for changes.' });
        else insights.push({ title: 'Vegetation', value: 'Low', status: 'warning' as const, description: 'Below optimal range — immediate attention recommended.' });

        if (currentAnalysis.ndwi > 0) insights.push({ title: 'Hydration', value: 'Adequate', status: 'good' as const, description: 'Sufficient moisture content in plant tissue.' });
        else insights.push({ title: 'Hydration', value: 'Low', status: 'warning' as const, description: 'Consider increasing irrigation frequency.' });

        insights.push({ title: 'Data Quality', value: currentAnalysis.stats?.dataQuality || 'Good', status: 'neutral' as const, description: `Cloud interference: ${currentAnalysis.stats?.cloudCover?.toFixed(0) || 0}%` });
        return insights;
    };

    const [activeAnalysisIndex, setActiveAnalysisIndex] = useState<'NDVI' | 'NDRE' | 'NDWI' | 'MSAVI' | 'NDMI'>('NDVI');

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="h-full flex items-center justify-center">
                    <Loader scale={2} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex-1 h-full overflow-y-auto overflow-x-hidden">
                {/* Ambient background glows */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#55e6ff]/[0.03] rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#34d399]/[0.03] rounded-full blur-[150px]" />
                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#8d7cff]/[0.02] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="relative z-10 p-4 pt-6 lg:p-10 w-full space-y-8 lg:space-y-10 pb-20">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 hover:text-[#55e6ff] transition-colors group"
                    >
                        <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> گهر واپس وڃو
                    </button>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="space-y-3 max-w-[1220px]">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-gradient-to-b from-[#55e6ff] to-[#8d7cff] rounded-full shadow-[0_0_12px_rgba(85,230,255,0.4)]" />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{''}</span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none flex flex-wrap items-baseline gap-2 sm:gap-4">
                                <span>{currentAnalysis?.fieldName || ''}</span>
                                {currentAnalysis && (
                                    <span className="text-[10px] font-mono text-white/20 bg-[rgba(21,32,43,0.05)] px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/[0.06]">
                                        #{currentAnalysis.id.toString().slice(-6)}
                                    </span>
                                )}
                            </h1>
                            <p className="text-white/30 font-medium leading-relaxed max-w-[1220px] text-sm">{''}</p>
                        </div>

                        {currentAnalysis && (
                            <div className="flex items-center gap-4 bg-[rgba(21,32,43,0.04)] backdrop-blur-xl p-3 rounded-2xl border border-white/[0.06] self-start">
                                <div className="w-11 h-11 rounded-xl bg-[#55e6ff]/10 flex items-center justify-center border border-[#55e6ff]/20 shadow-[0_0_10px_rgba(85,230,255,0.1)]">
                                    <Calendar className="w-5 h-5 text-[#55e6ff]" />
                                </div>
                                <div className="pr-4">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">{''}</p>
                                    <p className="text-sm font-black text-white/80 leading-none font-mono">{currentAnalysis.date}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {currentAnalysis ? (
                        <div className="space-y-10">

                            {/* EOS-style Satellite Interactive MapBox */}
                            {currentAnalysis.bbox && currentAnalysis.geometry && (
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <MapIcon className="w-4 h-4 text-[#34d399]" />
                                        <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">{''}</h2>
                                        <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
                                    </div>
                                    <div className="flex flex-col-reverse lg:flex-row gap-6">
                                        <div className="flex-1 min-h-[450px]">
                                            <DashboardSatelliteViewer
                                                bbox={currentAnalysis.bbox}
                                                geometry={currentAnalysis.geometry}
                                                currentIndex={activeAnalysisIndex}
                                                onIndexChange={setActiveAnalysisIndex}
                                            />
                                        </div>

                                        {/* Sidebar Legend (Right Side, Out of Box) */}
                                        <div className="w-full lg:w-64 bg-[rgba(21,32,43,0.8)] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 flex flex-col justify-between">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.4em] mb-2 font-sindhi text-right">فصل جي حالت</p>
                                                <h3 className="text-xl font-black text-white italic tracking-tighter flex items-center justify-end gap-3 mb-6">
                                                    {activeAnalysisIndex === 'NDVI' ? 'فصل جي حالت' : activeAnalysisIndex === 'NDRE' ? 'ڀاڻ جي حالت' : activeAnalysisIndex === 'MSAVI' ? 'مٽي جي حالت' : activeAnalysisIndex === 'NDMI' ? 'نمي جي حالت' : 'پاڻي جي حالت'}
                                                    <span className="w-1.5 h-6 bg-[#55e6ff] rounded-full shadow-[0_0_10px_rgba(85,230,255,0.5)]" />
                                                </h3>

                                                <div className="flex gap-6 items-stretch h-[200px] justify-end">
                                                    {/* Labels */}
                                                    <div className="flex flex-col-reverse justify-between py-0 text-right">
                                                        {['تمام خراب', 'خراب', 'وچولي', 'سٺي', 'بھتر', 'تمام بھتر'].map((lbl, i) => (
                                                            <span key={i} className="text-[11px] font-black text-white/70">{lbl}</span>
                                                        ))}
                                                    </div>

                                                    {/* Bar */}
                                                    <div className="relative w-3 rounded-full flex flex-col-reverse overflow-hidden border border-white/5">
                                                        {activeAnalysisIndex === 'NDWI' || activeAnalysisIndex === 'NDMI' ? (
                                                            <>
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(89,38,13)' }} />
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(140,77,38)' }} />
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(191,140,89)' }} />
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(230,217,179)' }} />
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(179,230,255)' }} />
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(102,204,255)' }} />
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(26,153,255)' }} />
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(0,102,230)' }} />
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(0,51,179)' }} />
                                                                <div className="flex-1" style={{ backgroundColor: 'rgb(0,13,102)' }} />
                                                            </>
                                                        ) : (
                                                        <>
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(220,33,41)' }} />
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(238,110,38)' }} />
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(246,176,36)' }} />
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(255,224,25)' }} />
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(217,224,41)' }} />
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(166,210,51)' }} />
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(112,189,59)' }} />
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(61,153,56)' }} />
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(46,135,54)' }} />
                                                            <div className="flex-1" style={{ backgroundColor: 'rgb(20,89,36)' }} />
                                                        </>
                                                        )}
                                                    </div>

                                                    {/* Numbers */}
                                                    <div className="flex flex-col-reverse justify-between py-1 text-[10px] font-black text-white/20 font-mono">
                                                        <span>{activeAnalysisIndex === 'NDWI' ? '-0.3' : activeAnalysisIndex === 'NDMI' ? '-0.6' : activeAnalysisIndex === 'MSAVI' ? '0.0' : '0.05'}</span>
                                                        <span>{activeAnalysisIndex === 'NDWI' ? '0.6' : activeAnalysisIndex === 'NDMI' ? '0.9' : activeAnalysisIndex === 'MSAVI' ? '0.7' : '0.85'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-white/[0.04]">
                                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed text-right">
                                                    {activeAnalysisIndex === 'NDWI' || activeAnalysisIndex === 'NDMI' ? 'Water Moisture Index Scale' : 'Spectral Index Scale'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Map Date Note */}
                            <div className="bg-[#55e6ff]/10 border border-[#55e6ff]/20 rounded-3xl p-5 sm:p-6 flex justify-center text-center backdrop-blur-xl shadow-lg shadow-[#55e6ff]/5 mt-2" dir="rtl">
                                <p className="text-[#55e6ff] font-sindhi text-lg sm:text-xl font-black flex items-center justify-center gap-4 tracking-tight leading-relaxed">
                                    <Info className="w-7 h-7 text-[#55e6ff] shrink-0" />
                                    نوٽ: ھي ميپ ڪافي پراڻو آھي پر توھان کي جيڪو ڊيٽا ملي ٿو اھو 3-5 ڏينھن پراڻو آھي.
                                </p>
                            </div>

                        </div>
                    ) : (
                        /* Empty State */
                        <div className="glass-section flex flex-col items-center justify-center py-24 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-60 h-60 bg-[#55e6ff]/5 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#34d399]/5 rounded-full blur-[80px]" />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center mb-6 border border-white/[0.08]">
                                    <TrendingUp className="w-12 h-12 text-white/20" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{''}</h3>
                                <p className="text-sm text-white/30 text-center max-w-[1220px] mb-8 leading-relaxed font-arabic" dir="rtl">
                                    نقشي تي وڃي پنھنجي ٻني جي حدبندي ڪريو ۽ تفصيلي تجزيو حاصل ڪريو.
                                </p>
                                <a
                                    href="/map"
                                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#55e6ff] to-[#8d7cff] text-[#07172f] text-sm font-black rounded-2xl transition-all shadow-lg shadow-[#55e6ff]/20 hover:shadow-xl hover:scale-105"
                                >
                                    نقشي تي وڃو
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
