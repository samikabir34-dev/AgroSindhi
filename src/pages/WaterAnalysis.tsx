import { useState, useEffect } from "react";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Header } from "@/components/dashboard/Header";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { ReservoirLevels } from "@/components/dashboard/ReservoirLevels";
import { RiverFlowsChart } from "@/components/dashboard/RiverFlowsChart";
import { ProvincialReleasesChart } from "@/components/dashboard/ProvincialReleasesChart";
import { FlowComparison } from "@/components/dashboard/FlowComparison";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WaterAnalysis() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  
  const [datesData, setDatesData] = useState<any[]>([]);
  const [isDatesLoading, setIsDatesLoading] = useState(false);
  const [isDatesError, setIsDatesError] = useState(false);

  const [dailyData, setDailyData] = useState<any>(null);
  const [isDailyLoading, setIsDailyLoading] = useState(false);
  const [isDailyError, setIsDailyError] = useState(false);

  const [summaryData, setSummaryData] = useState<any>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSummaryError, setIsSummaryError] = useState(false);

  // Fetch summary and default daily data
  useEffect(() => {
    const fetchData = async () => {
      setIsSummaryLoading(true);
      setIsDailyLoading(true);
      try {
        const sumRes = await fetch('/api/water/irsa-summary');
        if (!sumRes.ok) throw new Error('Failed summary');
        const sumData = await sumRes.json();
        setSummaryData(sumData);

        const dailyRes = await fetch('/api/water/irsa-daily');
        if (!dailyRes.ok) throw new Error('Failed daily');
        const dayData = await dailyRes.json();
        setDailyData(dayData);
      } catch (e) {
        setIsSummaryError(true);
        setIsDailyError(true);
      } finally {
        setIsSummaryLoading(false);
        setIsDailyLoading(false);
      }
    };
    fetchData();
  }, []);

  // set document title
  useEffect(() => {
    if (typeof document !== 'undefined') document.title = 'پاني جو جائزو';
  }, []);

  // Fetch specific date if selected
  useEffect(() => {
    if (!selectedDate) return;
    const fetchSpecific = async () => {
      setIsDailyLoading(true);
      try {
        const res = await fetch(`/api/water/irsa-daily?date=${selectedDate}`);
        if (!res.ok) throw new Error('Failed specific daily');
        const data = await res.json();
        setDailyData(data);
      } catch (e) {
        setIsDailyError(true);
      } finally {
        setIsDailyLoading(false);
      }
    };
    fetchSpecific();
  }, [selectedDate]);

  const effectiveDate = selectedDate || summaryData?.date;

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const isLoading = isDatesLoading || (isDailyLoading && !!effectiveDate) || isSummaryLoading;
  const isError = isDatesError || isDailyError || isSummaryError;

  return (
    <DashboardLayout>
            <>
          <Header 
            dates={datesData || []} 
            selectedDate={effectiveDate} 
            onDateChange={handleDateChange} 
            isLoading={isDatesLoading}
            title={"پاني جو جائزو"}
            subtitle={"پاڻيءَ جي تجزياتي رپورٽ"}
          />

          {isError && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>غلطي</AlertTitle>
              <AlertDescription>
                ارسا (IRSA) جو ڊيٽا عارضي طور تي دستياب ناهي. مهرباني ڪري ڪجهه دير کانپوءِ ٻيهر ڪوشش ڪريو.
              </AlertDescription>
            </Alert>
          )}

          {isLoading && !isError && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-[120px] rounded-xl bg-card border border-card-border" />
                <Skeleton className="h-[120px] rounded-xl bg-card border border-card-border" />
                <Skeleton className="h-[120px] rounded-xl bg-card border border-card-border" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="h-[400px] rounded-xl bg-card border border-card-border lg:col-span-2" />
                <Skeleton className="h-[400px] rounded-xl bg-card border border-card-border" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-[400px] rounded-xl bg-card border border-card-border" />
                <Skeleton className="h-[400px] rounded-xl bg-card border border-card-border" />
              </div>
            </div>
          )}

          {!isLoading && !isError && dailyData && summaryData && (
            <div className="space-y-8">
              <HeroStats summary={summaryData} />
              
              <ReservoirLevels summary={summaryData} daily={dailyData} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RiverFlowsChart summary={summaryData} daily={dailyData} />
                </div>
                <div className="lg:col-span-1">
                  <FlowComparison daily={dailyData} summary={summaryData} />
                </div>
              </div>
              
              <ProvincialReleasesChart daily={dailyData} />
            </div>
          )}
      </>
    </DashboardLayout>
  );
}
