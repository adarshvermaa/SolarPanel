'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { useMutation } from '@/hooks/useMutation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EditSchemePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { data: scheme, loading: fetchLoading } = useApi(`/schemes/${id}`);
    const { mutate: updateScheme, loading: updateLoading } = useMutation('patch', {
        successMessage: 'Scheme updated successfully',
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
        if (scheme) {
            setFormData({
                name: scheme.name,
                description: scheme.description || '',
                subsidyPercentage: scheme.subsidyPercentage || '',
                maxSubsidyAmount: scheme.maxSubsidyAmount || '',
                minCapacity: scheme.minCapacity || '',
                maxCapacity: scheme.maxCapacity || '',
                isActive: scheme.isActive,
            });
        }
    }, [scheme]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateScheme(`/schemes/${id}`, formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    if (fetchLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Edit Scheme
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 p-8 shadow rounded-lg">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Scheme Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="subsidyPercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Subsidy Percentage (%)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="subsidyPercentage"
                                    id="subsidyPercentage"
                                    required
                                    min="0"
                                    max="100"
                                    value={formData.subsidyPercentage}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="maxSubsidyAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Max Subsidy Amount (₹)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="maxSubsidyAmount"
                                    id="maxSubsidyAmount"
                                    required
                                    min="0"
                                    value={formData.maxSubsidyAmount}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="minCapacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Min Capacity (kW)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="minCapacity"
                                    id="minCapacity"
                                    required
                                    min="0"
                                    step="0.1"
                                    value={formData.minCapacity}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Max Capacity (kW)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="maxCapacity"
                                    id="maxCapacity"
                                    required
                                    min="0"
                                    step="0.1"
                                    value={formData.maxCapacity}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isActive" className="font-medium text-gray-700 dark:text-gray-300">
                                Active Scheme
                            </label>
                            <p className="text-gray-500 dark:text-gray-400">Visible to users for application.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateLoading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {updateLoading ? <LoadingSpinner size="sm" /> : 'Update Scheme'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
