import { WaterSummary } from "@/lib/irsa";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Droplets, ArrowRightLeft, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface HeroStatsProps {
  summary: WaterSummary;
}

export function HeroStats({ summary }: HeroStatsProps) {
  // Format numbers to have commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const translateChangeText = (changeText: string) => {
    if (!changeText || changeText === "N/A") return "دستياب ناهي";
    const parts = changeText.split(' ');
    const percent = parts[0];
    const direction = parts[1] || "";
    let sindhiDir = "";
    if (direction.toLowerCase().includes('more') || direction.toLowerCase().includes('increased') || direction.toLowerCase().includes('up')) {
      sindhiDir = "وڌيڪ";
    } else if (direction.toLowerCase().includes('less') || direction.toLowerCase().includes('decreased') || direction.toLowerCase().includes('down')) {
      sindhiDir = "گهٽ";
    }
    return `${percent} ${sindhiDir}`.trim();
  };

  const getChangeIcon = (changeText: string) => {
    if (changeText.includes('Decreased') || changeText.includes('Less') || changeText.includes('down')) {
      return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    } else if (changeText.includes('Increased') || changeText.includes('More') || changeText.includes('up')) {
      return <ArrowUpRight className="h-4 w-4 text-primary" />;
    }
    return <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <motion.div variants={item}>
        <Card className="bg-card/50 backdrop-blur-sm border-card-border overflow-hidden relative">
          <div className="absolute -right-6 -top-6 opacity-5">
            <Droplets className="h-32 w-32" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">رم جي ڪل آمد</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-4xl font-bold text-foreground tracking-tight font-mono">
                    {formatNumber(summary.totalRimInflows)}
                  </h2>
                  <span className="text-sm font-medium text-muted-foreground">Cs</span>
                </div>
              </div>
              <div className="p-2 bg-primary/10 rounded-md">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 font-medium bg-background/50 px-2 py-1 rounded-md border border-card-border">
                {getChangeIcon(summary.inflowChangeFromYesterday)}
                <span className={summary.inflowChangeFromYesterday.includes('Decreased') || summary.inflowChangeFromYesterday.includes('Less') ? 'text-destructive' : 'text-primary'}>
                  {translateChangeText(summary.inflowChangeFromYesterday)}
                </span>
              </div>
              <span className="text-muted-foreground text-xs">ڪالهه جي ڀيٽ ۾</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="bg-card/50 backdrop-blur-sm border-card-border overflow-hidden relative">
          <div className="absolute -right-6 -top-6 opacity-5">
            <Waves className="h-32 w-32" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">رم جو ڪل اخراج</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-4xl font-bold text-foreground tracking-tight font-mono">
                    {formatNumber(summary.totalRimOutflows)}
                  </h2>
                  <span className="text-sm font-medium text-muted-foreground">Cs</span>
                </div>
              </div>
              <div className="p-2 bg-chart-1/10 rounded-md">
                <ArrowRightLeft className="h-5 w-5 text-chart-1" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 font-medium bg-background/50 px-2 py-1 rounded-md border border-card-border">
                {getChangeIcon(summary.outflowChangeFromYesterday)}
                <span className={summary.outflowChangeFromYesterday.includes('Decreased') || summary.outflowChangeFromYesterday.includes('Less') ? 'text-destructive' : 'text-primary'}>
                  {translateChangeText(summary.outflowChangeFromYesterday)}
                </span>
              </div>
              <span className="text-muted-foreground text-xs">ڪالهه جي ڀيٽ ۾</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="bg-card/50 backdrop-blur-sm border-card-border overflow-hidden relative">
          <CardContent className="p-6 h-full flex flex-col justify-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">سسٽم جي صورتحال</p>
            <div className="flex items-center gap-4">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              <div className="text-lg font-medium">لائيو ڊيٽا فعال آهي</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              ڊيٽا لاءِ {summary.date}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Just an inline icon component since lucide-react doesn't export Waves in all versions
function Waves(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  );
}
