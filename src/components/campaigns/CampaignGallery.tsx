'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CampaignPhoto, CampaignVideo } from '@/lib/api';

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

export default function CampaignGallery({
  photos,
  videos,
}: {
  photos: CampaignPhoto[];
  videos: CampaignVideo[];
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<{ image: string; caption?: string } | null>(null);

  if (photos.length === 0 && videos.length === 0) return null;

  return (
    <div className="space-y-8">
      {photos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Photos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative h-32 sm:h-40 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
                onClick={() => setSelectedPhoto({ image: photo.image, caption: photo.caption || undefined })}
              >
                <Image
                  src={photo.image}
                  alt={photo.caption || ''}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover group-hover:opacity-80 transition"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((video) => {
              const embedUrl = getYoutubeEmbedUrl(video.videoUrl);
              return (
                <div key={video.id} className="rounded-lg overflow-hidden border border-gray-200">
                  <div className="aspect-video bg-gray-100">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={video.title || 'Campaign video'}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Watch Video →
                      </a>
                    )}
                  </div>
                  {video.title && (
                    <p className="px-3 py-2 text-sm font-medium text-gray-700">{video.title}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-2xl w-full">
            <div className="relative h-96">
              <Image src={selectedPhoto.image} alt={selectedPhoto.caption || ''} fill sizes="100vw" className="object-contain" />
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
