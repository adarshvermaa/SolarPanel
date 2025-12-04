'use client';

import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Layout } from '../components/Layout';
import PageTransition from '../components/PageTransition';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>DPCG - PM Surya Ghar Solar Solutions | Government Subsidy Platform</title>
        <meta name="description" content="Apply for PM Surya Ghar Yojana solar rooftop subsidy. Get up to ₹78,000 government subsidy for solar installation. DPCG Solar Solutions - Your trusted partner for clean energy." />
        <meta name="keywords" content="PM Surya Ghar, solar subsidy, rooftop solar, government scheme, solar installation, DPCG, clean energy, solar panels, muft bijli yojana" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="og:title" content="DPCG - PM Surya Ghar Solar Solutions" />
        <meta property="og:description" content="Apply for government solar subsidy and get up to ₹78,000 for rooftop solar installation" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Layout>
                <PageTransition>
                  {children}
                </PageTransition>
              </Layout>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
