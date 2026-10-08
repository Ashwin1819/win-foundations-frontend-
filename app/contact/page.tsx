'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getSettings, submitContact, getSiteConfig } from '@/lib/api';
import BackButton from '@/components/BackButton';
import type { SiteSettings } from '@/lib/api';

const FALLBACK_HEADER = {
  eyebrow: 'Get In Touch',
  heading: 'Contact Us',
  subtext: "Have questions? We'd love to hear from you. Get in touch with us today.",
};

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState(FALLBACK_HEADER);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    getSettings().then(setSettings);
    getSiteConfig()
      .then((config) => {
        setHeader({
          eyebrow: config.contactHeroEyebrow || FALLBACK_HEADER.eyebrow,
          heading: config.contactHeroHeading || FALLBACK_HEADER.heading,
          subtext: config.contactHeroSubtext || FALLBACK_HEADER.subtext,
        });
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitContact(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-left">
            <BackButton light />
          </div>
          <p className="uppercase tracking-widest text-blue-200 text-sm font-semibold mb-4">
            {header.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">{header.heading}</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {header.subtext}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Info */}
        {settings && (
          <div className="grid md:grid-cols-3 gap-6 mb-16 -mt-24 relative z-10">
            {settings.address && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <MapPin size={20} className="text-blue-700" />
                </div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">Address</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{settings.address}</p>
              </div>
            )}
            {settings.phone && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Phone size={20} className="text-blue-700" />
                </div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">Phone</h3>
                <a href={`tel:${settings.phone}`} className="text-blue-700 hover:text-blue-900 text-sm font-medium">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.email && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Mail size={20} className="text-blue-700" />
                </div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">Email</h3>
                <a href={`mailto:${settings.email}`} className="text-blue-700 hover:text-blue-900 text-sm font-medium">
                  {settings.email}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-gray-600">Fill out the form below and our team will get back to you shortly.</p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              ✓ Thank you for your message! We'll get back to you soon.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-xl shadow-sm space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Phone (Optional)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 hover:shadow transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Map */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Find Us Here</h2>
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <iframe
              title="Win Research Centre location on Google Maps"
              src="https://www.google.com/maps?q=Win+Research+Centre,+911,+28th+Main+Rd,+Putlanpalya,+Jayanagara+9th+Block,+Jayanagar,+Bengaluru,+Karnataka+560041&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
