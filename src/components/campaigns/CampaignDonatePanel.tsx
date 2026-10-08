'use client';

import { useEffect, useRef, useState } from 'react';
import { useDonationCheckout } from '@/hooks/useDonationCheckout';
import type { Campaign } from '@/lib/api';
import { SELECT_PRODUCT_EVENT } from './CampaignProductsSection';

const DEFAULT_PRESET_AMOUNTS = [500, 1000, 5000, 10000];
const DEFAULT_TIP_PERCENT_OPTIONS = [10, 14, 16];
const DEFAULT_TIP_PERCENT = 14;
const MIN_DONATION_AMOUNT = 300;

type Tab = 'CASH' | 'PRODUCTS';
type TipMode = 'none' | 'preset' | 'custom';

export default function CampaignDonatePanel({ campaign }: { campaign: Campaign }) {
  const presetAmounts = campaign.presetAmounts && campaign.presetAmounts.length > 0
    ? campaign.presetAmounts
    : DEFAULT_PRESET_AMOUNTS;

  const tipPercentOptions = campaign.tipPercentOptions && campaign.tipPercentOptions.length > 0
    ? campaign.tipPercentOptions
    : DEFAULT_TIP_PERCENT_OPTIONS;

  const defaultTipPercent = tipPercentOptions.includes(DEFAULT_TIP_PERCENT)
    ? DEFAULT_TIP_PERCENT
    : tipPercentOptions[0];

  const [tab, setTab] = useState<Tab>('CASH');

  // Cash tab state
  const [selectedPreset, setSelectedPreset] = useState<number | null>(presetAmounts[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [tipMode, setTipMode] = useState<TipMode>('preset');
  const [selectedTipPercent, setSelectedTipPercent] = useState<number | null>(defaultTipPercent);
  const [customTip, setCustomTip] = useState('');

  // Products tab state
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Donor details (shared)
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const [validationError, setValidationError] = useState('');
  const { loading, error, success, donate } = useDonationCheckout();

  const panelRef = useRef<HTMLDivElement>(null);

  // Keeps this panel in sync with the "Donate an Item" grid in the main content —
  // picking a product there switches this panel to the Products tab, pre-selects
  // that item, and scrolls the panel into view.
  useEffect(() => {
    function handleSelectProduct(event: Event) {
      const { productId } = (event as CustomEvent<{ productId: number }>).detail;
      const product = (campaign.products || []).find((p) => p.id === productId);
      if (!product) return;

      setTab('PRODUCTS');
      setQuantities((prev) => {
        const current = prev[productId] || 0;
        if (current >= product.availableQty) return prev;
        return { ...prev, [productId]: current + 1 };
      });
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.addEventListener(SELECT_PRODUCT_EVENT, handleSelectProduct);
    return () => window.removeEventListener(SELECT_PRODUCT_EVENT, handleSelectProduct);
  }, [campaign.products]);

  const percent = campaign.goalAmount > 0
    ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100))
    : 0;

  const cashBaseAmount = selectedPreset ?? (parseFloat(customAmount) || 0);
  const tipAmount = tipMode === 'none'
    ? 0
    : tipMode === 'custom'
      ? Math.round(parseFloat(customTip) || 0)
      : Math.round((cashBaseAmount * (selectedTipPercent || 0)) / 100);
  const cashTotal = cashBaseAmount + tipAmount;

  const products = campaign.products || [];
  const cartTotal = products.reduce((sum, p) => sum + (quantities[p.id] || 0) * p.pricePerUnit, 0);
  const cartItemCount = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const updateQuantity = (productId: number, delta: number, max: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, Math.min(max, current + delta));
      return { ...prev, [productId]: next };
    });
  };

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

    if (tab === 'CASH' && cashBaseAmount < MIN_DONATION_AMOUNT) {
      setValidationError(`Minimum donation amount is ₹${MIN_DONATION_AMOUNT}.`);
      return;
    }
    if (tab === 'PRODUCTS' && cartItemCount === 0) {
      setValidationError('Please select at least one item to donate.');
      return;
    }

    if (tab === 'CASH') {
      donate(
        {
          donorName,
          email,
          phone: phone || undefined,
          mode: 'CASH',
          amount: cashBaseAmount,
          tipAmount,
          donationType: 'ONE_TIME',
          campaignId: campaign.id,
          paymentMethod,
        },
        {
          description: campaign.title,
          onSuccess: () => {
            setQuantities({});
            setCustomAmount('');
          },
        }
      );
    } else {
      const items = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([productId, quantity]) => ({ productId: Number(productId), quantity }));

      donate(
        {
          donorName,
          email,
          phone: phone || undefined,
          mode: 'PRODUCTS',
          items,
          donationType: 'ONE_TIME',
          campaignId: campaign.id,
          paymentMethod,
        },
        {
          description: campaign.title,
          onSuccess: () => setQuantities({}),
        }
      );
    }
  };

  const runningTotal = tab === 'CASH' ? cashTotal : cartTotal;

  return (
    <div ref={panelRef} className="bg-white border border-gray-200 rounded-xl shadow-sm sticky top-24 overflow-hidden">
      {/* Header Stats */}
      <div className="p-6 pb-0">
        <div className="flex justify-between text-xs uppercase tracking-wide text-gray-500 mb-1">
          <span>Target Goal</span>
          <span>Backers</span>
        </div>
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-2xl font-bold text-gray-900">₹{campaign.goalAmount.toLocaleString('en-IN')}</span>
          <span className="text-2xl font-bold text-gray-900">{campaign.backersCount}</span>
        </div>

        <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden mb-1">
          <div
            className="absolute inset-y-0 left-0 bg-green-600 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
          <span className="relative z-10 flex items-center justify-center h-full text-xs font-semibold text-gray-700">
            {percent}% Raised
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-5">
          ₹{campaign.raisedAmount.toLocaleString('en-IN')} raised of ₹{campaign.goalAmount.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-y border-gray-200">
        <button
          onClick={() => setTab('CASH')}
          className={`flex-1 py-3 text-sm font-semibold transition ${
            tab === 'CASH' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          DONATE CASH
        </button>
        <button
          onClick={() => setTab('PRODUCTS')}
          className={`flex-1 py-3 text-sm font-semibold transition ${
            tab === 'PRODUCTS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          PRODUCTS
        </button>
      </div>

      <div className="p-6 space-y-5 max-h-[28rem] overflow-y-auto">
        {tab === 'CASH' ? (
          <>
            {/* Preset Amounts */}
            <div className="grid grid-cols-2 gap-2">
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

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">Custom Amount</label>
              <input
                type="number"
                min={MIN_DONATION_AMOUNT}
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedPreset(null); }}
                placeholder={`Min ₹${MIN_DONATION_AMOUNT}`}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tip Selector */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5">Add a Tip</p>
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
            </div>

            {tipAmount > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-2 text-sm text-amber-800">
                Tip: ₹{tipAmount.toLocaleString('en-IN')}
              </div>
            )}

            <div className="flex justify-between text-sm font-semibold text-gray-900 pt-1 border-t border-gray-100">
              <span>Total Amount</span>
              <span>₹{cashTotal.toLocaleString('en-IN')}</span>
            </div>
            {tipAmount > 0 && (
              <p className="text-xs text-gray-400 -mt-3">
                ₹{cashBaseAmount.toLocaleString('en-IN')} + ₹{tipAmount.toLocaleString('en-IN')} tip
              </p>
            )}
          </>
        ) : (
          <>
            {products.length === 0 ? (
              <p className="text-sm text-gray-500">No items are available for in-kind donation on this campaign yet.</p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => {
                  const qty = quantities[product.id] || 0;
                  return (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          ₹{product.pricePerUnit.toLocaleString('en-IN')} • {product.availableQty} available
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(product.id, -1, product.availableQty)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{qty}</span>
                        <button
                          onClick={() => updateQuantity(product.id, 1, product.availableQty)}
                          disabled={qty >= product.availableQty}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between text-sm font-semibold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Cart Total</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Donor Details */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <input
            type="text"
            placeholder="Your Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="email"
            placeholder="Your Email"
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
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
            <option value="netbanking">Netbanking</option>
          </select>
          <p className="text-xs text-gray-400">Accepted: UPI, Cards, Netbanking</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Thank you! Your donation has been recorded.
          </div>
        )}
        {(validationError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {validationError || error}
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-900">₹{runningTotal.toLocaleString('en-IN')}</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || runningTotal <= 0}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-green-600 active:bg-green-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:active:bg-blue-600"
        >
          {loading ? 'Processing...' : 'Donate Now'}
        </button>
      </div>
    </div>
  );
}
