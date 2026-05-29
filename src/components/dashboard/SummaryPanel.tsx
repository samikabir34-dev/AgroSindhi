import React, { useEffect, useState } from 'react';
import { Lightbulb, BarChart3, AlertTriangle, CheckCircle2, Loader2, Sparkles, TrendingUp, Activity } from 'lucide-react';
import { generateStructuredInsights, type AnalysisData, type StructuredSummary } from '@/lib/gemini';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SummaryPanelProps {
    analysisData?: AnalysisData | null;
}

// Circular Progress Component with Animation
const CircularProgress: React.FC<{
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color: string;
    bgColor: string;
    children: React.ReactNode;
}> = ({ percentage, size = 100, strokeWidth = 8, color, bgColor, children }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (animatedPercentage / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedPercentage(percentage), 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{
                        filter: `drop-shadow(0 0 6px ${color}40)`,
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

const SummaryPanel: React.FC<SummaryPanelProps> = ({ analysisData }) => {
    const { t, isRTL } = useLanguage();
    const [insights, setInsights] = useState<StructuredSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (analysisData) {
            setIsLoading(true);
            generateStructuredInsights(analysisData)
                .then(result => {
                    setInsights(result);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [analysisData]);

    // Calculate composite health score from NDVI, NDRE, NDWI
    const calculateHealth = () => {
        if (!analysisData) return { score: 0, status: t('dashboard.notAvailable'), color: 'gray', percentage: 0 };

        // Weighted composite: NDVI (50%), NDRE (30%), NDWI (20%)
        // NDWI can be negative, so we normalize it
        const normalizedNdwi = Math.max(0, Math.min(1, (analysisData.ndwi + 0.5) / 1.5));
        const compositeScore = (analysisData.ndvi * 0.5) + (analysisData.ndre * 0.3) + (normalizedNdwi * 0.2);

        // Convert to percentage (0-100)
        const percentage = Math.min(100, Math.max(0, compositeScore * 100));

        let status: string;
        let color: string;
        let bgColor: string;
        let textColor: string;

        if (compositeScore > 0.6) {
            status = t('summary.excellent');
            color = '#10b981'; // emerald-500
            bgColor = '#d1fae5'; // emerald-100
            textColor = 'text-emerald-600';
        } else if (compositeScore > 0.4) {
            status = t('summary.good');
            color = '#22c55e'; // green-500
            bgColor = '#dcfce7'; // green-100
            textColor = 'text-green-600';
        } else if (compositeScore > 0.2) {
            status = t('summary.moderate');
            color = '#f59e0b'; // blue-500
            bgColor = '#fef3c7'; // amber-100
            textColor = 'text-blue-600';
        } else {
            status = t('summary.poor');
            color = '#ef4444'; // red-500
            bgColor = '#fee2e2'; // red-100
            textColor = 'text-red-600';
        }

        return { score: compositeScore, status, color, bgColor, textColor, percentage };
    };

    const health = calculateHealth();

    return (
        <div className={cn("flex flex-col h-full overflow-hidden", isRTL && "rtl")}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.1)]/50 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 backdrop-blur-sm">
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-md">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="font-bold text-foreground text-sm">{t('summary.aiInsights')}</h3>
                        <p className="text-[10px] text-muted-foreground">{t('summary.smartFieldAnalysis')}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Section 1: Health Status Cards */}
                <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
                    <h4 className={cn(
                        "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1",
                        isRTL && "flex-row-reverse text-right"
                    )}>
                        <Activity className="w-3 h-3" />
                        {t('summary.fieldHealthOverview')}
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Overall Health Card */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-3 border border-[rgba(255,255,255,0.06)] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center">
                            <CircularProgress
                                percentage={health.percentage}
                                size={80}
                                strokeWidth={6}
                                color={health.color}
                                bgColor={health.bgColor}
                            >
                                <div className="flex flex-col items-center">
                                    <TrendingUp className="w-4 h-4" style={{ color: health.color }} />
                                </div>
                            </CircularProgress>
                            <span className="mt-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{t('summary.overallHealth')}</span>
                            <span className={`text-sm font-bold ${health.textColor}`}>{health.status}</span>
                        </div>

                        {/* Field Health Percentage Card */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-3 border border-[rgba(255,255,255,0.06)] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center">
                            <CircularProgress
                                percentage={health.percentage}
                                size={80}
                                strokeWidth={6}
                                color={health.color}
                                bgColor={health.bgColor}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-lg font-bold font-mono" style={{ color: health.color }} dir="ltr">
                                        {Math.round(health.percentage)}
                                    </span>
                                    <span className="text-[8px] font-medium text-muted-foreground">%</span>
                                </div>
                            </CircularProgress>
                            <span className="mt-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{t('summary.healthScore')}</span>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <span className="font-mono" dir="ltr">NDVI+NDRE+NDWI</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    {analysisData && (
                        <div className={cn("mt-3 grid grid-cols-3 gap-2", isRTL && "direction-rtl")}>
                            <div className="text-center p-2 rounded-lg bg-green-50/50 border border-green-100">
                                <div className="text-[10px] text-muted-foreground">NDVI</div>
                                <div className="text-xs font-bold text-green-600 font-mono" dir="ltr">{analysisData.ndvi.toFixed(3)}</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                                <div className="text-[10px] text-muted-foreground">NDRE</div>
                                <div className="text-xs font-bold text-emerald-600 font-mono" dir="ltr">{analysisData.ndre.toFixed(3)}</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                                <div className="text-[10px] text-muted-foreground">NDWI</div>
                                <div className="text-xs font-bold text-blue-600 font-mono" dir="ltr">{analysisData.ndwi.toFixed(3)}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 2: AI Summary */}
                <div className="p-4 space-y-3">
                    <h4 className={cn(
                        "text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1",
                        isRTL && "flex-row-reverse text-right"
                    )}>
                        <Lightbulb className="w-3 h-3" />
                        {t('summary.aiAnalysisSummary')}
                    </h4>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 animate-pulse" />
                                <Loader2 className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                            </div>
                            <span className="text-sm text-muted-foreground">{t('summary.analyzingData')}</span>
                        </div>
                    ) : insights ? (
                        <div className="space-y-3">
                            {/* What Stats Mean */}
                            <div className="group p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all duration-300">
                                <div className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                                    <div className="p-1.5 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                        <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                                        <h5 className="text-xs font-semibold text-blue-800 mb-1">{t('summary.whatStatsMean')}</h5>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">{insights.statsExplanation}</p>
                                    </div>
                                </div>
                            </div>

                            {/* What is the Problem */}
                            <div className="group p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 hover:border-amber-200 hover:shadow-sm transition-all duration-300">
                                <div className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                                    <div className="p-1.5 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors">
                                        <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                                        <h5 className="text-xs font-semibold text-amber-800 mb-1">{t('summary.whatIsProblem')}</h5>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">{insights.problemAnalysis}</p>
                                    </div>
                                </div>
                            </div>

                            {/* What is the Solution */}
                            <div className="group p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 hover:border-emerald-200 hover:shadow-sm transition-all duration-300">
                                <div className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                                    <div className="p-1.5 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    </div>
                                    <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                                        <h5 className="text-xs font-semibold text-emerald-800 mb-1">{t('summary.whatIsSolution')}</h5>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">{insights.solutionAdvice}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">{t('summary.noDataAvailable')}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t('summary.selectFieldForInsights')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SummaryPanel;
