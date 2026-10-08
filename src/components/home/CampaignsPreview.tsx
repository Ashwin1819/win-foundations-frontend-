'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCampaigns } from '@/lib/api';
import type { Campaign } from '@/lib/api';

export default function CampaignsPreview() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getCampaigns()
      .then(setCampaigns)
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && campaigns.length === 0) return null;

  return (
    <section className="py-24 bg-[linear-gradient(to_bottom,#ffffff_0%,#1e3a8a_12%,#1e3a8a_88%,#ffffff_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="uppercase tracking-widest text-amber-400 text-sm font-semibold mb-3 text-center">
          Make An Impact
        </p>
        <h2 className="text-3xl font-bold mb-12 text-center text-white">Active Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {campaigns.slice(0, 4).map((camp) => {
        const progress = camp.goalAmount > 0 ? (camp.raisedAmount / camp.goalAmount) * 100 : 0;
        return (
          <div
            key={camp.id}
            className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full"
            onClick={() => router.push(`/campaigns/${camp.slug}`)}
          >
            <div className="relative w-full h-64">
              <Image src={camp.coverImage} alt={camp.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{camp.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{camp.summary}</p>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-amber-500 h-3 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="font-semibold text-emerald-700">₹{camp.raisedAmount.toLocaleString('en-IN')} raised</span>
                  <span className="text-gray-500">Goal: ₹{camp.goalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <Link
                href={`/donate?campaign=${camp.id}`}
                className="inline-block w-full text-center px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-green-600 active:bg-green-600 shadow-sm hover:shadow-md transition-all duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                Donate Now
              </Link>
            </div>
          </div>
        );
      })}
        </div>
      </div>
    </section>
  );
}
