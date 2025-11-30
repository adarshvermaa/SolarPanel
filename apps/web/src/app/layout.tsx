'use client';

import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
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
      <body>
        <AuthProvider>
          <ToastProvider>
            <Layout>
              <PageTransition>
                {children}
              </PageTransition>
            </Layout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
