'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getQuotes, getSiteConfig } from '@/lib/api';

const FALLBACK_QUOTES = [
  "Hope doesn't wait for the water to recede. It shows up in the hands that reach out, the volunteers who wade in, and the communities who rebuild together.",
  'Every family we reach is a reminder that compassion, when organized, becomes real relief — not just for a day, but for the road to recovery ahead.',
  "A crisis tests a community's strength, but it's the people who show up — again and again — who carry that community through.",
];

const FALLBACK_CONTENT = {
  image: '/assets/flood-rescue-backdrop.webp',
  eyebrow: 'Our Commitment',
  teamLabel: 'THE WIN FOUNDATIONS TEAM',
  heading: 'We Show Up When It Matters Most',
  text: "Disasters don't wait, and neither do we. Alongside our education, healthcare, and livelihood programs, Win Foundations is committed to rapid relief support for communities facing floods and other emergencies across Karnataka.",
  buttonText: 'Support Our Relief Efforts',
  buttonLink: '/donate',
};

export default function MissionQuoteSection() {
  const [quotes, setQuotes] = useState<string[]>(FALLBACK_QUOTES);
  const [current, setCurrent] = useState(0);
  const [content, setContent] = useState(FALLBACK_CONTENT);

  useEffect(() => {
    getQuotes()
      .then((data) => {
        if (data.length > 0) {
          setQuotes([...data].sort((a, b) => a.order - b.order).map((q) => q.text));
          setCurrent(0);
        }
      })
      .catch(console.error);

    getSiteConfig()
      .then((config) => {
        setContent({
          image: config.missionImage || FALLBACK_CONTENT.image,
          eyebrow: config.missionEyebrow || FALLBACK_CONTENT.eyebrow,
          teamLabel: config.missionTeamLabel || FALLBACK_CONTENT.teamLabel,
          heading: config.missionHeading || FALLBACK_CONTENT.heading,
          text: config.missionText || FALLBACK_CONTENT.text,
          buttonText: config.missionButtonText || FALLBACK_CONTENT.buttonText,
          buttonLink: config.missionButtonLink || FALLBACK_CONTENT.buttonLink,
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (quotes.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [quotes]);

  return (
    <section className="relative overflow-hidden">
      <img
        src={content.image}
        alt="Rescue volunteers helping flood-affected residents to safety"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Quote Card */}
          <div className="bg-blue-900/80 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-xl min-h-[280px] flex flex-col justify-between">
            <div>
              <span className="text-5xl text-blue-300 leading-none font-serif">&ldquo;</span>
              <p className="text-white text-lg sm:text-xl leading-relaxed mt-2 transition-opacity duration-500">
                {quotes[current]}
              </p>
            </div>

            <div>
              <div className="h-px bg-white/20 mb-6" />
              <div className="flex items-center justify-between">
                <p className="text-blue-200 text-sm font-semibold tracking-wide">
                  {content.teamLabel}
                </p>
                <div className="flex gap-2">
                  {quotes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === current ? 'w-6 bg-white' : 'w-2 bg-white/40'
                      }`}
                      aria-label={`Show quote ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="text-white">
            <p className="uppercase tracking-widest text-blue-300 text-sm font-semibold mb-3">
              {content.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {content.heading}
            </h2>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-8">
              {content.text}
            </p>
            <Link
              href={content.buttonLink}
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-green-600 active:bg-green-600 hover:-translate-y-0.5 transition-all duration-150 text-white font-semibold rounded-full shadow-md hover:shadow-lg"
            >
              {content.buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
