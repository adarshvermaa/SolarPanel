'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ThemeToggle';

import { Sidebar } from '../Sidebar';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    // Navigation items are now handled in Sidebar component

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="lg:pl-72 flex flex-col min-h-screen">
                {/* Top bar */}
                <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 shadow-sm lg:px-8 transition-colors duration-200">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 lg:hidden"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex-1 lg:flex lg:justify-between lg:items-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 ml-4 lg:ml-0">
                            Admin Panel
                        </h2>
                        <div className="hidden lg:flex items-center space-x-4">
                            <ThemeToggle />
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
                            >
                                View User Dashboard →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-grow p-4 lg:p-8">
                    {children}
                </main>


            </div>
        </div>
    );
}
