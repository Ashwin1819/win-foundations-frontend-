'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitCvRequest, type DynamicFormField } from '@/lib/api';
import BackButton from '@/components/BackButton';
import DynamicForm from '@/components/DynamicForm';

const FALLBACK_FIELDS: DynamicFormField[] = [
  { id: -1, formType: 'CV_BUILDING', label: 'Full Name', fieldKey: 'name', fieldType: 'TEXT', placeholder: null, required: true, options: null, order: 1 },
  { id: -2, formType: 'CV_BUILDING', label: 'Email', fieldKey: 'email', fieldType: 'EMAIL', placeholder: null, required: true, options: null, order: 2 },
  { id: -3, formType: 'CV_BUILDING', label: 'Phone Number', fieldKey: 'phone', fieldType: 'PHONE', placeholder: null, required: false, options: null, order: 3 },
  { id: -4, formType: 'CV_BUILDING', label: 'Education', fieldKey: 'education', fieldType: 'TEXT', placeholder: null, required: false, options: null, order: 4 },
  { id: -5, formType: 'CV_BUILDING', label: 'Current Role', fieldKey: 'currentRole', fieldType: 'TEXT', placeholder: null, required: false, options: null, order: 5 },
  { id: -6, formType: 'CV_BUILDING', label: 'Experience', fieldKey: 'experience', fieldType: 'TEXTAREA', placeholder: null, required: false, options: null, order: 6 },
  { id: -7, formType: 'CV_BUILDING', label: 'Skills', fieldKey: 'skills', fieldType: 'TEXTAREA', placeholder: null, required: false, options: null, order: 7 },
  { id: -8, formType: 'CV_BUILDING', label: 'Career Objective', fieldKey: 'careerObjective', fieldType: 'TEXTAREA', placeholder: null, required: false, options: null, order: 8 },
  { id: -9, formType: 'CV_BUILDING', label: 'CV Type Needed', fieldKey: 'cvType', fieldType: 'SELECT', placeholder: 'Select CV Type', required: false, options: ['Fresher Resume', 'Experienced Resume', 'Cover Letter', 'LinkedIn Profile'], order: 9 },
  { id: -10, formType: 'CV_BUILDING', label: 'Additional Requirements', fieldKey: 'additionalRequirements', fieldType: 'TEXTAREA', placeholder: null, required: false, options: null, order: 10 },
];

export default function CvBuildingPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    setError('');

    try {
      await submitCvRequest(values);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton className="mb-4" />
        <h1 className="text-4xl font-bold mb-4">CV Building Support</h1>
        <p className="text-xl text-gray-600 mb-8">
          As part of our Livelihood Initiatives, we help youth and job-seekers from underserved
          communities build strong resumes and prepare for job interviews.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg space-y-3 text-gray-700 mb-10">
          <p>
            Our CV Building sessions cover resume writing, formatting, highlighting relevant
            skills, and interview preparation — guided by volunteers and mentors from various
            professional backgrounds.
          </p>
          <p>
            Fill out the form below to request support, or{' '}
            <Link href="/volunteer" className="text-blue-600 hover:text-blue-800 font-medium">
              volunteer as a mentor
            </Link>{' '}
            for these sessions.
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✓ Thank you! Our team will review your request and get in touch soon.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ✗ {error}
          </div>
        )}

        <DynamicForm
          formType="CV_BUILDING"
          fallbackFields={FALLBACK_FIELDS}
          onSubmit={handleSubmit}
          submitLabel="Request CV Support"
          loading={loading}
        />
      </div>
    </div>
  );
}
