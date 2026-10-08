'use client';

import { useState } from 'react';
import { submitVolunteer } from '@/lib/api';
import BackButton from '@/components/BackButton';

export default function VolunteerPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    age: '',
    occupation: '',
    skills: '',
    areaOfInterest: '',
    availability: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitVolunteer({
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        age: '',
        occupation: '',
        skills: '',
        areaOfInterest: '',
        availability: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton className="mb-4" />
        <h1 className="text-4xl font-bold mb-4">Become a Volunteer</h1>
        <p className="text-xl text-gray-600 mb-8">
          Join us in making a difference. We welcome volunteers from all backgrounds.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✓ Thank you for your interest! We'll contact you soon to discuss opportunities.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg space-y-6">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            name="skills"
            placeholder="Skills (e.g., Teaching, Healthcare, IT, etc.)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg h-20"
          />

          <select name="areaOfInterest" value={formData.areaOfInterest} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
            <option value="">Select Area of Interest</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Community">Community Development</option>
            <option value="Admin">Administration</option>
            <option value="Other">Other</option>
          </select>

          <select name="availability" value={formData.availability} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
            <option value="">Select Availability</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Weekends">Weekends Only</option>
            <option value="Flexible">Flexible</option>
          </select>

          <textarea
            name="message"
            placeholder="Tell us why you want to volunteer"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg h-24"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
