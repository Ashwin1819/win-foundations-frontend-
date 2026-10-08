'use client';

import { useEffect, useState } from 'react';
import { getFormFields, type DynamicFormField } from '@/lib/api';

/**
 * Renders a form from admin-managed field definitions (Admin → Form Builder),
 * so Partner/Internship/CV Building forms can have fields added, edited,
 * reordered, or removed without a code change. Falls back to a fixed field
 * set if the backend has none yet (e.g. right after this feature ships,
 * before an admin has configured anything).
 */
export default function DynamicForm({
  formType,
  fallbackFields,
  onSubmit,
  submitLabel = 'Submit',
  loading,
}: {
  formType: 'PARTNER' | 'INTERNSHIP' | 'CV_BUILDING';
  fallbackFields: DynamicFormField[];
  onSubmit: (values: Record<string, string>) => void;
  submitLabel?: string;
  loading: boolean;
}) {
  const [fields, setFields] = useState<DynamicFormField[]>(fallbackFields);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    getFormFields(formType)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFields([...data].sort((a, b) => a.order - b.order));
        }
      })
      .catch(console.error);
  }, [formType]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-5 sm:p-8 rounded-lg space-y-4">
      {fields.map((field) => {
        const value = values[field.fieldKey] || '';

        if (field.fieldType === 'TEXTAREA') {
          return (
            <textarea
              key={field.id}
              name={field.fieldKey}
              value={value}
              onChange={(e) => handleChange(field.fieldKey, e.target.value)}
              placeholder={field.placeholder || field.label}
              required={field.required}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg h-28 text-sm"
            />
          );
        }

        if (field.fieldType === 'SELECT') {
          return (
            <select
              key={field.id}
              name={field.fieldKey}
              value={value}
              onChange={(e) => handleChange(field.fieldKey, e.target.value)}
              required={field.required}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {(field.options || []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        }

        const inputType =
          field.fieldType === 'EMAIL' ? 'email' : field.fieldType === 'PHONE' ? 'tel' : field.fieldType === 'NUMBER' ? 'number' : 'text';

        return (
          <input
            key={field.id}
            type={inputType}
            name={field.fieldKey}
            value={value}
            onChange={(e) => handleChange(field.fieldKey, e.target.value)}
            placeholder={(field.placeholder || field.label) + (field.required ? '' : ' (Optional)')}
            required={field.required}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
          />
        );
      })}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-green-600 active:bg-green-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
}
