'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Initiative } from '@/lib/api';

export default function InitiativesGrid({ initiatives }: { initiatives: Initiative[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {initiatives.map((init) => (
        <div
          key={init.id}
          className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full border border-transparent hover:border-blue-100"
          onClick={() => router.push(`/initiatives/${init.slug}`)}
        >
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={init.coverImage}
              alt={init.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-700 transition">{init.title}</h3>
            <p className="text-gray-600 mb-4">{init.shortDesc}</p>
            <span className="text-blue-600 font-medium">Learn More →</span>
          </div>
        </div>
      ))}
    </div>
  );
}
