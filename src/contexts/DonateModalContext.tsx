'use client';

import { createContext, useContext, useCallback, useRef, useState } from 'react';

interface DonateModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const DonateModalContext = createContext<DonateModalContextValue | null>(null);

export function DonateModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    // Remember whatever triggered the modal so we can restore focus to it on close.
    triggerRef.current = (document.activeElement as HTMLElement) || null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus?.();
  }, []);

  return (
    <DonateModalContext.Provider value={{ isOpen, open, close, triggerRef }}>
      {children}
    </DonateModalContext.Provider>
  );
}

export function useDonateModal() {
  const ctx = useContext(DonateModalContext);
  if (!ctx) {
    throw new Error('useDonateModal must be used within a DonateModalProvider');
  }
  return ctx;
}
