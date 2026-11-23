'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SustainableComparison } from '@/components/impact/SustainableComparison';

export default function ImpactPage() {
  return (
    <DashboardLayout>
      <SustainableComparison />
    </DashboardLayout>
  );
}

