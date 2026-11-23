import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Bot,
  Calendar,
  Users,
  Leaf,
  Wind,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { DEMO_AIR_QUALITY_READING } from '@/lib/demo-data';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080F1C] text-on-surface selection:bg-primary-container selection:text-[#003829]">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#080F1C]/85 backdrop-blur-xl border-b border-[#1F334E] z-50">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-background font-heading font-black text-sm shadow-glow-primary">
              <Sparkles className="w-4 h-4 text-[#080F1C]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-on-surface leading-none">
                AERIS<span className="text-primary-container">-AI</span>
              </span>
              <span className="font-heading text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
                Atmospheric Intel
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
            <Link href="/dashboard" className="hover:text-primary-container transition-colors">
              Live Dashboard
            </Link>
            <Link href="/copilot" className="hover:text-primary-container transition-colors">
              AI Copilot
            </Link>
            <Link href="/planner" className="hover:text-primary-container transition-colors">
              Daily Planner
            </Link>
            <Link href="/indoor" className="hover:text-primary-container transition-colors">
              Indoor Guardian
            </Link>
            <Link href="/impact" className="hover:text-primary-container transition-colors">
              Impact Explorer
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-[#003829] font-heading text-xs font-bold hover:shadow-glow-primary transition-all"
            >
              <span>Explore Your Air</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Ambient atmospheric particle blurs */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Challenge Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#142235] border border-[#1F334E] text-xs font-heading text-primary-container mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>PromptWars Challenge 6 • Urban Air Quality Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-on-surface max-w-4xl mx-auto leading-[1.1]">
            Every Breath Deserves a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-secondary to-primary">
              Better Decision.
            </span>
          </h1>

          {/* Tagline & Subtitle */}
          <p className="font-heading text-lg sm:text-xl text-primary-container font-semibold mt-4">
            Breathe Smarter. Live Better.
          </p>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mt-2 leading-relaxed">
            AERIS-AI is an environmental intelligence platform that combines air-quality information, household vulnerability context, and AI-assisted reasoning to help you make better everyday decisions.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary-container text-[#003829] font-heading text-sm font-bold shadow-glow-primary hover:shadow-glow-primary-lg transition-all"
            >
              <span>Explore Your Air</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/copilot"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#142235] hover:bg-[#19202D] text-on-surface font-heading text-sm border border-[#1F334E] hover:border-secondary transition-all"
            >
              <Bot className="w-4 h-4 text-secondary" />
              <span>Meet AERIS AI</span>
            </Link>
          </div>

          {/* Live Atmospheric Telemetry Snapshot Banner */}
          <div className="mt-14 max-w-3xl mx-auto p-4 rounded-2xl bg-[#142235]/90 border border-[#1F334E] shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/20 border border-warning/40 flex items-center justify-center text-warning font-heading font-bold text-lg">
                168
              </div>
              <div>
                <span className="font-heading text-xs font-bold text-on-surface block">
                  Kolkata, WB — Park Street Ward 63
                </span>
                <span className="text-[11px] font-mono text-warning">
                  Unhealthy for Sensitive Groups • Primary: PM2.5
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-lg bg-[#101C2B] border border-[#1F334E]">
                <span className="text-outline">PM2.5:</span>{' '}
                <span className="text-danger font-bold">88.4 µg/m³</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#101C2B] border border-[#1F334E]">
                <span className="text-outline">Safe Window:</span>{' '}
                <span className="text-primary font-bold">13:30 - 15:30</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What AERIS Is Not vs What AERIS Is */}
      <section className="py-16 bg-[#101C2B]/70 border-y border-[#1F334E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
              Built Different: Decision Intelligence, Not Generic Data
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              AERIS-AI exists to solve real human decisions when the air around you turns hazardous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* NOT Card */}
            <div className="p-6 rounded-2xl bg-[#080F1C] border border-danger/30 space-y-4">
              <span className="font-heading text-xs font-bold text-danger uppercase tracking-wider block">
                What AERIS-AI Is NOT
              </span>
              <ul className="space-y-3 text-sm text-on-surface-variant">
                <li className="flex items-start gap-2.5">
                  <span className="text-danger font-bold">✕</span>
                  <span><strong>Not a generic conversational chatbot</strong> hallucinating health advice without grounding.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-danger font-bold">✕</span>
                  <span><strong>Not a conventional weather app</strong> presenting static AQI numbers with zero context.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-danger font-bold">✕</span>
                  <span><strong>Not a dashboard filled with meaningless charts</strong> that fail to tell you when to open windows.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-danger font-bold">✕</span>
                  <span><strong>Not a system that fabricates indoor sensors</strong> or claims unverified clean air readings.</span>
                </li>
              </ul>
            </div>

            {/* IS Card */}
            <div className="p-6 rounded-2xl bg-[#142235] border border-primary-container/40 shadow-glow-primary space-y-4">
              <span className="font-heading text-xs font-bold text-primary-container uppercase tracking-wider block">
                What AERIS-AI Delivers
              </span>
              <ul className="space-y-3 text-sm text-on-surface">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
                  <span><strong>Household-Level Personalization:</strong> Adapts guidance for children with asthma, elderly heart patients, and floor level.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
                  <span><strong>Pollution-Aware Daily Planning:</strong> Identifies safer windows for jogs, school commutes, and ventilation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
                  <span><strong>Indoor Air Guardian:</strong> Evidence-based room-by-room interventions and DIY box-fan alternatives under ₹1,800.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
                  <span><strong>Sustainable Impact Explorer:</strong> Quantifies avoided tailpipe emissions and cumulative lung exposure reductions.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Six Pillars Platform Architecture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-heading text-xs text-primary uppercase font-bold tracking-wider">
              Core Platform Modules
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-on-surface mt-1">
              End-to-End Atmospheric Intelligence
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Explore the six interconnected modules driving environmental decisions across your day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Dashboard */}
            <Link
              href="/dashboard"
              className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] hover:border-primary-container/50 shadow-surface-card transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 text-primary-container" />
                </div>
                <h3 className="font-heading text-lg font-bold text-on-surface group-hover:text-primary-container transition-colors">
                  Air Intelligence Dashboard
                </h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Real-time CPCB and OpenAQ-grounded telemetry for PM2.5, PM10, NO2, and O3 with 24-hour predictive horizon models.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F334E]/60 flex items-center justify-between text-xs font-mono text-primary">
                <span>View Live HUD</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* 2. AI Copilot */}
            <Link
              href="/copilot"
              className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] hover:border-secondary/50 shadow-surface-card transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary mb-4 group-hover:scale-105 transition-transform">
                  <Bot className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
                  Conversational AI Copilot
                </h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Ask nuanced questions like outdoor sports timing for asthmatic children, mask protocols, and diurnal boundary layer shifts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F334E]/60 flex items-center justify-between text-xs font-mono text-secondary">
                <span>Launch Copilot</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* 3. Daily Planner */}
            <Link
              href="/planner"
              className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] hover:border-primary-container/50 shadow-surface-card transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5 text-primary-container" />
                </div>
                <h3 className="font-heading text-lg font-bold text-on-surface group-hover:text-primary-container transition-colors">
                  Pollution-Aware Daily Planner
                </h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Select morning walk, cycling, or transit routines to discover optimal low-smog windows that cut lung exposure by up to 45%.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F334E]/60 flex items-center justify-between text-xs font-mono text-primary">
                <span>Plan Routine</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* 4. My Household */}
            <Link
              href="/household"
              className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] hover:border-warning/50 shadow-surface-card transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center text-warning mb-4 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-warning" />
                </div>
                <h3 className="font-heading text-lg font-bold text-on-surface group-hover:text-warning transition-colors">
                  Household Personalization
                </h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Tailor protective guidance to building elevation, proximity to arterial roads, family age groups, and chronic conditions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F334E]/60 flex items-center justify-between text-xs font-mono text-warning">
                <span>Configure Profile</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* 5. Indoor Guardian */}
            <Link
              href="/indoor"
              className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] hover:border-primary-container/50 shadow-surface-card transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5 text-primary-container" />
                </div>
                <h3 className="font-heading text-lg font-bold text-on-surface group-hover:text-primary-container transition-colors">
                  Indoor Air Guardian
                </h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Room-specific ventilation rules, door sweep drafts, kitchen exhaust timings, and low-cost DIY Corsi-Rosenthal box fan filtration.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F334E]/60 flex items-center justify-between text-xs font-mono text-primary">
                <span>Explore Rooms</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* 6. Impact Explorer */}
            <Link
              href="/impact"
              className="p-6 rounded-2xl bg-[#142235] border border-[#1F334E] hover:border-secondary/50 shadow-surface-card transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary mb-4 group-hover:scale-105 transition-transform">
                  <Leaf className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
                  Sustainable Impact Explorer
                </h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Evaluate CO2 and PM emission savings across metro, cycling, and electric bus vs cars, tracking collective clean-air offset.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F334E]/60 flex items-center justify-between text-xs font-mono text-secondary">
                <span>Calculate Impact</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-[#101C2B] to-[#080F1C] border-t border-[#1F334E]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-on-surface tracking-tight">
            Take Control of the Air You Breathe.
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Stop guessing whether it is safe to send children outside or when to open windows. Make scientifically backed decisions with AERIS-AI.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-primary-container text-[#003829] font-heading text-sm font-bold shadow-glow-primary hover:shadow-glow-primary-lg transition-all"
            >
              <span>Launch AERIS Environmental HUD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#070E1B] border-t border-[#1F334E] text-xs text-outline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-heading text-sm font-bold text-on-surface">
              AERIS-AI
            </span>
            <span>Hack2Skill PromptWars Virtual • Challenge 6 — Urban Air Quality Assistant</span>
            <span>Developed for Deadline: November 29, 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/dashboard" className="hover:text-on-surface transition-colors">
              Dashboard
            </Link>
            <Link href="/copilot" className="hover:text-on-surface transition-colors">
              Copilot
            </Link>
            <Link href="/planner" className="hover:text-on-surface transition-colors">
              Planner
            </Link>
            <Link href="/indoor" className="hover:text-on-surface transition-colors">
              Indoor Guardian
            </Link>
            <Link href="/settings" className="hover:text-on-surface transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

