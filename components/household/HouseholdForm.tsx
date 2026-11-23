'use client';

import React, { useState } from 'react';
import {
  Users,
  Home,
  ShieldAlert,
  Plus,
  Trash2,
  HeartPulse,
  Wind,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { DEMO_HOUSEHOLD_PROFILES } from '@/lib/demo-data';
import { HouseholdProfile, FamilyMember } from '@/types/household';
import { cn } from '@/lib/utils';

export function HouseholdForm() {
  const [profile, setProfile] = useState<HouseholdProfile>(DEMO_HOUSEHOLD_PROFILES[0]);
  const [activeTab, setActiveTab] = useState<'profile' | 'members' | 'vulnerability'>('profile');

  const addMember = () => {
    const newMember: FamilyMember = {
      id: `mem-${Date.now()}`,
      name: 'New Family Member',
      relation: 'Member',
      ageGroup: 'adult',
      age: 30,
      respiratorySensitivity: 'mild',
      hasAsthma: false,
      hasCardiovascularCondition: false,
      dailyOutdoorHours: 1.0,
    };
    setProfile((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  };

  const removeMember = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-[10px] text-primary uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Household Personalization Engine</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            My Household Profile
          </h1>
          <p className="text-sm text-on-surface-variant max-w-xl mt-1">
            Personalize air quality intelligence based on residential geometry, vulnerable individuals, and daily routines.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 rounded-xl bg-[#101C2B] border border-[#1F334E]">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-heading font-medium transition-all',
              activeTab === 'profile'
                ? 'bg-primary-container text-[#003829] font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            Home Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-heading font-medium transition-all',
              activeTab === 'members'
                ? 'bg-primary-container text-[#003829] font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            Family Members ({profile.members.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vulnerability')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-heading font-medium transition-all',
              activeTab === 'vulnerability'
                ? 'bg-primary-container text-[#003829] font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            Vulnerability Index
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card space-y-5">
            <h3 className="font-heading text-base font-semibold text-on-surface">
              Residential Micro-Zone Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-heading text-xs text-outline uppercase block mb-1.5">
                  Household Name
                </label>
                <input
                  type="text"
                  value={profile.householdName}
                  onChange={(e) => setProfile({ ...profile, householdName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101C2B] text-on-surface text-sm border border-[#1F334E] focus:outline-none focus:border-primary-container"
                />
              </div>

              <div>
                <label className="font-heading text-xs text-outline uppercase block mb-1.5">
                  Neighborhood / Ward
                </label>
                <input
                  type="text"
                  value={profile.neighborhood}
                  onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101C2B] text-on-surface text-sm border border-[#1F334E] focus:outline-none focus:border-primary-container"
                />
              </div>

              <div>
                <label className="font-heading text-xs text-outline uppercase block mb-1.5">
                  Building Typology
                </label>
                <select
                  value={profile.homeType}
                  onChange={(e) => setProfile({ ...profile, homeType: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101C2B] text-on-surface text-sm border border-[#1F334E] focus:outline-none focus:border-primary-container"
                >
                  <option value="apartment-high-rise">Apartment (High-Rise 4th+ Floor)</option>
                  <option value="apartment-low-rise">Apartment (Low-Rise Ground-3rd)</option>
                  <option value="independent-house">Independent House / Villa</option>
                  <option value="dense-cluster">Dense Urban Cluster</option>
                </select>
              </div>

              <div>
                <label className="font-heading text-xs text-outline uppercase block mb-1.5">
                  Distance to Arterial Road (m)
                </label>
                <input
                  type="number"
                  value={profile.distanceToMajorRoadMeters}
                  onChange={(e) => setProfile({ ...profile, distanceToMajorRoadMeters: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101C2B] text-on-surface text-sm border border-[#1F334E] focus:outline-none focus:border-primary-container"
                />
              </div>

              <div>
                <label className="font-heading text-xs text-outline uppercase block mb-1.5">
                  Active Air Purifiers
                </label>
                <input
                  type="number"
                  value={profile.airPurifiersCount}
                  onChange={(e) => setProfile({ ...profile, airPurifiersCount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101C2B] text-on-surface text-sm border border-[#1F334E] focus:outline-none focus:border-primary-container"
                />
              </div>

              <div>
                <label className="font-heading text-xs text-outline uppercase block mb-1.5">
                  Cooking Fuel
                </label>
                <select
                  value={profile.cookingFuelType}
                  onChange={(e) => setProfile({ ...profile, cookingFuelType: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101C2B] text-on-surface text-sm border border-[#1F334E] focus:outline-none focus:border-primary-container"
                >
                  <option value="lpg">LPG Piped / Cylinder</option>
                  <option value="induction">Electric Induction / Clean Energy</option>
                  <option value="biomass">Biomass / Solid Fuel</option>
                  <option value="kerosene">Kerosene</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col justify-between space-y-4">
            <div>
              <span className="font-heading text-[10px] uppercase text-outline tracking-wider">
                Micro-Zone Assessment
              </span>
              <h4 className="font-heading text-lg font-bold text-on-surface mt-1">
                AERIS Infiltration Metric
              </h4>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                4th floor elevation provides 18% protection against heavy coarse road dust (PM10), but fine combustion particles (PM2.5) infiltrate freely without active seals.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080F1C] border border-[#1F334E] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-outline">Air Cleanliness Shield:</span>
                <span className="text-primary font-bold">Moderate (54%)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-outline">Indoor Bio-Purification:</span>
                <span className="text-secondary font-bold">14 Plants</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-on-surface">
              Household Inhabitants & Sensitivity Roster
            </h3>
            <button
              type="button"
              onClick={addMember}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-container text-[#003829] font-heading text-xs font-bold hover:shadow-glow-primary transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.members.map((member) => (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading text-base font-bold text-on-surface">
                        {member.name}
                      </h4>
                      <span className="font-mono text-xs text-outline">
                        {member.relation} • Age {member.age}
                      </span>
                    </div>
                    {profile.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="p-1 rounded-lg text-outline hover:text-danger hover:bg-danger/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-outline">Sensitivity:</span>
                      <span
                        className={cn(
                          'font-mono text-xs font-bold px-2 py-0.5 rounded',
                          member.respiratorySensitivity === 'severe' && 'bg-danger/20 text-danger',
                          member.respiratorySensitivity === 'moderate' && 'bg-warning/20 text-warning',
                          member.respiratorySensitivity === 'mild' && 'bg-secondary/20 text-secondary',
                          member.respiratorySensitivity === 'none' && 'bg-success/20 text-success'
                        )}
                      >
                        {member.respiratorySensitivity.toUpperCase()}
                      </span>
                    </div>

                    {member.hasAsthma && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-danger font-mono bg-danger/10 px-2 py-0.5 rounded border border-danger/20">
                        <HeartPulse className="w-3.5 h-3.5" />
                        Asthma Protocol Active
                      </div>
                    )}
                    {member.hasCardiovascularCondition && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-warning font-mono bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                        <HeartPulse className="w-3.5 h-3.5" />
                        Cardiovascular Vigilance
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1F334E] flex justify-between text-xs text-outline font-mono">
                  <span>Daily Outdoor:</span>
                  <span className="text-on-surface font-semibold">{member.dailyOutdoorHours} hrs/day</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vulnerability Index Tab */}
      {activeTab === 'vulnerability' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full border-4 border-warning/60 bg-warning/10 flex flex-col items-center justify-center shadow-lg">
              <span className="font-heading text-4xl font-black text-warning">
                {profile.vulnerabilityIndexScore}
              </span>
              <span className="font-heading text-[10px] text-outline uppercase tracking-wider">
                Scale 0 - 100
              </span>
            </div>

            <div>
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-warning px-3 py-1 rounded-full bg-warning/20 border border-warning/30">
                {profile.vulnerabilityCategory} Vulnerability Household
              </span>
              <h3 className="font-heading text-lg font-bold text-on-surface mt-3">
                Compound Risk Profile
              </h3>
              <p className="text-xs text-on-surface-variant max-w-sm mt-1 leading-relaxed">
                Aggregated from pediatric asthma factors, geriatric cardiovascular risks, and proximity to the Park Street traffic artery.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#142235] border border-[#1F334E] shadow-surface-card space-y-4">
            <h3 className="font-heading text-base font-semibold text-on-surface">
              Tailored Safeguard Guidelines
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#101C2B] border border-[#1F334E] flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-heading text-xs font-semibold text-on-surface">
                    Early Morning Outdoor Lockout for Children
                  </span>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Reschedule Ananya&apos;s outdoor physical play past 13:00 to avoid cold-air bronchospasm triggered by nocturnal inversion.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101C2B] border border-[#1F334E] flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-heading text-xs font-semibold text-on-surface">
                    Senior Cardiovascular Evening Protocol
                  </span>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Ensure Mr. Bimal Sen remains indoors with filtered circulation after 17:30 as fine particulate causes micro-vascular arterial constriction.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101C2B] border border-[#1F334E] flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-heading text-xs font-semibold text-on-surface">
                    Range Hood Pre-Purge during Cooking
                  </span>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Running the exhaust chimney reduces indoor nitrogen combustion spikes that exacerbate pediatric airway inflammation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
