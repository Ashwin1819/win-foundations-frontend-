import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import InitiativesPreview from '@/components/home/InitiativesPreview';
import CampaignsPreview from '@/components/home/CampaignsPreview';
import PartnersSection from '@/components/home/PartnersSection';
import PresenceMap from '@/components/home/PresenceMap';
import GetInvolvedBanner from '@/components/home/GetInvolvedBanner';
import MissionQuoteSection from '@/components/home/MissionQuoteSection';
import CTAStrip from '@/components/home/CTAStrip';
import LoadingCard from '@/components/LoadingCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse" />}>
        <HeroSection />
      </Suspense>

      {/* Campaigns Preview - hides itself when there are no active campaigns */}
      <Suspense fallback={null}>
        <CampaignsPreview />
      </Suspense>

      {/* Working Locations */}
      <PresenceMap />

      {/* Get Involved Banner */}
      <GetInvolvedBanner />

      {/* Mission Quote */}
      <MissionQuoteSection />

      {/* Initiatives Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-widest text-blue-700 text-sm font-semibold mb-3 text-center">
            Our Work
          </p>
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Initiatives</h2>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </div>
            }
          >
            <InitiativesPreview />
          </Suspense>
        </div>
      </section>

      {/* Partners - hides itself when there are no partners */}
      <Suspense fallback={null}>
        <PartnersSection />
      </Suspense>

      {/* CTA Strip */}
      <Suspense fallback={<div className="h-32 bg-gray-200" />}>
        <CTAStrip />
      </Suspense>
    </div>
  );
}
