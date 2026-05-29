import { DailyWaterData, WaterSummary } from "@/lib/irsa";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface RiverFlowsChartProps {
  summary: WaterSummary;
  daily: DailyWaterData;
}

export function RiverFlowsChart({ summary }: RiverFlowsChartProps) {
  const nameTranslation: Record<string, string> = {
    "Kabul @ Nowshera": "درياهه ڪابل (نوشهرو)",
    "Chenab @ Marala": "درياهه چناب (مرالا)",
    "Kalabagh": "ڪالا باغ",
    "Taunsa": "تونسا",
    "Panjnad": "پنجند",
    "Guddu": "گوڊو",
    "Sukkur": "سکر",
    "Kotri": "ڪوٽڙي",
    "Tarbela": "تربيلا",
    "Mangla": "منگلا",
    "Chashma": "چشما"
  };

  // Transform data for recharts
  const chartData = summary.riverFlows.map(flow => ({
    name: nameTranslation[flow.name] || flow.name,
    "اپ اسٽريم وهڪرو (U/S)": flow.usDischarge || 0,
    "ڊائون اسٽريم وهڪرو (D/S)": flow.dsDischarge || 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-card-border p-3 rounded-lg shadow-lg">
          <p className="font-bold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">{entry.name}:</span>
              </div>
              <span className="font-mono font-medium text-sm">
                {new Intl.NumberFormat('en-US').format(entry.value)} Cs
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="h-full"
    >
      <Card className="bg-card border-card-border h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-chart-1" />
            <CardTitle>درياهن جا وهڪرا ۽ بئراجن جو اخراج</CardTitle>
          </div>
          <CardDescription>اپ اسٽريم (U/S) ۽ ڊائون اسٽريم (D/S) اخراج ڪيوسڪس ۾</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--card-border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--card-border))' }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--card-border))' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar 
                dataKey="اپ اسٽريم وهڪرو (U/S)" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                dataKey="ڊائون اسٽريم وهڪرو (D/S)" 
                fill="hsl(var(--chart-3))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
