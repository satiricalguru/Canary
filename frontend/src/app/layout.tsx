import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/newsreader/standard.css';
import '@fontsource-variable/newsreader/standard-italic.css';
import './globals.css';
import './workspace.css';
import 'leaflet/dist/leaflet.css';
import { RoleProvider } from '@/context/RoleContext';

export const metadata: Metadata = {
  title: 'Canary — Population and Workforce Health Early-Warning Platform',
  description:
    'Sense emerging population and workforce health risk by combining environmental exposure leads with aggregated health-service and workplace outcomes.',
  icons: {
    icon: { url: '/images/canary-logo.svg', type: 'image/svg+xml', sizes: 'any' },
    apple: { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="antialiased">
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  );
}
