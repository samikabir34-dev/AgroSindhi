import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Map,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Navigation,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import EarthLogo from '@/components/EarthLogo';
import '@/orbit-logo.css';

interface NavItem {
    path: string;
    label: string;
    icon: React.ElementType;
}

const Sidebar = () => {
    const { t, isRTL } = useLanguage();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems: NavItem[] = [
        { path: '/map', label: t('common.map'), icon: Map },
        { path: '/saved-fields', label: t('services.savedFields'), icon: Navigation },
        { path: '/dashboard', label: t('common.dashboard'), icon: LayoutDashboard }
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn(
                "flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]",
                isCollapsed && "justify-center px-2"
            )}>
                <div className="shrink-0">
                    <EarthLogo />
                </div>
                {!isCollapsed && (
                    <span className="text-base font-black text-white tracking-tight">TerraSight</span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            title={isCollapsed ? item.label : undefined}
                            className={cn(
                                "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-white/30 hover:text-white/70 hover:bg-white/[0.04]",
                                isCollapsed && "justify-center px-2"
                            )}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-primary to-secondary rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                            )}

                            <Icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-primary" : "text-white/30 group-hover:text-white/60"
                            )} />

                            {!isCollapsed && (
                                <span className={cn(
                                    "text-sm font-semibold",
                                    isActive ? "text-primary" : "text-white/40 group-hover:text-white/70"
                                )}>
                                    {item.label}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Toggle Button */}
            <div className="hidden lg:block px-2 py-3 border-t border-white/[0.06]">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all",
                        isCollapsed && "justify-center px-2"
                    )}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[#0d0d14]/80 backdrop-blur-xl text-white/60 shadow-xl border border-white/[0.06]"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
                "lg:hidden fixed top-0 left-0 h-full w-56 bg-[#0d0d14] border-r border-white/[0.06] z-50 transform transition-transform duration-300",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white/60"
                >
                    <X className="w-4 h-4" />
                </button>
                <SidebarContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden lg:flex flex-col h-screen bg-[#0d0d14] border-r border-white/[0.06] transition-all duration-300",
                isCollapsed ? "w-16" : "w-48"
            )}>
                <SidebarContent />
            </aside>
        </>
    );
};

export default Sidebar;
