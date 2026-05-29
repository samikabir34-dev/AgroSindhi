import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    colorClass: string;
    bgClass?: string;
    subtext?: string;
    titleClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass, bgClass, subtext, titleClass }) => {
    const { isRTL } = useLanguage();
    const titleCls = titleClass ?? 'text-muted-foreground';
    const background = bgClass ?? 'bg-[rgba(21,32,43,0.8)]/60';

    return (
        <div className={cn(
            `p-3 rounded-2xl backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 ${background} ring-1 ring-black/5`,
            isRTL && "rtl"
        )}>
            <div className={cn(
                "flex items-center justify-between mb-1.5",
                isRTL && "flex-row-reverse"
            )}>
                <span className={cn(
                    `text-[10px] font-bold ${titleCls} uppercase tracking-widest`,
                    isRTL && "text-right"
                )}>{title}</span>
                <Icon className={`w-3.5 h-3.5 ${colorClass} opacity-80`} />
            </div>
            <div className={cn(
                `text-lg font-bold font-mono ${colorClass} tracking-tight`,
                isRTL && "text-right"
            )} dir="ltr">{value}</div>
            {subtext && <div className={cn(
                "text-[9px] text-muted-foreground mt-0.5",
                isRTL && "text-right"
            )}>{subtext}</div>}
        </div>
    );
};

export default StatCard;
