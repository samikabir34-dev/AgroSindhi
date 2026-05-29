import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Droplets,
    Leaf,
    AlertTriangle,
    CheckCircle,
    MapPin,
    Grid3X3,
    Layers,
    Filter,
    Search,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FieldSection {
    id: string;
    name: string;
    coordinates: { lat: number; lng: number }[];
    ndvi: number;
    ndre: number;
    ndwi: number;
    healthScore: number;
    issues: string[];
    recommendations: string[];
    area: number; // in square meters
}

interface AnalysisSectionsProps {
    sections: FieldSection[];
    onSectionSelect?: (section: FieldSection) => void;
    selectedSectionId?: string;
    isExpanded?: boolean;
    onExpandChange?: (expanded: boolean) => void;
}

const AnalysisSections: React.FC<AnalysisSectionsProps> = ({
    sections,
    onSectionSelect,
    selectedSectionId,
    isExpanded = true,
    onExpandChange
}) => {
    const { t } = useLanguage();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterIssue, setFilterIssue] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const sectionsPerPage = 6;

    // Get all unique issues for filtering
    const allIssues = Array.from(new Set(sections.flatMap(s => s.issues)));

    // Filter and search sections
    const filteredSections = sections.filter(section => {
        const matchesSearch = section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = !filterIssue || section.issues.includes(filterIssue);
        return matchesSearch && matchesFilter;
    });

    // Pagination
    const totalPages = Math.ceil(filteredSections.length / sectionsPerPage);
    const paginatedSections = filteredSections.slice(
        currentPage * sectionsPerPage,
        (currentPage + 1) * sectionsPerPage
    );

    const getHealthColor = (score: number) => {
        if (score >= 70) return { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' };
        if (score >= 50) return { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50', border: 'border-green-200' };
        if (score >= 30) return { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-amber-50', border: 'border-amber-200' };
        return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-200' };
    };

    const SectionCard: React.FC<{ section: FieldSection }> = ({ section }) => {
        const colors = getHealthColor(section.healthScore);
        const isSelected = selectedSectionId === section.id;

        return (
            <button
                onClick={() => onSectionSelect?.(section)}
                className={cn(
                    "w-full text-left p-4 rounded-2xl border-2 transition-all duration-300",
                    "hover:shadow-lg hover:scale-[1.02]",
                    isSelected
                        ? "border-blue-500 bg-yellow-50 shadow-lg shadow-blue-600/20"
                        : "border-[rgba(255,255,255,0.06)] bg-[rgba(21,32,43,0.8)] hover:border-[rgba(255,255,255,0.1)]"
                )}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            colors.light
                        )}>
                            <MapPin className={cn("w-5 h-5", colors.text)} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">{section.name}</h4>
                            <p className="text-xs text-muted-foreground">{(section.area / 10000).toFixed(2)} hectares</p>
                        </div>
                    </div>
                    <div className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-bold",
                        colors.light, colors.text
                    )}>
                        {section.healthScore}%
                    </div>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-green-50 text-center">
                        <p className="text-[10px] text-muted-foreground font-medium">NDVI</p>
                        <p className="text-sm font-bold text-green-600 font-mono">{section.ndvi.toFixed(2)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 text-center">
                        <p className="text-[10px] text-muted-foreground font-medium">NDRE</p>
                        <p className="text-sm font-bold text-emerald-600 font-mono">{section.ndre.toFixed(2)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 text-center">
                        <p className="text-[10px] text-muted-foreground font-medium">NDWI</p>
                        <p className="text-sm font-bold text-blue-600 font-mono">{section.ndwi.toFixed(2)}</p>
                    </div>
                </div>

                {/* Issues Tags */}
                {section.issues.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {section.issues.slice(0, 2).map((issue, i) => (
                            <span
                                key={i}
                                className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium"
                            >
                                {issue}
                            </span>
                        ))}
                        {section.issues.length > 2 && (
                            <span className="px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] text-muted-foreground text-[10px] font-medium">
                                +{section.issues.length - 2} more
                            </span>
                        )}
                    </div>
                )}
            </button>
        );
    };

    const SectionListItem: React.FC<{ section: FieldSection }> = ({ section }) => {
        const colors = getHealthColor(section.healthScore);
        const isSelected = selectedSectionId === section.id;

        return (
            <button
                onClick={() => onSectionSelect?.(section)}
                className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center gap-4",
                    "hover:shadow-md",
                    isSelected
                        ? "border-blue-500 bg-yellow-50"
                        : "border-[rgba(255,255,255,0.06)] bg-[rgba(21,32,43,0.8)] hover:border-[rgba(255,255,255,0.1)]"
                )}
            >
                <div className={cn("w-2 h-12 rounded-full", colors.bg)} />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground truncate">{section.name}</h4>
                        {section.issues.length > 0 && (
                            <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0" />
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">{(section.area / 10000).toFixed(2)} ha • {section.issues.length} issues</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-[10px] text-muted-foreground">NDVI</p>
                            <p className="text-xs font-mono font-medium text-green-600">{section.ndvi.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground">NDRE</p>
                            <p className="text-xs font-mono font-medium text-emerald-600">{section.ndre.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground">NDWI</p>
                            <p className="text-xs font-mono font-medium text-blue-600">{section.ndwi.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-bold",
                        colors.light, colors.text
                    )}>
                        {section.healthScore}
                    </div>
                </div>
            </button>
        );
    };

    // Selected Section Detail
    const selectedSection = sections.find(s => s.id === selectedSectionId);

    return (
        <div className={cn(
            "bg-[rgba(21,32,43,0.8)]/90 backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)]/50 shadow-xl overflow-hidden transition-all duration-300",
            isExpanded ? "h-auto" : "h-14"
        )}>
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)] cursor-pointer hover:bg-midnight transition-colors"
                onClick={() => onExpandChange?.(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-500 shadow-lg shadow-blue-600/30">
                        <Layers className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Field Sections</h3>
                        <p className="text-xs text-muted-foreground">{sections.length} sections analyzed</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{filteredSections.length} shown</span>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4">
                    <Tabs defaultValue="sections" className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-[rgba(255,255,255,0.05)]">
                                <TabsTrigger value="sections" className="gap-1.5">
                                    <Grid3X3 className="w-4 h-4" />
                                    All Sections
                                </TabsTrigger>
                                <TabsTrigger value="detail" className="gap-1.5" disabled={!selectedSection}>
                                    <MapPin className="w-4 h-4" />
                                    Section Detail
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                    className="gap-1.5"
                                >
                                    {viewMode === 'grid' ? <Layers className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        <TabsContent value="sections" className="mt-0">
                            {/* Search & Filter */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search sections..."
                                        className="pl-10 h-10"
                                    />
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        variant={filterIssue ? "outline" : "default"}
                                        size="sm"
                                        onClick={() => setFilterIssue(null)}
                                        className={cn(!filterIssue && "bg-gray-900")}
                                    >
                                        All
                                    </Button>
                                    {allIssues.slice(0, 3).map((issue) => (
                                        <Button
                                            key={issue}
                                            variant={filterIssue === issue ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setFilterIssue(filterIssue === issue ? null : issue)}
                                            className={cn(filterIssue === issue && "bg-blue-500 hover:bg-blue-600")}
                                        >
                                            {issue}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Sections Grid/List */}
                            <div className={cn(
                                viewMode === 'grid'
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                    : "space-y-3"
                            )}>
                                {paginatedSections.map((section) => (
                                    viewMode === 'grid'
                                        ? <SectionCard key={section.id} section={section} />
                                        : <SectionListItem key={section.id} section={section} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                        disabled={currentPage === 0}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Button
                                            key={i}
                                            variant={currentPage === i ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(i)}
                                            className={cn(currentPage === i && "bg-blue-600 hover:bg-blue-700")}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="detail" className="mt-0">
                            {selectedSection && (
                                <div className="space-y-6">
                                    {/* Section Header */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">{selectedSection.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Area: {(selectedSection.area / 10000).toFixed(2)} hectares
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-2 rounded-xl text-xl font-bold",
                                            getHealthColor(selectedSection.healthScore).light,
                                            getHealthColor(selectedSection.healthScore).text
                                        )}>
                                            {selectedSection.healthScore}%
                                        </div>
                                    </div>

                                    {/* Detailed Stats */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-5 h-5 text-green-600" />
                                                <span className="text-sm font-medium text-foreground/80">NDVI</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-600 font-mono">
                                                {selectedSection.ndvi.toFixed(3)}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Vegetation Index</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Leaf className="w-5 h-5 text-emerald-600" />
                                                <span className="text-sm font-medium text-foreground/80">NDRE</span>
                                            </div>
                                            <p className="text-2xl font-bold text-emerald-600 font-mono">
                                                {selectedSection.ndre.toFixed(3)}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Chlorophyll</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Droplets className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium text-foreground/80">NDWI</span>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-600 font-mono">
                                                {selectedSection.ndwi.toFixed(3)}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Water Content</p>
                                        </div>
                                    </div>

                                    {/* Issues */}
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertTriangle className="w-5 h-5 text-blue-600" />
                                            <span className="font-semibold text-amber-800">Detected Issues</span>
                                        </div>
                                        {selectedSection.issues.length > 0 ? (
                                            <ul className="space-y-2">
                                                {selectedSection.issues.map((issue, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                                                        {issue}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No issues detected</p>
                                        )}
                                    </div>

                                    {/* Recommendations */}
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <span className="font-semibold text-emerald-800">Recommendations</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {selectedSection.recommendations.map((rec, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
};

export default AnalysisSections;
