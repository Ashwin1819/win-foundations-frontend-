'use client';

import { useRouter } from 'next/navigation';

/**
 * A universal "← Back" control used at the top of every non-homepage page, on
 * both mobile and desktop. Deliberately rendered identically on server and
 * client (no window-dependent conditional) to avoid a hydration mismatch —
 * the "where do I actually go" decision only happens inside the click
 * handler, client-side, after mount.
 */
export default function BackButton({
  className = '',
  light = false,
}: {
  className?: string;
  /** Use light text — for placing on a dark/colored hero background instead of white. */
  light?: boolean;
}) {
  const router = useRouter();

  const handleClick = () => {
    const sameOriginReferrer =
      typeof document !== 'undefined' &&
      document.referrer &&
      (() => {
        try {
          return new URL(document.referrer).origin === window.location.origin;
        } catch {
          return false;
        }
      })();

    if (sameOriginReferrer || (typeof window !== 'undefined' && window.history.length > 1)) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`font-medium text-sm inline-flex items-center ${
        light ? 'text-white/90 hover:text-white' : 'text-blue-600 hover:text-blue-800'
      } ${className}`}
    >
      ← Back
    </button>
  );
}
