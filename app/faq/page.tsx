'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getFaqs } from '@/lib/api';
import BackButton from '@/components/BackButton';
import type { FAQ } from '@/lib/api';

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    getFaqs()
      .then(setFaqs)
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton className="mb-4" />
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 mb-8">
          Answers to common questions about Win Foundations, our programs, and how to get involved.
        </p>

        {loaded && faqs.length === 0 && (
          <p className="text-gray-500">FAQs will be published here soon.</p>
        )}

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50"
              >
                {faq.question}
                <ChevronDown
                  size={18}
                  className={`transition-transform shrink-0 ml-4 ${openId === faq.id ? 'rotate-180' : ''}`}
                />
              </button>
              {openId === faq.id && (
                <div className="px-5 pb-4 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
