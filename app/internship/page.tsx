'use client';

import { useState } from 'react';
import { submitInternshipDynamic, type DynamicFormField } from '@/lib/api';
import BackButton from '@/components/BackButton';
import DynamicForm from '@/components/DynamicForm';

const FALLBACK_FIELDS: DynamicFormField[] = [
  { id: -1, formType: 'INTERNSHIP', label: 'Full Name', fieldKey: 'fullName', fieldType: 'TEXT', placeholder: null, required: true, options: null, order: 1 },
  { id: -2, formType: 'INTERNSHIP', label: 'Email', fieldKey: 'email', fieldType: 'EMAIL', placeholder: null, required: true, options: null, order: 2 },
  { id: -3, formType: 'INTERNSHIP', label: 'Phone Number', fieldKey: 'phone', fieldType: 'PHONE', placeholder: null, required: true, options: null, order: 3 },
  { id: -4, formType: 'INTERNSHIP', label: 'City', fieldKey: 'city', fieldType: 'TEXT', placeholder: null, required: false, options: null, order: 4 },
  { id: -5, formType: 'INTERNSHIP', label: 'Current Education / Qualification', fieldKey: 'education', fieldType: 'TEXT', placeholder: null, required: false, options: null, order: 5 },
  { id: -6, formType: 'INTERNSHIP', label: 'Area of Interest', fieldKey: 'areaOfInterest', fieldType: 'SELECT', placeholder: 'Select Area of Interest', required: false, options: ['Education', 'Healthcare', 'Communications & Media', 'Operations', 'Other'], order: 6 },
  { id: -7, formType: 'INTERNSHIP', label: 'Availability', fieldKey: 'availability', fieldType: 'SELECT', placeholder: 'Select Availability', required: false, options: ['Full-time', 'Part-time', 'Remote'], order: 7 },
  { id: -8, formType: 'INTERNSHIP', label: "Tell us why you'd like to intern with us", fieldKey: 'message', fieldType: 'TEXTAREA', placeholder: null, required: false, options: null, order: 8 },
];

export default function InternshipPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    setError('');

    try {
      await submitInternshipDynamic(values);
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
        <h1 className="text-4xl font-bold mb-4">Internship Program</h1>
        <p className="text-xl text-gray-600 mb-8">
          Gain hands-on experience in the social impact sector while contributing to meaningful work.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✓ Thank you for applying! We&apos;ll review your application and get back to you soon.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ✗ {error}
          </div>
        )}

        <DynamicForm
          formType="INTERNSHIP"
          fallbackFields={FALLBACK_FIELDS}
          onSubmit={handleSubmit}
          submitLabel="Submit Application"
          loading={loading}
        />
      </div>
    </div>
  );
}
