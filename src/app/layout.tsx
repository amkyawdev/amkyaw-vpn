import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amkyaw VPN - Free VPN Dashboard',
  description: 'Access free VPN servers from VPN Gate. Secure, anonymous, and free.',
  keywords: ['VPN', 'Free VPN', 'VPN Gate', 'Secure', 'Anonymous'],
  authors: [{ name: 'Amkyaw' }],
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  openGraph: { title: 'Amkyaw VPN - Free VPN Dashboard', description: 'Access free VPN servers from VPN Gate', type: 'website' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
