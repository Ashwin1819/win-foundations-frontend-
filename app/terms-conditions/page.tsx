import ReactMarkdown from 'react-markdown';
import { getPolicyPage } from '@/lib/api';
import { notFound } from 'next/navigation';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Terms & Conditions - Win Foundations',
};

export default async function TermsPage() {
  const policy = await getPolicyPage('TERMS').catch(() => null);

  if (!policy) notFound();

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton className="mb-4" />
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{policy.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
