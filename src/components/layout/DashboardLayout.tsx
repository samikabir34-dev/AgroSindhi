import React from 'react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden selection:bg-primary/30">
                <Navbar hideSearchBar={true} hideActionButtons={false} />
                <main className="flex-1 relative overflow-hidden flex flex-col pt-12 sm:pt-14">
                    <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-y-auto">
                        <div className="p-6 lg:p-8 max-w-[1220px] mx-auto w-full">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
    );
};

export default DashboardLayout;
