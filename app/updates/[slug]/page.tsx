import Image from 'next/image';
import Link from 'next/link';
import { getUpdates, getUpdateBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const res = await getUpdates();
  return res.data.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const update = await getUpdateBySlug(slug).catch(() => null);
  return {
    title: update ? `${update.title} - Win Foundations` : 'Update',
  };
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const update = await getUpdateBySlug(slug).catch(() => null);

  if (!update) notFound();

  const shareUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${slug}`;
  const shareText = `Check out: ${update.title}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="relative w-full h-96 overflow-hidden">
        <Image src={update.coverImage} alt={update.title} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <Link
          href="/updates"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white text-sm font-medium bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-full transition"
        >
          ← Back to All Updates
        </Link>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 w-full">
            <div className="text-sm text-blue-100 font-semibold mb-2">{update.category.toUpperCase()}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{update.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <span className="text-gray-600">{new Date(update.publishedAt).toLocaleDateString('en-IN')}</span>
          <div className="flex space-x-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12 whitespace-pre-wrap">
          {update.content}
        </div>

        <div className="border-t pt-8">
          <Link href="/updates" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to All Updates
          </Link>
        </div>
      </div>
    </div>
  );
}
