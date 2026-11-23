import React from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { MobileNavigation } from './MobileNavigation';
import { DemonstrationNoticeBanner } from '@/components/ui/DataSourceBadge';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AppSidebar />
      <AppHeader />
      
      {/* Main Content Area */}
      <main className="lg:pl-72 pt-16 pb-20 lg:pb-10 min-h-screen">
        <div className="w-full px-4 lg:px-8 py-5 max-w-[1600px] mx-auto space-y-5">
          <DemonstrationNoticeBanner />
          {children}
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}

