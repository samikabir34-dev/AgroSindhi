import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
    Navigation, 
    Calendar, 
    ChevronRight, 
    Search,
    Trash2,
    Leaf,
    Home
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SavedField {
    id: number;
    date: string;
    fieldName?: string;
    ndvi: number;
    ndre: number;
    ndwi: number;
}

const SavedFields = () => {
    const navigate = useNavigate();
    const { t, isRTL } = useLanguage();
    const [fields, setFields] = useState<SavedField[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('analysis_history');
        if (saved) {
            setFields(JSON.parse(saved));
        }
    }, []);

    const filteredFields = fields.filter(f => 
        (f.fieldName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deleteField = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('ڇا توهان واقعي هن ٻنيءَ جو رڪارڊ ختم ڪرڻ چاهيو ٿا؟')) {
            const updated = fields.filter(f => f.id !== id);
            setFields(updated);
            localStorage.setItem('analysis_history', JSON.stringify(updated));
            toast.success('ٻني ختم ڪئي وئي');
        }
    };

    return (
        <DashboardLayout>
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#8d7cff]/[0.04] rounded-full blur-[180px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#34d399]/[0.03] rounded-full blur-[150px]" />
            </div>

            <>
                {typeof document !== 'undefined' && (document.title = 'محفوظ ٿيل ٻنيون')}

                <div className="w-full mb-8 glass-section relative overflow-hidden">
                    <div className="absolute top-0 left-[8%] right-[8%] h-[1px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(85,230,255,0.4), rgba(141,124,255,0.4), transparent)' }} />
                    <div className="flex flex-col items-center text-center gap-6 w-full">
                        <div className="space-y-3 flex flex-col items-center">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center justify-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-[#55e6ff] transition-colors group"
                            >
                                <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> گهر واپس وجو
                            </button>
                            <div className="flex items-center justify-center gap-3">
                                <h1 className="text-4xl font-black text-white tracking-tight">
                                    {t('services.savedFields')}
                                </h1>
                            </div>
                            <p className="text-white/40 font-medium">
                                توهان جي محفوظ ڪيل سڀني سبني جو رڪارد هتي موجود آهي
                            </p>
                        </div>

                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#55e6ff] transition-colors" />
                            <Input
                                placeholder="بنيءِ جو نالو ڳوليو..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 bg-white/[0.05] border-white/10 text-white rounded-2xl h-12 focus-visible:ring-[#55e6ff]/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFields.length > 0 ? (
                        filteredFields.map((field) => (
                            <div
                                key={field.id}
                                onClick={() => navigate('/dashboard', { state: { analysis: field } })}
                                className="group glass-inner-card relative p-6 cursor-pointer overflow-hidden"
                            >
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#55e6ff]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#55e6ff]/10 flex items-center justify-center border border-[#55e6ff]/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_12px_rgba(85,230,255,0.15)]">
                                            <Navigation className="w-6 h-6 text-[#55e6ff]" />
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-black text-white/30 tracking-widest uppercase">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {field.date}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-black text-white/90 group-hover:text-white mb-4 tracking-tight">
                                        {field.fieldName || 'بي نام ٻني'}
                                    </h2>

                                    <div className="flex gap-2 mb-5 flex-wrap">
                                        <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                            NDVI: {field.ndvi.toFixed(3)}
                                        </span>
                                        <span className="text-xs font-black px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400">
                                            NDRE: {field.ndre.toFixed(3)}
                                        </span>
                                        <span className="text-xs font-black px-3 py-1 rounded-full bg-[#55e6ff]/10 border border-[#55e6ff]/20 text-[#55e6ff]">
                                            NDWI: {field.ndwi.toFixed(3)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                                        <div className="flex items-center gap-2 text-[#55e6ff] text-xs font-black group-hover:translate-x-1 transition-transform">
                                            رپورٽ ڏسو <ChevronRight className="w-4 h-4" />
                                        </div>
                                        <button
                                            onClick={(e) => deleteField(field.id, e)}
                                            className="p-3 rounded-2xl bg-rose-500/5 hover:bg-rose-500/20 text-rose-500/40 hover:text-rose-500 transition-all border border-rose-500/10"
                                            title="حذف ڪريو"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                            <div className="glass-inner-card w-full py-16 flex flex-col items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <Leaf className="w-10 h-10 text-white/10" />
                                </div>
                                <h3 className="text-xl font-black text-white/80">ڪا به ٻني نه ملي</h3>
                                <p className="text-white/30 text-sm max-w-[1220px]">
                                    توهان اڃا تائين ڪا به ٻني محفوظ نه ڪئي آهي. نقشي تي وڃي نئين ٻني شامل ڪريو.
                                </p>
                                <button
                                    onClick={() => navigate('/map')}
                                    className="btn-brand px-8 py-3"
                                >
                                    نقشي تي وڃو
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </>
        </DashboardLayout>
    );
};

export default SavedFields;
