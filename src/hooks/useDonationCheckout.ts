'use client';

import { useCallback, useState } from 'react';
import { submitDonation, verifyDonation } from '@/lib/api';
import { openRazorpayCheckout } from '@/lib/razorpay';
import type { DonationRequest } from '@/lib/api';

interface DonateOptions {
  /** Shown inside the Razorpay checkout widget (e.g. a campaign title, or "General Donation"). */
  description: string;
  /** Called once the payment is verified server-side and counted as a real success. */
  onSuccess?: () => void;
}

/**
 * Shared "create order -> open Razorpay checkout -> verify" flow, used by both the
 * campaign donate panel and the global donate modal so the logic (and its safety
 * properties — never show success without server verification) only exists once.
 */
export function useDonationCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setError('');
    setSuccess(false);
  }, []);

  const donate = useCallback(async (payload: DonationRequest, options: DonateOptions) => {
    setError('');
    setLoading(true);

    try {
      const response = await submitDonation(payload);
      const { donation, razorpay } = response;

      await openRazorpayCheckout({
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: 'Win Foundations',
        description: options.description,
        order_id: razorpay.orderId,
        prefill: { name: payload.donorName, email: payload.email, contact: payload.phone },
        theme: { color: '#2563eb' },
        handler: async (paymentResponse) => {
          // Never trust the browser callback alone — verify server-side before
          // showing success. The webhook is the ultimate source of truth, but this
          // gives the donor immediate feedback without waiting for it.
          try {
            await verifyDonation(donation.id, paymentResponse);
            setSuccess(true);
            options.onSuccess?.();
            setTimeout(() => setSuccess(false), 6000);
          } catch {
            setError('We could not verify your payment. If money was deducted, it will be reconciled automatically — otherwise please try again.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled. Your donation was not completed — please try again.');
            setLoading(false);
          },
        },
      });
    } catch (err) {
      setError('Payment failed to start. Please try again.');
      setLoading(false);
    }
  }, []);

  return { loading, error, success, donate, reset };
}
