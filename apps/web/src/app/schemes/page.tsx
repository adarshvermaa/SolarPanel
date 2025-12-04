'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { SchemeCard } from '../../components/SchemeCard';
import { gsap } from 'gsap';

export default function SchemesPage() {
    const [schemes, setSchemes] = useState([]);
    const [filteredSchemes, setFilteredSchemes] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, residential, commercial

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const response = await api.get('/schemes');
                setSchemes(response.data);
                setFilteredSchemes(response.data);
            } catch (error) {
                console.error('Failed to fetch schemes', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, []);

    useEffect(() => {
        let result = schemes;

        // Apply search filter
        if (search) {
            result = result.filter((scheme: any) =>
                scheme.name.toLowerCase().includes(search.toLowerCase()) ||
                scheme.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply category filter (mock logic as category might not be in data yet)
        if (filter !== 'all') {
            // This is a placeholder logic. In real app, check scheme.category
            // result = result.filter((scheme: any) => scheme.category === filter);
        }

        setFilteredSchemes(result);

        // Animate items when list changes
        gsap.fromTo(".scheme-card",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
        );

    }, [search, filter, schemes]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Header Section */}
            <div className="bg-green-700 dark:bg-green-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
                        Government Solar Schemes
                    </h1>
                    <p className="mt-4 text-xl text-green-100 max-w-2xl mx-auto">
                        Explore subsidies and incentives designed to make your transition to solar energy affordable and seamless.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-12 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out sm:text-sm"
                                placeholder="Search by scheme name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                All Schemes
                            </button>
                            <button
                                onClick={() => setFilter('residential')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'residential' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                Residential
                            </button>
                            <button
                                onClick={() => setFilter('commercial')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'commercial' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                Commercial
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                            {Array.isArray(filteredSchemes) && filteredSchemes.length > 0 ? (
                                filteredSchemes.map((scheme: any) => (
                                    <div key={scheme.id} className="scheme-card h-full">
                                        <SchemeCard scheme={scheme} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No schemes found</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
                                    <div className="mt-6">
                                        <button
                                            onClick={() => { setSearch(''); setFilter('all'); }}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
