import { Suspense } from 'react';
import { getSettings, getSiteConfig, getCoreValues } from '@/lib/api';
import LoadingCard from '@/components/LoadingCard';
import BackButton from '@/components/BackButton';

export async function generateMetadata() {
  return {
    title: 'About Us - Win Foundations',
    description: 'Learn about Win Foundations mission, vision, and values',
  };
}

const FALLBACK_CONTENT = {
  aboutHeroEyebrow: 'About Us',
  aboutHeroHeading: 'About Win Foundations',
  aboutHeroSubtext: 'Creating positive impact through education, healthcare, and community empowerment',
  missionHeading: 'Mission',
  missionText:
    'Win Foundations is dedicated to creating lasting positive change through education, healthcare, and community development initiatives. We believe every person deserves access to quality education and healthcare regardless of their economic background.',
  visionHeading: 'Vision',
  visionText:
    'A world where every child has access to quality education, every family has access to healthcare, and communities are empowered to build a better future for themselves and their children.',
  storyEyebrow: 'Since Day One',
  storyHeading: 'Our Story',
  storyText1: 'Replace with actual founder message and NGO founding story.',
  storyText2:
    'Since our inception, Win Foundations has grown from a small initiative to a recognized organization working across multiple districts, touching the lives of thousands.',
  ctaHeading: 'Join Our Mission',
  ctaText: 'Be part of the change. Support our initiatives through donations, volunteering, or partnerships.',
  ctaPrimaryText: 'Donate Now',
  ctaPrimaryLink: '/donate',
  ctaSecondaryText: 'Volunteer With Us',
  ctaSecondaryLink: '/volunteer',
};

const FALLBACK_VALUES = [
  { id: 1, title: 'Integrity', description: 'Transparent and ethical in all our actions' },
  { id: 2, title: 'Compassion', description: 'Deep empathy for those we serve' },
  { id: 3, title: 'Excellence', description: 'Striving for highest quality in our work' },
  { id: 4, title: 'Accountability', description: 'Responsible use of resources' },
  { id: 5, title: 'Empowerment', description: 'Building capacity and independence' },
  { id: 6, title: 'Collaboration', description: 'Working together with communities' },
];

async function AboutContent() {
  const [settings, config, coreValues] = await Promise.all([
    getSettings(),
    getSiteConfig().catch(() => ({})),
    getCoreValues().catch(() => []),
  ]);

  const c: Record<string, string> = { ...FALLBACK_CONTENT, ...config };
  const values = coreValues.length > 0 ? coreValues : FALLBACK_VALUES;

  return (
    <div className="space-y-20">
      {/* Mission & Vision */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Mission & Vision</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
              M
            </div>
            <h3 className="text-2xl font-bold mb-4 text-blue-900">{c.missionHeading}</h3>
            <p className="text-gray-700 leading-relaxed">
              {c.missionText}
            </p>
          </div>
          <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl border border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
              V
            </div>
            <h3 className="text-2xl font-bold mb-4 text-emerald-900">{c.visionHeading}</h3>
            <p className="text-gray-700 leading-relaxed">
              {c.visionText}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="max-w-4xl mx-auto bg-gray-50 p-8 sm:p-10 rounded-xl border-l-4 border-blue-600">
        <p className="uppercase tracking-widest text-blue-700 text-sm font-semibold mb-3">
          {c.storyEyebrow}
        </p>
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{c.storyHeading}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p className="whitespace-pre-line">
            {c.storyText1}
          </p>
          <p className="whitespace-pre-line">
            {c.storyText2}
          </p>
        </div>
      </section>

      {/* Registration Details */}
      {(settings.orgRegistrationNo || settings.trust12A || settings.trust80G) && (
        <section className="max-w-4xl mx-auto bg-blue-50 p-8 sm:p-10 rounded-xl border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold mb-6">Legal Registration</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {settings.orgRegistrationNo && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Registration Number</p>
                <p className="font-semibold text-lg">{settings.orgRegistrationNo}</p>
              </div>
            )}
            {settings.trust12A && (
              <div>
                <p className="text-sm text-gray-600 mb-1">12A Certificate</p>
                <p className="font-semibold text-lg">{settings.trust12A}</p>
              </div>
            )}
            {settings.trust80G && (
              <div>
                <p className="text-sm text-gray-600 mb-1">80G Certificate</p>
                <p className="font-semibold text-lg">{settings.trust80G}</p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            All donations are eligible for tax exemption under section 80G of the Indian Income Tax Act.
          </p>
        </section>
      )}

      {/* Core Values */}
      <section className="max-w-4xl mx-auto">
        <p className="uppercase tracking-widest text-blue-700 text-sm font-semibold mb-3 text-center">
          What Drives Us
        </p>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value) => (
            <div
              key={value.id}
              className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 sm:p-10 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4">{c.ctaHeading}</h2>
        <p className="mb-6 text-lg">
          {c.ctaText}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={c.ctaPrimaryLink} className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-amber-400 hover:text-slate-900 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-300">
            {c.ctaPrimaryText}
          </a>
          <a href={c.ctaSecondaryLink} className="px-6 py-3 bg-transparent text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 hover:-translate-y-0.5 transition-all duration-300 border-2 border-white">
            {c.ctaSecondaryText}
          </a>
        </div>
      </section>
    </div>
  );
}

export default async function AboutPage() {
  const config = await getSiteConfig().catch(() => ({} as Record<string, string>));
  const hero = {
    eyebrow: config.aboutHeroEyebrow || FALLBACK_CONTENT.aboutHeroEyebrow,
    heading: config.aboutHeroHeading || FALLBACK_CONTENT.aboutHeroHeading,
    subtext: config.aboutHeroSubtext || FALLBACK_CONTENT.aboutHeroSubtext,
  };

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
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-left">
            <BackButton light />
          </div>
          <p className="uppercase tracking-widest text-blue-200 text-sm font-semibold mb-4">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            {hero.heading}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {hero.subtext}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Suspense fallback={<LoadingCard />}>
          <AboutContent />
        </Suspense>
      </div>
    </div>
  );
}
