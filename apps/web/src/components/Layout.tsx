'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

export function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Admin routes
    if (pathname?.startsWith('/admin')) {
        return <AdminLayout>{children}</AdminLayout>;
    }

    // User authenticated routes
    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/apply') || pathname?.startsWith('/applications')) {
        return <UserLayout>{children}</UserLayout>;
    }

    // Public routes (home, login, register, schemes, etc.)
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
