import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/api';
import type { Media } from '@/lib/api';

export default function MediaStrip({ media }: { media: Media[] }) {
  if (!media || media.length === 0) return null;

  const sorted = [...media].sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {sorted.map((item) => (
        <div
          key={item.id}
          className="relative h-32 sm:h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
        >
          {item.url && item.type === 'IMAGE' ? (
            <Image src={resolveMediaUrl(item.url)} alt={item.caption || ''} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
          ) : item.url && item.type === 'VIDEO' ? (
            <video src={resolveMediaUrl(item.url)} controls className="w-full h-full object-cover" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
