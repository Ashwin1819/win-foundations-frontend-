'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getGalleryAlbums, getGalleryVideos, getSiteConfig } from '@/lib/api';
import type { GalleryAlbum, GalleryVideo } from '@/lib/api';
import LoadingCard from '@/components/LoadingCard';
import BackButton from '@/components/BackButton';

const FALLBACK_HEADER = {
  heading: 'Gallery',
  subtext: 'Moments from our journey',
};

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<{ image: string; caption?: string } | null>(null);
  const [header, setHeader] = useState(FALLBACK_HEADER);

  useEffect(() => {
    getSiteConfig()
      .then((config) => {
        setHeader({
          heading: config.galleryHeroHeading || FALLBACK_HEADER.heading,
          subtext: config.galleryHeroSubtext || FALLBACK_HEADER.subtext,
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    Promise.all([getGalleryAlbums(), getGalleryVideos()])
      .then(([albs, vids]) => {
        setAlbums(albs);
        setVideos(vids);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        </div>
      </div>
    );
  }

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
        {albums.length === 0 && videos.length === 0 && (
          <p className="text-gray-500 text-center py-12">Gallery content will be published here soon.</p>
        )}

        {/* Photo Albums */}
        {albums.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Photo Albums</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {albums.map((album) => (
                <div key={album.id}>
                  <div className="relative h-64 rounded-lg overflow-hidden mb-4 cursor-pointer group">
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition"
                      onClick={() => {}}
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{album.title}</h3>
                  {album.eventDate && (
                    <p className="text-gray-600 text-sm">
                      {new Date(album.eventDate).toLocaleDateString('en-IN')}
                    </p>
                  )}
                  {album.photos && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {album.photos.slice(0, 6).map((photo) => (
                        <div
                          key={photo.id}
                          className="relative h-24 rounded cursor-pointer group"
                          onClick={() => setSelectedPhoto({ image: photo.image, caption: photo.caption || undefined })}
                        >
                          <Image
                            src={photo.image}
                            alt={photo.caption || ''}
                            fill
                            sizes="(max-width: 768px) 33vw, 11vw"
                            className="object-cover rounded group-hover:opacity-75 transition"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video) => (
                <div key={video.id} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                  <div className="relative h-64">
                    {video.thumbnail && (
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition"
                      >
                        <span className="text-white text-2xl">▶</span>
                      </a>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="max-w-2xl w-full">
            <div className="relative h-96">
              <Image
                src={selectedPhoto.image}
                alt={selectedPhoto.caption || ''}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {selectedPhoto.caption && (
              <p className="text-white text-center mt-4">{selectedPhoto.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
