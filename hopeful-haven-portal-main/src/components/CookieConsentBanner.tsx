import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsentBanner() {
  const { consent, acceptCookies, declineCookies } = useCookieConsent();

  return (
    <AnimatePresence>
      {consent === 'pending' && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg p-4 md:p-6"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">We value your privacy</p>
              <p className="text-xs text-muted-foreground mt-1">
                We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
                Read our <a href="/privacy" className="text-primary underline">Privacy Policy</a> for more information.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={declineCookies}>Decline</Button>
              <Button size="sm" onClick={acceptCookies}>Accept</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
