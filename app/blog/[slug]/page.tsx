import Image from 'next/image';
import Link from 'next/link';
import { getBlogs, getBlogBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import MediaStrip from '@/components/MediaStrip';

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug).catch(() => null);
  return {
    title: blog ? `${blog.title} - Win Foundations` : 'Blog',
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug).catch(() => null);

  if (!blog) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="relative w-full h-96 overflow-hidden">
        <Image src={blog.coverImage} alt={blog.title} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <Link
          href="/blog"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white text-sm font-medium bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-full transition"
        >
          ← Back to All Blog Posts
        </Link>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 w-full">
            <div className="text-sm text-blue-100 font-semibold mb-2">{blog.category.toUpperCase()}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{blog.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-gray-600 mb-8">
          {new Date(blog.publishedAt).toLocaleDateString('en-IN')}
        </div>

        <div className="prose prose-lg max-w-none mb-12 whitespace-pre-wrap break-words">
          {blog.content}
        </div>

        {blog.media && blog.media.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
            <MediaStrip media={blog.media} />
          </section>
        )}

        <div className="border-t pt-8">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to All Blog Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
