'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { SchemeCard } from '../../components/SchemeCard';

export default function SchemesPage() {
    const [schemes, setSchemes] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const response = await api.get(`/schemes?search=${search}`);
                setSchemes(response.data);
            } catch (error) {
                console.error('Failed to fetch schemes', error);
            }
        };
        // Debounce search could be added here
        const timeoutId = setTimeout(() => fetchSchemes(), 300);
        return () => clearTimeout(timeoutId);
    }, [search]);
    console.log(schemes, 'schemes')
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Government Solar Schemes
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Find the perfect scheme for your energy needs.
                    </p>
                </div>

                <div className="max-w-xl mx-auto mb-10">
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="text"
                            className="focus:ring-green-500 focus:border-green-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                            placeholder="Search schemes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-12 grid gap-8 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                    {Array.isArray(schemes) && schemes.length > 0 ? (
                        schemes.map((scheme: any) => <SchemeCard key={scheme.id} scheme={scheme} />)
                    ) : (
                        <p className="col-span-full text-center text-sm text-muted-foreground">No schemes found.</p>
                    )}
                </div>

                {schemes?.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        No schemes found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
