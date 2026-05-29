import { DailyWaterData, WaterSummary } from "@/lib/irsa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Database, TrendingDown, TrendingUp } from "lucide-react";

interface ReservoirLevelsProps {
  summary: WaterSummary;
  daily: DailyWaterData;
}

export function ReservoirLevels({ summary, daily }: ReservoirLevelsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  const nameTranslation: Record<string, string> = {
    "Tarbela": "تربيلا",
    "Mangla": "منگلا",
    "Chashma": "چشما"
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return "دستياب ناهي";
    return new Intl.NumberFormat('en-US').format(num);
  };

  const palette = ['--chart-1','--chart-2','--chart-3','--chart-4','--chart-5','--chart-6','--chart-7','--chart-8','--chart-9','--chart-10'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Database className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold tracking-tight">ڊيمن جي پاڻي جي سطح</h3>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {summary.reservoirLevels.map((res, idx) => {
          const colorVar = palette[idx % palette.length];
          const colorStyle = { backgroundColor: `hsl(var(${colorVar}))` } as React.CSSProperties;
          const iconStyle = { color: `hsl(var(${colorVar}))` } as React.CSSProperties;

          return (
            <motion.div key={res.name} variants={item}>
              <Card className="bg-card border-card-border h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold">{nameTranslation[res.name] || res.name}</CardTitle>
                    <span className="text-sm font-mono font-medium px-2 py-1 bg-background rounded-md border border-card-border">
                      {res.fillPct !== null ? `${res.fillPct.toFixed(1)}% ڀريل` : 'دستياب ناهي'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Progress visualization */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>ڊيڊ ليول: {formatNumber(res.deadLevel)} ft</span>
                        <span>سطح: {formatNumber(res.currentLevel)} ft</span>
                      </div>

                      <div className="h-4 w-full bg-background rounded-full overflow-hidden border border-card-border relative">
                        <motion.div
                          className="h-full"
                          style={colorStyle}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(0, res.fillPct || 0))}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Flow details */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-card-border/50">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase mb-1">
                          <TrendingDown className="h-3 w-3" style={iconStyle} /> آمد
                        </div>
                        <div className="font-mono text-lg font-medium">
                          {formatNumber(res.inflow)} <span className="text-xs text-muted-foreground">Cs</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase mb-1">
                          <TrendingUp className="h-3 w-3" style={iconStyle} /> اخراج
                        </div>
                        <div className="font-mono text-lg font-medium">
                          {formatNumber(res.outflow)} <span className="text-xs text-muted-foreground">Cs</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
