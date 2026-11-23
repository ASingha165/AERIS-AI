'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoomSelector } from '@/components/indoor/RoomSelector';

export default function IndoorPage() {
  return (
    <DashboardLayout>
      <RoomSelector />
    </DashboardLayout>
  );
}

