import React, { createContext, useContext, useState, ReactNode } from 'react';

type ConsentStatus = 'pending' | 'accepted' | 'declined';

interface CookieConsentContextType {
  consent: ConsentStatus;
  acceptCookies: () => void;
  declineCookies: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentStatus>(() => {
    const stored = localStorage.getItem('hoh_cookie_consent');
    return (stored as ConsentStatus) || 'pending';
  });

  const acceptCookies = () => {
    setConsent('accepted');
    localStorage.setItem('hoh_cookie_consent', 'accepted');
  };

  const declineCookies = () => {
    setConsent('declined');
    localStorage.setItem('hoh_cookie_consent', 'declined');
  };

  return (
    <CookieConsentContext.Provider value={{ consent, acceptCookies, declineCookies }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return ctx;
}
