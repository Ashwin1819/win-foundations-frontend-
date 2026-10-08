'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getPartners } from '@/lib/api';
import type { Partner } from '@/lib/api';

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPartners()
      .then(setPartners)
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && partners.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="uppercase tracking-widest text-blue-700 text-sm font-semibold mb-3 text-center">
          Trusted By
        </p>
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner) => (
            <div key={partner.id} className="flex justify-center p-4 rounded-lg hover:bg-blue-50/60 transition">
              {partner.websiteUrl ? (
                <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition">
                  <Image src={partner.logo} alt={partner.name} width={120} height={60} />
                </a>
              ) : (
                <Image src={partner.logo} alt={partner.name} width={120} height={60} className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
