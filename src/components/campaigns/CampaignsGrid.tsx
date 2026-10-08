import CampaignCard from './CampaignCard';
import type { Campaign } from '@/lib/api';

interface CampaignsGridProps {
  campaigns: Campaign[];
  logo: string | null;
  taxBenefitEligible: boolean;
}

export default function CampaignsGrid({ campaigns, logo, taxBenefitEligible }: CampaignsGridProps) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">There are no active campaigns right now. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {campaigns.map((camp) => (
        <div key={camp.id} className="w-full sm:w-[340px] lg:w-[360px]">
          <CampaignCard
            campaign={camp}
            logo={logo}
            taxBenefitEligible={taxBenefitEligible}
          />
        </div>
      ))}
    </div>
  );
}
