import { Suspense } from 'react';
import { getCampaigns, getSettings } from '@/lib/api';
import CampaignsGrid from '@/components/campaigns/CampaignsGrid';
import LoadingCard from '@/components/LoadingCard';

export const metadata = {
  title: 'Active Campaigns - Win Foundations',
};

async function CampaignsContent() {
  const [campaigns, settings] = await Promise.all([getCampaigns(), getSettings()]);

  return (
    <CampaignsGrid
      campaigns={campaigns}
      logo={settings.logo}
      taxBenefitEligible={!!settings.trust80G}
    />
  );
}

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <p className="uppercase tracking-widest text-blue-200 text-sm font-semibold mb-4">
            Make An Impact
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Active Campaigns
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join us in making a difference
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Suspense
          fallback={
            <div className="flex flex-wrap justify-center gap-8">
              <div className="w-full sm:w-[340px] lg:w-[360px]"><LoadingCard /></div>
              <div className="w-full sm:w-[340px] lg:w-[360px]"><LoadingCard /></div>
              <div className="w-full sm:w-[340px] lg:w-[360px]"><LoadingCard /></div>
            </div>
          }
        >
          <CampaignsContent />
        </Suspense>
      </div>
    </div>
  );
}
