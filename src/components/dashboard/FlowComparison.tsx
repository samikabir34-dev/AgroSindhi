import { DailyWaterData, WaterSummary } from "@/lib/irsa";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ArrowDownRight, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

interface FlowComparisonProps {
  daily: DailyWaterData;
  summary: WaterSummary;
}

export function FlowComparison({ daily, summary }: FlowComparisonProps) {
  const { comparison } = daily;
  
  const formatNumber = (num: number | null) => {
    if (num === null) return "N/A";
    return new Intl.NumberFormat('en-US').format(num);
  };

  const InflowIcon = comparison.inflowsChangeDirection === 'up' 
    ? ArrowUpRight 
    : comparison.inflowsChangeDirection === 'down' 
      ? ArrowDownRight 
      : ArrowRight;

  const OutflowIcon = comparison.outflowsChangeDirection === 'up' 
    ? ArrowUpRight 
    : comparison.outflowsChangeDirection === 'down' 
      ? ArrowDownRight 
      : ArrowRight;

  const InflowColor = comparison.inflowsChangeDirection === 'up' 
    ? "text-primary" 
    : comparison.inflowsChangeDirection === 'down' 
      ? "text-destructive" 
      : "text-muted-foreground";

  const OutflowColor = comparison.outflowsChangeDirection === 'up' 
    ? "text-primary" 
    : comparison.outflowsChangeDirection === 'down' 
      ? "text-destructive" 
      : "text-muted-foreground";

  const diff = summary.totalRimInflows - summary.totalRimOutflows;
  const isAccumulating = diff > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="h-full"
    >
      <Card className="bg-card border-card-border h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-chart-3" />
            <CardTitle>سسٽم جو توازن</CardTitle>
          </div>
          <CardDescription>آمد ۽ اخراج جي صورتحال</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between gap-6">
          
          <div className="p-6 bg-background rounded-xl border border-card-border text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              نيٽ سسٽم جو توازن
            </p>
            <div className={`text-4xl font-bold font-mono ${isAccumulating ? 'text-primary' : 'text-chart-1'}`}>
              {isAccumulating ? '+' : ''}{formatNumber(diff)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isAccumulating ? 'ڊيمن ۾ پاڻي گڏ ٿي رهيو آهي' : 'ڊيمن مان پاڻي نيڪال ٿي رهيو آهي'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-card-border/50">
              <div>
                <p className="text-sm text-muted-foreground mb-1">آمد بمقابله ڪالهه</p>
                <div className="font-mono font-medium text-lg">
                  {formatNumber(comparison.inflowsYesterdayCs)} Cs
                </div>
              </div>
              <div className={`flex items-center gap-1 font-bold ${InflowColor}`}>
                <InflowIcon className="h-5 w-5" />
                {comparison.inflowsChangePct !== null ? `${comparison.inflowsChangePct}%` : 'دستياب ناهي'}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-card-border/50">
              <div>
                <p className="text-sm text-muted-foreground mb-1">اخراج بمقابله ڪالهه</p>
                <div className="font-mono font-medium text-lg">
                  {formatNumber(comparison.outflowsYesterdayCs)} Cs
                </div>
              </div>
              <div className={`flex items-center gap-1 font-bold ${OutflowColor}`}>
                <OutflowIcon className="h-5 w-5" />
                {comparison.outflowsChangePct !== null ? `${comparison.outflowsChangePct}%` : 'دستياب ناهي'}
              </div>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </motion.div>
  );
}
