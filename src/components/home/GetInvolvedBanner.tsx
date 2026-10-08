'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSiteConfig } from '@/lib/api';

const FALLBACK = {
  image: '/assets/disaster-relief-banner.jpg',
  pillText: 'GET INVOLVED NOW',
  pillLink: '/volunteer',
  heading: 'Standing By Communities When It Matters Most',
  text: 'From disaster relief to education, healthcare, and livelihood support — Win Foundations shows up for communities across Karnataka, one initiative at a time.',
  primaryText: 'Join Our Team',
  primaryLink: '/volunteer',
  secondaryText: 'Partner With Us',
  secondaryLink: '/partner',
};

export default function GetInvolvedBanner() {
  const [content, setContent] = useState(FALLBACK);

  useEffect(() => {
    getSiteConfig()
      .then((config) => {
        setContent({
          image: config.giImage || FALLBACK.image,
          pillText: config.giPillText || FALLBACK.pillText,
          pillLink: config.giPillLink || FALLBACK.pillLink,
          heading: config.giHeading || FALLBACK.heading,
          text: config.giText || FALLBACK.text,
          primaryText: config.giPrimaryText || FALLBACK.primaryText,
          primaryLink: config.giPrimaryLink || FALLBACK.primaryLink,
          secondaryText: config.giSecondaryText || FALLBACK.secondaryText,
          secondaryLink: config.giSecondaryLink || FALLBACK.secondaryLink,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={content.image}
            alt="Win Foundations disaster relief response"
            className="w-full h-[500px] sm:h-[560px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <Link
              href={content.pillLink}
              className="inline-block px-6 py-2.5 bg-white hover:bg-green-600 hover:text-white active:bg-green-600 active:text-white hover:-translate-y-0.5 transition-all duration-150 text-blue-700 text-xs sm:text-sm font-bold tracking-wide rounded-full mb-6 shadow-md hover:shadow-lg"
            >
              {content.pillText}
            </Link>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight">
              {content.heading}
            </h2>

            <p className="mt-5 text-gray-200 text-base sm:text-lg max-w-2xl">
              {content.text}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={content.primaryLink}
                className="px-8 py-3 bg-blue-600 hover:bg-green-600 active:bg-green-600 hover:-translate-y-0.5 transition-all duration-150 text-white font-semibold rounded-full shadow-md hover:shadow-lg"
              >
                {content.primaryText}
              </Link>
              <Link
                href={content.secondaryLink}
                className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 hover:-translate-y-0.5 transition-all duration-300 font-semibold rounded-full"
              >
                {content.secondaryText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
