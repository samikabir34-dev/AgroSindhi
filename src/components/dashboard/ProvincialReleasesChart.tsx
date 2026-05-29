import { DailyWaterData } from "@/lib/irsa";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { Map } from "lucide-react";

interface ProvincialReleasesChartProps {
  daily: DailyWaterData;
}

export function ProvincialReleasesChart({ daily }: ProvincialReleasesChartProps) {
  const releases = daily.irsaReleases;
  
  const chartData = [
    {
      name: "پنجاب",
      "اڄ": releases.today.punjab || 0,
      "گذريل سال": releases.lastYear.punjab || 0,
    },
    {
      name: "سنڌ",
      "اڄ": releases.today.sindh || 0,
      "گذريل سال": releases.lastYear.sindh || 0,
    },
    {
      name: "خيبر پختونخوا",
      "اڄ": releases.today.kp || 0,
      "گذريل سال": releases.lastYear.kp || 0,
    },
    {
      name: "بلوچستان",
      "اڄ": releases.today.balochistan || 0,
      "گذريل سال": releases.lastYear.balochistan || 0,
    }
  ];

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
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="bg-card border-card-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-chart-2" />
            <CardTitle>صوبن لاءِ پاڻي جو اخراج</CardTitle>
          </div>
          <CardDescription>اڄوڪي پاڻي جي اخراج جي ڀيٽ گذريل سال سان (ڪيوسڪس ۾)</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--card-border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--card-border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--card-border))' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} />
              <Legend />
              <Bar 
                dataKey="اڄ" 
                fill="hsl(var(--chart-9))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              <Bar 
                dataKey="گذريل سال" 
                fill="hsl(var(--chart-7))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
