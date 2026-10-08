import Image from 'next/image';
import Link from 'next/link';
import { getInitiatives, getInitiativeBySlug, getCampLocations } from '@/lib/api';
import { notFound } from 'next/navigation';
import MediaStrip from '@/components/MediaStrip';

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let id = '';
    if (parsed.hostname.includes('youtu.be')) {
      id = parsed.pathname.slice(1);
    } else if (parsed.searchParams.get('v')) {
      id = parsed.searchParams.get('v') as string;
    } else if (parsed.pathname.includes('/embed/')) {
      id = parsed.pathname.split('/embed/')[1];
    }
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const initiatives = await getInitiatives();
  return initiatives.map((init) => ({ slug: init.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initiative = await getInitiativeBySlug(slug).catch(() => null);
  return {
    title: initiative ? `${initiative.title} - Win Foundations` : 'Initiative',
    description: initiative?.shortDesc || '',
  };
}

export default async function InitiativeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initiative = await getInitiativeBySlug(slug).catch(() => null);

  if (!initiative) notFound();

  const campLocations = await getCampLocations({ initiativeId: initiative.id }).catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative w-full h-72 sm:h-96 overflow-hidden">
        <Image src={initiative.coverImage} alt={initiative.title} fill sizes="100vw" className="object-cover" priority />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/initiatives" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          ← Back to All Initiatives
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-8">
          {initiative.title}
        </h1>

        {/* Intro */}
        {initiative.fullDesc && (
          <p className="text-lg text-gray-700 leading-relaxed mb-12">{initiative.fullDesc}</p>
        )}

        {/* Feature Photo */}
        {initiative.featureImage && (
          <div className="relative w-full h-64 sm:h-[420px] rounded-xl overflow-hidden mb-16">
            <Image src={initiative.featureImage} alt={`${initiative.title} feature`} fill sizes="(max-width: 768px) 100vw, 896px" className="object-cover" />
          </div>
        )}

        {/* Key Features */}
        {initiative.keyFeatures && initiative.keyFeatures.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
            <div className="space-y-6">
              {initiative.keyFeatures.map((feature, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{feature.label}: </span>
                  {feature.description}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Objectives */}
        {initiative.keyActivities && initiative.keyActivities.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Objectives</h2>
            <ol className="space-y-4">
              {initiative.keyActivities.map((activity, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed pt-1">{activity}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* How It Works */}
        {initiative.howItWorks && initiative.howItWorks.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
            <ol className="space-y-6">
              {initiative.howItWorks.map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed pt-1">
                    <span className="font-bold text-gray-900">{step.label}: </span>
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Impact */}
        {((initiative.impactPoints && initiative.impactPoints.length > 0) ||
          (initiative.impactNumbers && initiative.impactNumbers.length > 0)) && (
          <section className="mb-16 bg-blue-50 p-8 rounded-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Impact</h2>

            {initiative.impactNumbers && initiative.impactNumbers.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {initiative.impactNumbers.map((impact, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{impact.value}+</p>
                    <p className="text-gray-600">{impact.label}</p>
                  </div>
                ))}
              </div>
            )}

            {initiative.impactPoints && initiative.impactPoints.length > 0 && (
              <ul className="space-y-3">
                {initiative.impactPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="text-blue-600 font-bold text-lg mt-1">•</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Gallery */}
        {initiative.photos && initiative.photos.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {initiative.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative h-32 sm:h-40 rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image src={photo.image} alt={photo.caption || ''} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {initiative.videos && initiative.videos.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Videos</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {initiative.videos.map((video) => {
                const embedUrl = getYoutubeEmbedUrl(video.youtubeUrl);
                return (
                  <div key={video.id}>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <a
                          href={video.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Watch Video →
                        </a>
                      )}
                    </div>
                    <p className="mt-2 text-gray-700 font-medium">{video.title}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Camp Locations */}
        {campLocations.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Camp Locations</h2>
            <div className="space-y-10">
              {campLocations.map((camp) => (
                <div key={camp.id} className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{camp.name}</h3>
                  <p className="text-gray-700 mt-1">
                    {camp.address}
                    {camp.city && `, ${camp.city}`}
                    {camp.state && `, ${camp.state}`}
                  </p>
                  {camp.campDate && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(camp.campDate).toLocaleDateString('en-IN')}
                    </p>
                  )}
                  {camp.description && (
                    <p className="text-gray-700 leading-relaxed mt-4">{camp.description}</p>
                  )}
                  {camp.media && camp.media.length > 0 && (
                    <div className="mt-6">
                      <MediaStrip media={camp.media} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Support This Initiative</h2>
          <p className="mb-6">Help us expand our impact and reach more people in need.</p>
          <Link
            href="/donate"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-amber-400 hover:text-slate-900 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-300"
          >
            Donate Now
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link href="/initiatives" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to All Initiatives
          </Link>
        </div>
      </div>
    </div>
  );
}
