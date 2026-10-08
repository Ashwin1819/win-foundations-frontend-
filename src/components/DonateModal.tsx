'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Smartphone, CreditCard } from 'lucide-react';
import { useDonateModal } from '@/contexts/DonateModalContext';
import { useDonationCheckout } from '@/hooks/useDonationCheckout';
import { getSettings } from '@/lib/api';

const FALLBACK_PRESET_AMOUNTS = [500, 1000, 5000, 10000];
const FALLBACK_TIP_PERCENT_OPTIONS = [10, 14, 16];
const DEFAULT_TIP_PERCENT = 14;
const MIN_DONATION_AMOUNT = 300;
const TRANSITION_MS = 200;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

type TipMode = 'none' | 'preset' | 'custom';
type PaymentMethod = 'upi' | 'card';

export default function DonateModal() {
  const { isOpen, close } = useDonateModal();
  const { loading, error, success, donate } = useDonationCheckout();

  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  const [presetAmounts, setPresetAmounts] = useState<number[]>(FALLBACK_PRESET_AMOUNTS);
  const [tipPercentOptions, setTipPercentOptions] = useState<number[]>(FALLBACK_TIP_PERCENT_OPTIONS);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(FALLBACK_PRESET_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState('');

  const [tipMode, setTipMode] = useState<TipMode>('preset');
  const [selectedTipPercent, setSelectedTipPercent] = useState<number | null>(DEFAULT_TIP_PERCENT);
  const [customTip, setCustomTip] = useState('');

  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pan, setPan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  const [validationError, setValidationError] = useState('');

  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = 'donate-modal-title';

  const baseAmount = selectedPreset ?? (parseFloat(customAmount) || 0);
  const tipAmount = tipMode === 'none'
    ? 0
    : tipMode === 'custom'
      ? Math.round(parseFloat(customTip) || 0)
      : Math.round((baseAmount * (selectedTipPercent || 0)) / 100);
  const total = baseAmount + tipAmount;

  // Mount/unmount with a short delay so the exit transition can actually play, instead
  // of the panel vanishing instantly when isOpen flips to false.
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(raf);
    } else if (mounted) {
      setShow(false);
      const timeout = setTimeout(() => setMounted(false), TRANSITION_MS);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Fetch site-wide preset amounts + tip options once, the first time the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    getSettings()
      .then((settings) => {
        if (settings.presetAmounts && settings.presetAmounts.length > 0) {
          setPresetAmounts(settings.presetAmounts);
          setSelectedPreset(settings.presetAmounts[0]);
        }
        if (settings.tipPercentOptions && settings.tipPercentOptions.length > 0) {
          setTipPercentOptions(settings.tipPercentOptions);
          setSelectedTipPercent(
            settings.tipPercentOptions.includes(DEFAULT_TIP_PERCENT)
              ? DEFAULT_TIP_PERCENT
              : settings.tipPercentOptions[0]
          );
        }
      })
      .catch(() => {
        // Keep the fallback values; not worth blocking the modal over this.
      });
  }, [isOpen]);

  // Lock background scroll while the modal is mounted.
  useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [mounted]);

  // Escape to close.
  useEffect(() => {
    if (!mounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted, close]);

  // Focus trap: keep Tab/Shift+Tab cycling within the panel, and focus it on open.
  useEffect(() => {
    if (!show || !panelRef.current) return;

    const panel = panelRef.current;
    const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const focusable = getFocusable();
    (focusable[0] || panel).focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [show]);

  if (!mounted) return null;

  const handleSubmit = () => {
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
        pan: pan || undefined,
        mode: 'CASH',
        amount: baseAmount,
        tipAmount,
        donationType: 'ONE_TIME',
        campaignId: undefined,
        paymentMethod,
      },
      {
        description: 'General Donation to Win Foundations',
        onSuccess: () => {
          setCustomAmount('');
          setDonorName('');
          setEmail('');
          setPhone('');
          setPan('');
          setTipMode('preset');
          setSelectedTipPercent(DEFAULT_TIP_PERCENT);
          setCustomTip('');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity ease-out ${show ? 'opacity-50' : 'opacity-0'}`}
        style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel — flex-col with a non-shrinking header/footer and a scrollable middle,
          so content taller than the viewport scrolls instead of clipping, and the
          Donate button always stays reachable without needing to scroll to it. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-all ease-out ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ transitionDuration: `${TRANSITION_MS}ms` }}
      >
        {/* Header — fixed in place, never scrolls */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 border-b border-gray-100">
          <h2 id={titleId} className="text-xl font-bold text-gray-900">
            Make a Donation
          </h2>
          <button
            onClick={close}
            aria-label="Close donation form"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable body — min-h-0 is required here: flex items default to
            min-height:auto, which would otherwise let this grow to fit its content
            instead of actually scrolling within the panel's max-height. */}
        <div className="px-6 py-6 overflow-y-auto flex-1 min-h-0">
          <p className="text-sm text-gray-600 mb-6">
            Your contribution supports all of Win Foundations&apos;s programs — education, healthcare, disaster relief, and more.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column — Donor Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Your Details</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="tel"
                placeholder="Phone (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                placeholder="PAN Card Number (Optional)"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              {/* Payment Method — real UPI app logos aren't available as project
                  assets, so these are shown as plain labeled icon chips rather than
                  invented/inaccurate brand marks. */}
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment Method</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition ${
                      paymentMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone size={16} />
                    UPI
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard size={16} />
                    Cards / Netbanking
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {paymentMethod === 'upi'
                    ? 'Pay via PhonePe, Google Pay, BHIM, or any UPI app.'
                    : 'Pay via any major debit/credit card or net banking.'}
                </p>
              </div>
            </div>

            {/* Right Column — Amount, Tip, Total */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Donation Amount</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
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
                  placeholder={`Enter a custom amount (min ₹${MIN_DONATION_AMOUNT})`}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Tip Selector */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Add a Tip</h3>
                <div className="flex flex-wrap gap-2">
                  {tipPercentOptions.map((p) => (
                    <button
                      key={p}
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
                    className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                )}
                <p className="text-xs text-gray-400 mt-2">
                  100% of your donation goes directly to the cause — a tip helps us cover payment processing and platform costs, entirely optional.
                </p>
              </div>

              {/* Total Breakdown */}
              <div className="border-t border-gray-100 pt-3 space-y-1">
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
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mt-6">
              Thank you! Your donation has been recorded.
            </div>
          )}
          {(validationError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-6">
              {validationError || error}
            </div>
          )}
        </div>

        {/* Footer — fixed in place, so the Donate button is always reachable without
            scrolling, even when the form content above is taller than the viewport. */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={loading || total <= 0}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-green-600 active:bg-green-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:active:bg-blue-600"
          >
            {loading ? 'Processing...' : `Donate ₹${total.toLocaleString('en-IN')} Now`}
          </button>
        </div>
      </div>
    </div>
  );
}
