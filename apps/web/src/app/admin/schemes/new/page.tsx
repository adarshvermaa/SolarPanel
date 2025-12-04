'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '../../../../hooks/useMutation';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import gsap from 'gsap';

export default function NewSchemePage() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const { mutate: createScheme, loading } = useMutation('post', {
        successMessage: 'Scheme created successfully',
        onSuccess: () => router.push('/admin/schemes'),
    });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subsidyPercentage: '',
        maxSubsidyAmount: '',
        minCapacity: '',
        maxCapacity: '',
        isActive: true,
    });

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createScheme('/schemes', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                            ☀️ Create New Scheme
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Add a new government solar scheme to the platform
                        </p>
                    </div>
                </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 transition-colors border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 text-xl font-bold">1</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Scheme name and description</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Scheme Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Rooftop Solar Subsidy 2024"
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Provide a detailed description of the scheme benefits and eligibility criteria..."
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all resize-none"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This will be displayed to users when selecting a scheme</p>
                        </div>
                    </div>
                </div>

                {/* Subsidy Details Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 transition-colors border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">2</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Subsidy Details</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Financial benefits configuration</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="subsidyPercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subsidy Percentage (%) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="subsidyPercentage"
                                    id="subsidyPercentage"
                                    required
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.subsidyPercentage}
                                    onChange={handleChange}
                                    placeholder="30"
                                    className="block w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 dark:text-gray-400">%</span>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Maximum percentage of subsidy offered</p>
                        </div>

                        <div>
                            <label htmlFor="maxSubsidyAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Max Subsidy Amount (₹) *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 dark:text-gray-400">₹</span>
                                </div>
                                <input
                                    type="number"
                                    name="maxSubsidyAmount"
                                    id="maxSubsidyAmount"
                                    required
                                    min="0"
                                    step="1000"
                                    value={formData.maxSubsidyAmount}
                                    onChange={handleChange}
                                    placeholder="78000"
                                    className="block w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Maximum financial assistance available</p>
                        </div>
                    </div>
                </div>

                {/* Capacity Requirements Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 transition-colors border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <span className="text-purple-600 dark:text-purple-400 text-xl font-bold">3</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Capacity Requirements</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Eligible system capacity range</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="minCapacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Minimum Capacity (kW) *
                            </label>
                            <input
                                type="number"
                                name="minCapacity"
                                id="minCapacity"
                                required
                                min="0"
                                step="0.1"
                                value={formData.minCapacity}
                                onChange={handleChange}
                                placeholder="1.0"
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Minimum system size required</p>
                        </div>

                        <div>
                            <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Maximum Capacity (kW) *
                            </label>
                            <input
                                type="number"
                                name="maxCapacity"
                                id="maxCapacity"
                                required
                                min="0"
                                step="0.1"
                                value={formData.maxCapacity}
                                onChange={handleChange}
                                placeholder="10.0"
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Maximum system size allowed</p>
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 transition-colors border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                            <span className="text-yellow-600 dark:text-yellow-400 text-xl font-bold">4</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Status & Visibility</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Control scheme availability</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                            />
                        </div>
                        <div className="ml-3">
                            <label htmlFor="isActive" className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                Active Scheme
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Active schemes are visible to users and can accept new applications
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center"
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Create Scheme
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
