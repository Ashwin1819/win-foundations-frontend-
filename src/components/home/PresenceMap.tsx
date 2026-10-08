'use client';

import { useEffect, useState } from 'react';
import { getSiteConfig, getPresenceLocations, type PresenceLocation } from '@/lib/api';

type Location = Pick<PresenceLocation, 'id' | 'name' | 'left' | 'top'>;

const FALLBACK_LOCATIONS: Location[] = [
  { id: 1, name: 'Bengaluru', left: '78%', top: '80.2%' },
];

const FALLBACK_CONTENT = {
  mapImage: '/assets/karnataka-map.svg',
  eyebrow: 'Working Locations',
  heading: 'Where We Make An Impact',
  text1: 'Win Foundations is headquartered at Win Research Center (WRC) in Bengaluru, Karnataka, where our team drives programs across education, healthcare, disaster relief, and community development.',
  text2: 'As our initiatives grow, this map will expand to reflect every community we reach across Karnataka.',
};

export default function PresenceMap() {
  const [locations, setLocations] = useState<Location[]>(FALLBACK_LOCATIONS);
  const [content, setContent] = useState(FALLBACK_CONTENT);

  useEffect(() => {
    getPresenceLocations()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLocations(data);
      })
      .catch(console.error);

    getSiteConfig()
      .then((config) => {
        setContent({
          mapImage: config.presenceMapImage || FALLBACK_CONTENT.mapImage,
          eyebrow: config.presenceEyebrow || FALLBACK_CONTENT.eyebrow,
          heading: config.presenceHeading || FALLBACK_CONTENT.heading,
          text1: config.presenceText1 || FALLBACK_CONTENT.text1,
          text2: config.presenceText2 || FALLBACK_CONTENT.text2,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[1fr_1.1fr] gap-12 items-center">
        <div>
          <p className="uppercase tracking-widest text-blue-700 text-sm font-semibold mb-3">
            {content.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {content.heading}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {content.text1}
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            {content.text2}
          </p>

          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Our Presence</h3>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <span
                  key={loc.id}
                  className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                >
                  {loc.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <img
            src={content.mapImage}
            alt="Map of Karnataka with all districts labeled, highlighting Win Foundations' presence"
            className="w-full h-auto"
          />
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: loc.left, top: loc.top }}
            >
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white shadow" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
