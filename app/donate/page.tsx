'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCampaigns, getSettings } from '@/lib/api';
import { useDonationCheckout } from '@/hooks/useDonationCheckout';
import BackButton from '@/components/BackButton';
import type { Campaign, SiteSettings } from '@/lib/api';

const FALLBACK_PRESET_AMOUNTS = [500, 1000, 5000, 10000];
const FALLBACK_TIP_PERCENT_OPTIONS = [10, 14, 16];
const DEFAULT_TIP_PERCENT = 14;
const MIN_DONATION_AMOUNT = 300;

type TipMode = 'preset' | 'custom';
type PaymentMethod = 'upi' | 'card';

function DonateForm() {
  const searchParams = useSearchParams();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getCampaigns().then(setCampaigns).catch(console.error);
    getSettings().then(setSettings).catch(console.error);
  }, []);

  const campaignIdFromUrl = searchParams?.get('campaign') || '';
  const [campaignId, setCampaignId] = useState(campaignIdFromUrl);

  useEffect(() => {
    if (campaignIdFromUrl) setCampaignId(campaignIdFromUrl);
  }, [campaignIdFromUrl]);

  const selectedCampaign = campaigns.find((c) => String(c.id) === campaignId) || null;

  const presetAmounts = selectedCampaign?.presetAmounts && selectedCampaign.presetAmounts.length > 0
    ? selectedCampaign.presetAmounts
    : settings?.presetAmounts && settings.presetAmounts.length > 0
      ? settings.presetAmounts
      : FALLBACK_PRESET_AMOUNTS;

  const tipPercentOptions = selectedCampaign?.tipPercentOptions && selectedCampaign.tipPercentOptions.length > 0
    ? selectedCampaign.tipPercentOptions
    : FALLBACK_TIP_PERCENT_OPTIONS;

  const defaultTipPercent = tipPercentOptions.includes(DEFAULT_TIP_PERCENT) ? DEFAULT_TIP_PERCENT : tipPercentOptions[0];

  const [donationType, setDonationType] = useState<'ONE_TIME' | 'MONTHLY'>('ONE_TIME');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(presetAmounts[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [tipMode, setTipMode] = useState<TipMode>('preset');
  const [selectedTipPercent, setSelectedTipPercent] = useState<number | null>(defaultTipPercent);
  const [customTip, setCustomTip] = useState('');

  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pan, setPan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  const [validationError, setValidationError] = useState('');
  const { loading, error, success, donate } = useDonationCheckout();

  const baseAmount = selectedPreset ?? (parseFloat(customAmount) || 0);
  const tipAmount = tipMode === 'custom'
    ? Math.round(parseFloat(customTip) || 0)
    : Math.round((baseAmount * (selectedTipPercent || 0)) / 100);
  const total = baseAmount + tipAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (donorName.trim().length < 2) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!email.includes('@')) {
      setValidationError('Please enter a valid email.');
      return;
    }
    if (baseAmount < MIN_DONATION_AMOUNT) {
      setValidationError(`Minimum donation amount is ₹${MIN_DONATION_AMOUNT}.`);
      return;
    }

    donate(
      {
        donorName,
        email,
        phone: phone || undefined,
        address: address || undefined,
        pan: pan || undefined,
        mode: 'CASH',
        amount: baseAmount,
        tipAmount,
        donationType,
        campaignId: campaignId ? parseInt(campaignId) : undefined,
        paymentMethod,
      },
      {
        description: selectedCampaign ? selectedCampaign.title : 'Donation to Win Foundations',
        onSuccess: () => {
          setCustomAmount('');
          setCustomTip('');
          setTipMode('preset');
          setSelectedTipPercent(defaultTipPercent);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton className="mb-4" />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Make a Donation</h1>
        <p className="text-base sm:text-xl text-gray-600 mb-8">
          Your contribution creates lasting impact. Every donation helps us reach more people.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
            Thank you! Your donation has been recorded — you&apos;ll receive a receipt via email soon.
          </div>
        )}

        {(validationError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-50 p-5 sm:p-8 rounded-lg space-y-6">
          {/* Campaign Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Donate to Campaign (Optional)</label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">General Donation</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Donation Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Donation Type</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input type="radio" name="donationType" checked={donationType === 'ONE_TIME'} onChange={() => setDonationType('ONE_TIME')} />
                <span className="ml-2 text-sm">One-time</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="donationType" checked={donationType === 'MONTHLY'} onChange={() => setDonationType('MONTHLY')} />
                <span className="ml-2 text-sm">Monthly</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">Donation Amount</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => { setSelectedPreset(amt); setCustomAmount(''); }}
                  className={`py-2.5 rounded-lg border text-sm font-semibold transition ${
                    selectedPreset === amt
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={MIN_DONATION_AMOUNT}
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setSelectedPreset(null); }}
              placeholder={`Custom amount (min ₹${MIN_DONATION_AMOUNT})`}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* Tip Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Add a Tip</label>
            <div className="flex flex-wrap gap-2">
              {tipPercentOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setTipMode('preset'); setSelectedTipPercent(p); }}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                    tipMode === 'preset' && selectedTipPercent === p
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {p}%
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTipMode('custom')}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                  tipMode === 'custom' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
                }`}
              >
                Custom
              </button>
            </div>
            {tipMode === 'custom' && (
              <input
                type="number"
                min="0"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                placeholder="Tip amount"
                className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            )}
            <p className="text-xs text-gray-400 mt-2">
              100% of your donation goes directly to the cause — a tip helps us cover payment processing and platform costs, entirely optional.
            </p>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-3 space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Donation</span>
              <span>₹{baseAmount.toLocaleString('en-IN')}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tip</span>
                <span>₹{tipAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-gray-900 pt-1">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="tel"
              placeholder="Phone (Optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
            <textarea
              placeholder="Address (Optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg h-24 text-sm"
            />
            <input
              type="text"
              placeholder="PAN (For 80G exemption - Optional)"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2.5 rounded-lg border text-sm font-medium transition ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 rounded-lg border text-sm font-medium transition ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Cards / Netbanking
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || total <= 0}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Donate ₹${total.toLocaleString('en-IN')} Now`}
          </button>

          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Your donation is secure and will be processed securely.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DonateForm />
    </Suspense>
  );
}
