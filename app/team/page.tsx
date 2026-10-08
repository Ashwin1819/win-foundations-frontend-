import Image from 'next/image';
import { Suspense } from 'react';
import { getTeam } from '@/lib/api';
import LoadingCard from '@/components/LoadingCard';
import BackButton from '@/components/BackButton';
import type { TeamMember } from '@/lib/api';

export const metadata = {
  title: 'Our Team - Win Foundations',
  description: 'Meet the dedicated team working towards our mission',
};

async function TeamContent() {
  const teamByCategory = await getTeam();

  const categoryOrder = ['TRUSTEE', 'CORE_TEAM', 'VOLUNTEER'];
  const categoryLabels: Record<string, string> = {
    TRUSTEE: 'Trustees',
    CORE_TEAM: 'Core Team',
    VOLUNTEER: 'Volunteers',
  };

  return (
    <div className="space-y-16">
      {categoryOrder.map((category) => {
        const members = teamByCategory[category] || [];
        if (members.length === 0) return null;

        return (
          <section key={category}>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 pb-3 border-b-2 border-blue-100">{categoryLabels[category]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member: TeamMember) => (
                <div
                  key={member.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-blue-100"
                >
                  <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1 text-gray-900 group-hover:text-blue-700 transition">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.designation}</p>
                    {member.education && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Education:</span> {member.education}
                      </p>
                    )}
                    {member.experience && (
                      <p className="text-sm text-gray-600 mb-3 whitespace-pre-line">
                        {member.experience}
                      </p>
                    )}
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        LinkedIn Profile →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-left">
            <BackButton light />
          </div>
          <p className="uppercase tracking-widest text-blue-200 text-sm font-semibold mb-4">
            Meet The People
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Our Team
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Meet the passionate people dedicated to creating positive change
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </div>
          }
        >
          <TeamContent />
        </Suspense>
      </div>
    </div>
  );
}
