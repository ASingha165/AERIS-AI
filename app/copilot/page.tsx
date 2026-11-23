'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatInterface } from '@/components/copilot/ChatInterface';

export default function CopilotPage() {
  return (
    <DashboardLayout>
      <ChatInterface />
    </DashboardLayout>
  );
}

