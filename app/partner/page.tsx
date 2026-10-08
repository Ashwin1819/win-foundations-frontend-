'use client';

import { useState } from 'react';
import { submitPartnerApplicationDynamic, type DynamicFormField } from '@/lib/api';
import BackButton from '@/components/BackButton';
import DynamicForm from '@/components/DynamicForm';

const FALLBACK_FIELDS: DynamicFormField[] = [
  { id: -1, formType: 'PARTNER', label: 'Organization Name', fieldKey: 'organization', fieldType: 'TEXT', placeholder: null, required: true, options: null, order: 1 },
  { id: -2, formType: 'PARTNER', label: 'Contact Person Name', fieldKey: 'contactName', fieldType: 'TEXT', placeholder: null, required: true, options: null, order: 2 },
  { id: -3, formType: 'PARTNER', label: 'Email', fieldKey: 'email', fieldType: 'EMAIL', placeholder: null, required: true, options: null, order: 3 },
  { id: -4, formType: 'PARTNER', label: 'Phone Number', fieldKey: 'phone', fieldType: 'PHONE', placeholder: null, required: true, options: null, order: 4 },
  { id: -5, formType: 'PARTNER', label: 'Website', fieldKey: 'website', fieldType: 'TEXT', placeholder: null, required: false, options: null, order: 5 },
  { id: -6, formType: 'PARTNER', label: 'Partnership Type', fieldKey: 'partnershipType', fieldType: 'SELECT', placeholder: 'Select Partnership Type', required: false, options: ['Corporate (CSR)', 'NGO Collaboration', 'Educational Institution', 'Other'], order: 6 },
  { id: -7, formType: 'PARTNER', label: 'Tell us about the partnership you have in mind', fieldKey: 'message', fieldType: 'TEXTAREA', placeholder: null, required: false, options: null, order: 7 },
];

export default function PartnerPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    setError('');

    try {
      await submitPartnerApplicationDynamic(values);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton className="mb-4" />
        <h1 className="text-4xl font-bold mb-4">Become a Partner</h1>
        <p className="text-xl text-gray-600 mb-8">
          Partner with Win Foundations to create lasting impact together — as a corporate, institutional, or community partner.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✓ Thank you for your interest! Our team will reach out to you soon.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ✗ {error}
          </div>
        )}

        <DynamicForm
          formType="PARTNER"
          fallbackFields={FALLBACK_FIELDS}
          onSubmit={handleSubmit}
          submitLabel="Submit Application"
          loading={loading}
        />
      </div>
    </div>
  );
}
