'use client';

import React, { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ProtectedRoute from '../../../components/ProtectedRoute';
import gsap from 'gsap';
import Link from 'next/link';

export default function ApplicationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { data: application, loading, error } = useApi(`/applications/${id}`);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && contentRef.current && application) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
        }
    }, [loading, application]);

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !application) {
        return (
            <ProtectedRoute>
                <div className="max-w-7xl mx-auto py-16 px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Application not found</h2>
                    <p className="mt-2 text-gray-500">The application you are looking for does not exist or you do not have permission to view it.</p>
                    <Link href="/dashboard" className="mt-4 inline-block text-green-600 hover:text-green-500">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </ProtectedRoute>
        );
    }

    // Handle both flat and nested structures for robustness
    const appData = application.application || application;
    const schemeData = application.scheme || { name: `Scheme #${appData.schemeId}` };

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/dashboard" className="text-green-600 hover:text-green-500 mb-4 inline-block">
                        &larr; Back to Dashboard
                    </Link>
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Application Details
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {appData.applicationNumber}
                            </p>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${appData.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    appData.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {appData.status.charAt(0).toUpperCase() + appData.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                <div ref={contentRef} className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Applicant Information
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Personal details and application status.
                        </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appData.applicantName}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appData.applicantEmail}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appData.applicantPhone}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Scheme</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{schemeData.name}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Submitted At</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {new Date(appData.createdAt).toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="px-4 py-5 sm:px-6 border-t border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Property & System Details
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Address</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {appData.address}, {appData.city}, {appData.state} - {appData.pincode}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{appData.propertyType}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Roof Area</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appData.roofArea} sq ft</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Requested Capacity</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appData.requestedCapacity} kW</dd>
                            </div>
                        </dl>
                    </div>

                    {appData.rejectionReason && (
                        <div className="bg-red-50 border-t border-red-200 px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-red-900">
                                Rejection Reason
                            </h3>
                            <p className="mt-1 text-sm text-red-700">
                                {appData.rejectionReason}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
