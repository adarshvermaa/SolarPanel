'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function SchemeDetailsPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [scheme, setScheme] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScheme = async () => {
            if (!slug) return;
            try {
                // Try fetching by slug directly if API supports it, otherwise fetch all and find
                // Assuming API supports /schemes/slug or we filter. 
                // Let's try fetching all for now to be safe as I don't know the backend route for slug
                const response = await api.get('/schemes');
                const foundScheme = response.data.find((s: any) => s.slug === slug);

                if (foundScheme) {
                    setScheme(foundScheme);
                } else {
                    // Fallback or 404 handling
                    console.error('Scheme not found');
                }
            } catch (error) {
                console.error('Failed to fetch scheme details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchScheme();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!scheme) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Scheme Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">The scheme you are looking for does not exist or has been removed.</p>
                <Link href="/schemes">
                    <Button>Back to Schemes</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/schemes" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Schemes
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="bg-green-600 dark:bg-green-700 px-8 py-6">
                        <h1 className="text-3xl font-extrabold text-white">{scheme.name}</h1>
                        <div className="mt-2 flex items-center text-green-100">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                {scheme.subsidyPercentage}% Subsidy
                            </span>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {scheme.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Eligibility</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {scheme.eligibility || "Open for all residential consumers with valid electricity connection."}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Documents Required</h3>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                                    <li>Identity Proof (Aadhar/PAN)</li>
                                    <li>Electricity Bill</li>
                                    <li>Property Ownership Proof</li>
                                    <li>Bank Account Details</li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex justify-end">
                            <Button
                                onClick={() => router.push('/apply')}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all text-lg"
                            >
                                Apply Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
