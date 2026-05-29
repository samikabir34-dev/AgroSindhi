import { AvailableDate } from "@/lib/irsa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Waves, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  dates: AvailableDate[];
  selectedDate: string | undefined;
  onDateChange: (date: string) => void;
  isLoading: boolean;
  title?: string;
  subtitle?: string;
}

export function Header({ dates, selectedDate, onDateChange, isLoading, title, subtitle }: HeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-card-border"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
          <Waves className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">{title ?? 'ارسا واٽر انٽيليجنس'}</h1>
          <p className="text-sm text-muted-foreground">{subtitle ?? 'پاڪستان جي پاڻي جي صورتحال جو ڊيش بورڊ'}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
        <Select 
          value={selectedDate ?? ""} 
          onValueChange={onDateChange} 
          disabled={isLoading || dates.length === 0}
        >
          <SelectTrigger className="w-full md:w-[240px] bg-card border-card-border">
            <SelectValue placeholder="تاريخ چونڊيو" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {dates.map((date) => (
              <SelectItem key={date.date} value={date.date}>
                {date.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.header>
  );
}
