import { Suspense } from 'react';
import { getInitiatives, getSiteConfig } from '@/lib/api';
import InitiativesGrid from '@/components/initiatives/InitiativesGrid';
import LoadingCard from '@/components/LoadingCard';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Our Initiatives - Win Foundations',
};

const FALLBACK_HEADER = {
  heading: 'Our Initiatives',
  subtext: 'Transforming lives through focused programs',
};

async function InitiativesContent() {
  const initiatives = await getInitiatives();

  return <InitiativesGrid initiatives={initiatives} />;
}

export default async function InitiativesPage() {
  const config = await getSiteConfig().catch(() => ({} as Record<string, string>));
  const header = {
    heading: config.initiativesHeroHeading || FALLBACK_HEADER.heading,
    subtext: config.initiativesHeroSubtext || FALLBACK_HEADER.subtext,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton light className="mb-3" />
          <h1 className="text-4xl font-bold">{header.heading}</h1>
          <p className="text-lg text-blue-100 mt-2">{header.subtext}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </div>
          }
        >
          <InitiativesContent />
        </Suspense>
      </div>
    </div>
  );
}
