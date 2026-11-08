import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { RoleProvider } from '@/context/RoleContext';

export const metadata: Metadata = {
  title: 'Canary — Population and Workforce Health Early-Warning Platform',
  description:
    'Sense emerging population and workforce health risk by combining environmental exposure leads with aggregated health-service and workplace outcomes.',
  icons: {
    icon: '/favicon.ico',
    apple: '/images/canary-icon-64.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-canary-text antialiased selection:bg-canary-amber selection:text-canvas-deep">
        <RoleProvider>{children}<ThemeToggle /></RoleProvider>
      </body>
    </html>
  );
}
