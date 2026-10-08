'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Share2, Link2, MessageCircle } from 'lucide-react';
import type { Campaign } from '@/lib/api';

interface CampaignCardProps {
  campaign: Campaign;
  logo: string | null;
  taxBenefitEligible: boolean;
}

export default function CampaignCard({ campaign, logo, taxBenefitEligible }: CampaignCardProps) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const percent = campaign.goalAmount > 0
    ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100))
    : 0;

  const campaignUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/campaigns/${campaign.slug}`
    : `/campaigns/${campaign.slug}`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied; silently ignore
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Support this campaign: ${campaign.title} — ${campaignUrl}`)}`;

  return (
    <div
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full border border-gray-100 hover:border-blue-100"
      onClick={() => router.push(`/campaigns/${campaign.slug}`)}
    >
      {/* Cover Image */}
      <div className="relative w-full h-52 rounded-t-xl overflow-hidden">
        <Image
          src={campaign.coverImage}
          alt={campaign.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />
        {taxBenefitEligible && (
          <span className="absolute top-3 left-3 bg-white text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
            Tax Benefit
          </span>
        )}
      </div>

      <div className="p-5 rounded-b-xl flex flex-col flex-1">
        {/* Org byline */}
        <div className="flex items-center gap-2 mb-3">
          {logo ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
              <Image src={logo} alt="Win Foundations" fill sizes="24px" className="object-cover" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0" />
          )}
          <span className="text-xs text-gray-500">By Win Foundations</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition mb-4 truncate">{campaign.title}</h3>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500 uppercase text-xs font-medium tracking-wide">
            {campaign.backersCount} Backers
          </span>
          <span className="text-blue-600 font-semibold">{percent}% Complete</span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 rounded-full h-6 mb-5 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-green-600 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
          <span className="relative z-10 flex items-center justify-center h-full text-xs font-semibold text-gray-700">
            {percent}% Complete
          </span>
        </div>

        {/* Footer Buttons */}
        <div className="mt-auto flex items-center gap-3">
          <div className="relative" ref={popoverRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareOpen((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 border text-sm font-medium rounded-lg transition-all duration-300 ${
                shareOpen
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Share2 size={16} />
              Share
            </button>

            {shareOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-20 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors text-left"
                >
                  <Link2 size={15} />
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
                <div className="h-px bg-gray-100 mx-2" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-blue-700 transition-colors"
                >
                  <MessageCircle size={15} />
                  Share on WhatsApp
                </a>
              </div>
            )}
          </div>

          <Link
            href={`/donate?campaign=${campaign.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-green-600 active:bg-green-600 transition-all duration-150"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
}
