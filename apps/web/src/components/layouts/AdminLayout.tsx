'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
        { name: 'Applications', href: '/admin/applications', icon: '📝' },
        { name: 'Users', href: '/admin/users', icon: '👥' },
        { name: 'Schemes', href: '/admin/schemes', icon: '☀️' },
        { name: 'Installations', href: '/admin/installations', icon: '🔧' },
        { name: 'Blog', href: '/admin/blog', icon: '📰' },
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 dark:bg-gray-950 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 bg-gray-800 dark:bg-gray-900">
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                    ? 'bg-gray-800 dark:bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="border-t border-gray-800 dark:border-gray-900 p-4">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-white font-bold">
                                {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{user?.fullName}</p>
                                <p className="text-xs text-gray-400">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
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
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            {navigation.find((item) => isActive(item.href))?.name || 'Admin'}
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
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
