'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogs, getSiteConfig } from '@/lib/api';
import type { Blog } from '@/lib/api';
import LoadingCard from '@/components/LoadingCard';
import BackButton from '@/components/BackButton';

const FALLBACK_HEADER = {
  heading: 'Blog',
  subtext: 'Stories and insights from our work',
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(FALLBACK_HEADER);

  useEffect(() => {
    getSiteConfig()
      .then((config) => {
        setHeader({
          heading: config.blogHeroHeading || FALLBACK_HEADER.heading,
          subtext: config.blogHeroSubtext || FALLBACK_HEADER.subtext,
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getBlogs(category || undefined)
      .then(setBlogs)
      .finally(() => setLoading(false));
  }, [category]);

  const categories = useMemo(() => {
    const cats = new Set(blogs.map((b) => b.category));
    return Array.from(cats).sort();
  }, [blogs]);

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
              onClick={() => setCategory('')}
              className={`px-4 py-2 rounded-full font-medium transition ${
                category === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition capitalize ${
                  category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer h-full">
                  <div className="relative w-full h-48">
                    <Image src={blog.coverImage} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold text-blue-600 uppercase mb-2">{blog.category}</div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{blog.content}</p>
                    <div className="text-sm text-gray-500">
                      {new Date(blog.publishedAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
