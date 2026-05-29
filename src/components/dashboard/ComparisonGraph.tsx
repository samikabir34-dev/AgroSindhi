import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface AnalysisRecord {
    id: number;
    date: string;
    ndvi: number;
    ndre: number;
    ndwi: number;
    location?: string;
}

interface ComparisonGraphProps {
    currentAnalysis?: AnalysisRecord | null;
    history?: AnalysisRecord[];
}

const ComparisonGraph: React.FC<ComparisonGraphProps> = ({ currentAnalysis, history = [] }) => {
    const { t, isRTL } = useLanguage();

    const { chartData, hasHistoricalData, comparisonLabel } = useMemo(() => {
        const currentNdvi = currentAnalysis?.ndvi ?? 0;
        const currentNdre = currentAnalysis?.ndre ?? 0;
        const currentNdwi = currentAnalysis?.ndwi ?? 0;

        let historicalAnalysis: AnalysisRecord | null = null;
        let label = t('graph.noHistoricalData');

        // Filter out the current analysis from history
        const previousRecords = history.filter(record =>
            !currentAnalysis || record.id !== currentAnalysis.id
        );

        if (previousRecords.length > 0) {
            // Try to find data from approximately one year ago
            if (currentAnalysis?.date) {
                const currentDate = new Date(currentAnalysis.date);
                const oneYearAgo = new Date(currentDate);
                oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

                // Find the closest record to one year ago (within 60 days)
                const yearAgoRecords = previousRecords.filter(record => {
                    const recordDate = new Date(record.date);
                    const daysDiff = Math.abs((recordDate.getTime() - oneYearAgo.getTime()) / (1000 * 60 * 60 * 24));
                    return daysDiff <= 60;
                });

                if (yearAgoRecords.length > 0) {
                    // Find the closest one
                    historicalAnalysis = yearAgoRecords.reduce((closest, record) => {
                        const recordDate = new Date(record.date);
                        const closestDate = new Date(closest.date);
                        const recordDiff = Math.abs(recordDate.getTime() - oneYearAgo.getTime());
                        const closestDiff = Math.abs(closestDate.getTime() - oneYearAgo.getTime());
                        return recordDiff < closestDiff ? record : closest;
                    });
                    label = `${t('graph.previousYear')} (${historicalAnalysis.date})`;
                }
            }

            // Fallback to most recent previous record if no year-ago data found
            if (!historicalAnalysis) {
                const sortedHistory = [...previousRecords].sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                historicalAnalysis = sortedHistory[0];
                label = `${t('common.previous')} (${historicalAnalysis.date})`;
            }
        }

        const historicalNdvi = historicalAnalysis?.ndvi ?? 0;
        const historicalNdre = historicalAnalysis?.ndre ?? 0;
        const historicalNdwi = historicalAnalysis?.ndwi ?? 0;

        const data = [
            { name: 'NDVI', historical: historicalNdvi, current: currentNdvi },
            { name: 'NDRE', historical: historicalNdre, current: currentNdre },
            { name: 'NDWI', historical: historicalNdwi, current: currentNdwi },
        ];

        return {
            chartData: data,
            hasHistoricalData: historicalAnalysis !== null,
            comparisonLabel: label
        };
    }, [currentAnalysis, history, t]);

    const hasCurrentData = currentAnalysis !== null && currentAnalysis !== undefined;

    return (
        <div className={cn("h-full flex flex-col overflow-hidden", isRTL && "rtl")}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.1)]/50 bg-[rgba(21,32,43,0.8)]/40 backdrop-blur-sm flex items-center justify-between">
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <div className="p-1.5 rounded-lg bg-blue-100 ring-1 ring-blue-400/20">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="font-semibold text-foreground text-sm">{t('graph.analysisComparison')}</h3>
                        <p className="text-[10px] text-muted-foreground">
                            {hasHistoricalData ? `vs ${comparisonLabel}` : t('graph.currentValuesOnly')}
                        </p>
                    </div>
                </div>
                <div className={cn("flex items-center gap-3 text-[10px]", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                        <div className="w-2.5 h-2.5 rounded-sm bg-slate-500" />
                        <span className="text-muted-foreground">{t('common.previous')}</span>
                    </div>
                    <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                        <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                        <span className="text-muted-foreground">{t('common.current')}</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 p-4 min-h-0 bg-[rgba(21,32,43,0.8)]/20">
                {!hasCurrentData ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <BarChart3 className="w-10 h-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">{t('graph.noAnalysisData')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t('graph.drawFieldToAnalyze')}</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }} barCategoryGap="25%">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[-0.5, 1]}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255,255,255,0.98)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    padding: '8px 12px',
                                    color: '#374151',
                                    fontWeight: 500
                                }}
                                formatter={(value: number) => [value.toFixed(3), '']}
                            />
                            {/* Always render historical bar - show 0 if no data */}
                            <Bar
                                dataKey="historical"
                                name={comparisonLabel}
                                fill={`hsl(var(--chart-6))`}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                                fillOpacity={hasHistoricalData ? 0.95 : 0.3}
                            />
                            <Bar
                                dataKey="current"
                                name={t('common.current')}
                                fill={`hsl(var(--chart-8))`}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                                fillOpacity={0.95}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default ComparisonGraph;
