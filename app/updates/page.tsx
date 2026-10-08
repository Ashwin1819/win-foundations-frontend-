'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUpdates, getSiteConfig } from '@/lib/api';
import type { Update } from '@/lib/api';
import LoadingCard from '@/components/LoadingCard';
import BackButton from '@/components/BackButton';

const FALLBACK_HEADER = {
  heading: 'Updates & News',
  subtext: 'Stay informed about our latest activities and achievements',
};

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [header, setHeader] = useState(FALLBACK_HEADER);

  useEffect(() => {
    getSiteConfig()
      .then((config) => {
        setHeader({
          heading: config.updatesHeroHeading || FALLBACK_HEADER.heading,
          subtext: config.updatesHeroSubtext || FALLBACK_HEADER.subtext,
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getUpdates(category || undefined, 12, page * 12)
      .then((res) => {
        if (page === 0) {
          setUpdates(res.data);
        } else {
          setUpdates((prev) => [...prev, ...res.data]);
        }
        setHasMore(res.pagination.hasMore);
      })
      .finally(() => setLoading(false));
  }, [category, page]);

  const categories = useMemo(() => {
    const cats = new Set(updates.map((u) => u.category));
    return Array.from(cats).sort();
  }, [updates]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton light className="mb-3" />
          <h1 className="text-4xl font-bold mb-2">{header.heading}</h1>
          <p className="text-lg text-blue-100">{header.subtext}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setCategory(''); setPage(0); }}
              className={`px-4 py-2 rounded-full font-medium transition ${
                category === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(0); }}
                className={`px-4 py-2 rounded-full font-medium transition capitalize ${
                  category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Updates Grid */}
        {loading && page === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {updates.map((update) => (
                <Link key={update.id} href={`/updates/${update.slug}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer h-full">
                    <div className="relative w-full h-48">
                      <Image src={update.coverImage} alt={update.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-semibold text-blue-600 uppercase mb-2">{update.category}</div>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{update.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{update.content}</p>
                      <div className="text-sm text-gray-500">
                        {new Date(update.publishedAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}

            {!hasMore && updates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No updates found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
