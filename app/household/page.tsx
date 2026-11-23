'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HouseholdForm } from '@/components/household/HouseholdForm';

export default function HouseholdPage() {
  return (
    <DashboardLayout>
      <HouseholdForm />
    </DashboardLayout>
  );
}

