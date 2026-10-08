'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getInitiatives } from '@/lib/api';
import type { Initiative } from '@/lib/api';

export default function InitiativesPreview() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);

  useEffect(() => {
    getInitiatives().then((data) => setInitiatives(data.slice(0, 6))).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {initiatives.map((init) => (
        <Link key={init.id} href={`/initiatives/${init.slug}`}>
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full border border-transparent hover:border-blue-100">
            <div className="relative w-full h-48 overflow-hidden">
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
              <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-700 transition">{init.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{init.shortDesc}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
