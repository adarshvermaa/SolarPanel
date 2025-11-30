'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../lib/api';
import { SchemeCard } from '../components/SchemeCard';

export default function HomePage() {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await api.get('/schemes');
        setSchemes(response.data.slice(0, 3)); // Show top 3 schemes
      } catch (error) {
        console.error('Failed to fetch schemes', error);
      }
    };
    fetchSchemes();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-700">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Solar Panels"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Go Solar, Save Earth & Money
          </h1>
          <p className="mt-6 text-xl text-green-100 max-w-3xl">
            Access government schemes, apply for subsidies, and track your solar installation journey seamlessly with our platform.
          </p>
          <div className="mt-10 max-w-sm sm:flex sm:max-w-none">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link
                href="/schemes"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-green-50 sm:px-8"
              >
                View Schemes
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Schemes Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Opportunities</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Featured Government Schemes
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Explore the latest subsidies and incentives available for residential and commercial solar installations.
          </p>
        </div>
        <div className="mt-12 grid gap-8 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {Array.isArray(schemes) && schemes.length > 0 ? (
            schemes.map((scheme: any) => <SchemeCard key={scheme.id} scheme={scheme} />)
          ) : (
            <p className="col-span-full text-center text-sm text-muted-foreground">No schemes found.</p>
          )}
        </div>
        <div className="mt-10 text-center">
          <Link href="/schemes" className="text-green-600 hover:text-green-800 font-medium text-lg">
            View All Schemes →
          </Link>
        </div>
      </div>
    </div>
  );
}
