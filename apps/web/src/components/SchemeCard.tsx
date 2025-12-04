import React from 'react';
import Link from 'next/link';

interface Scheme {
    id: number;
    name: string;
    description: string;
    slug: string;
    subsidyPercentage: number;
}

export function SchemeCard({ scheme }: { scheme: Scheme }) {
    return (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
            <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Active Scheme
                    </div>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {scheme.subsidyPercentage}% <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Subsidy</span>
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {scheme.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-grow leading-relaxed">
                    {scheme.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <Link
                        href={`/schemes/${scheme.slug}`}
                        className="text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center"
                    >
                        View Details
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                    <Link
                        href="/apply"
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
