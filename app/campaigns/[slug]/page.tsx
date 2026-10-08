import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getCampaigns, getCampaignBySlug, getSettings } from '@/lib/api';
import { notFound } from 'next/navigation';
import { relativeTime } from '@/lib/relativeTime';
import CampaignDonatePanel from '@/components/campaigns/CampaignDonatePanel';
import CampaignGallery from '@/components/campaigns/CampaignGallery';
import CampaignProductsSection from '@/components/campaigns/CampaignProductsSection';

export async function generateStaticParams() {
  const campaigns = await getCampaigns();
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug).catch(() => null);
  return {
    title: campaign ? `${campaign.title} - Win Foundations` : 'Campaign',
    description: campaign?.summary || '',
  };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [campaign, settings] = await Promise.all([
    getCampaignBySlug(slug).catch(() => null),
    getSettings().catch(() => null),
  ]);

  if (!campaign) notFound();

  const taxBenefitEligible = !!settings?.trust80G;

  const grandTotal = (campaign.costBreakdown || []).reduce(
    (sum, item) => sum + item.qty * item.pricePerUnit,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/campaigns" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          ← Back to campaigns
        </Link>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
          {campaign.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          {taxBenefitEligible && (
            <span className="px-4 py-1.5 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-200">
              Tax Benefit
            </span>
          )}
          {campaign.category && (
            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
              {campaign.category.name}
            </span>
          )}
          <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
            Campaign
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden">
              <Image src={campaign.coverImage} alt={campaign.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" priority />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">About This Campaign</h2>
              <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:font-medium">
                <ReactMarkdown>{campaign.story}</ReactMarkdown>
              </div>
            </div>

            {campaign.costBreakdown && campaign.costBreakdown.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Where Your Money Goes</h2>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                      <tr>
                        <th className="text-left px-4 py-3">Item</th>
                        <th className="text-right px-4 py-3">Qty</th>
                        <th className="text-right px-4 py-3">Price/Unit</th>
                        <th className="text-right px-4 py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {campaign.costBreakdown.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-gray-800">{item.item}</td>
                          <td className="px-4 py-3 text-right text-gray-600">{item.qty}</td>
                          <td className="px-4 py-3 text-right text-gray-600">₹{item.pricePerUnit.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-right text-gray-800">₹{(item.qty * item.pricePerUnit).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-semibold">
                        <td className="px-4 py-3 text-gray-900" colSpan={3}>Grand Total</td>
                        <td className="px-4 py-3 text-right text-gray-900">₹{grandTotal.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {campaign.products && campaign.products.length > 0 && (
              <CampaignProductsSection products={campaign.products} />
            )}

            <CampaignGallery photos={campaign.photos || []} videos={campaign.videos || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CampaignDonatePanel campaign={campaign} />

            {/* Recent Donations */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Donations</h3>
              {campaign.recentDonations && campaign.recentDonations.length > 0 ? (
                <ul className="space-y-3">
                  {campaign.recentDonations.map((d, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-700">{d.donorName}</span>
                        <span className="block text-xs text-gray-400">{relativeTime(d.createdAt)}</span>
                      </div>
                      <span className="font-medium text-gray-900">₹{d.amount.toLocaleString('en-IN')}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No donations yet — be the first to support this campaign!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
