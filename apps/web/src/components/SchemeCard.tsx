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
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{scheme.description}</p>
                <div className="flex justify-between items-center">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {scheme.subsidyPercentage}% Subsidy
                    </span>
                    <Link
                        href={`/schemes/${scheme.slug}`}
                        className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
}
