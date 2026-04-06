import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { CookieConsentBanner } from './CookieConsentBanner';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CookieConsentBanner />
    </div>
  );
}
