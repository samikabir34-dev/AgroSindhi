import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean;
    fullHeight?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    showSidebar = true,
    fullHeight = true
}) => {
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if we're on a page that should hide the sidebar
    const hideSidebarPaths = ['/'];
    const shouldShowSidebar = showSidebar && !hideSidebarPaths.includes(location.pathname);

    // Handle responsive behavior
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-collapse on mobile
    useEffect(() => {
        if (isMobile) {
            setIsSidebarCollapsed(true);
        }
    }, [isMobile]);

    if (!shouldShowSidebar) {
        return <>{children}</>;
    }

    return (
        <div className={cn(
            "flex",
            fullHeight && "min-h-screen"
        )}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className={cn(
                "flex-1 transition-all duration-300 relative",
                fullHeight && "h-screen overflow-hidden",
                // Add left padding on mobile to account for menu button
                "lg:pl-0 pl-0"
            )}>
                {/* background intentionally left transparent so global body gradient and particle animation show through */}

                {/* Content container */}
                <div className={cn(
                    "h-full w-full",
                    fullHeight && "overflow-auto"
                )}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
