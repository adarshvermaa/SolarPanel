'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '../../../../hooks/useMutation';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';

export default function NewSchemePage() {
    const router = useRouter();
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Create New Scheme
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 bg-white p-8 shadow rounded-lg">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="subsidyPercentage" className="block text-sm font-medium text-gray-700">
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
                            <label htmlFor="maxSubsidyAmount" className="block text-sm font-medium text-gray-700">
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
                            <label htmlFor="minCapacity" className="block text-sm font-medium text-gray-700">
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
                            <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">
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
                                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isActive" className="font-medium text-gray-700">
                                Active Scheme
                            </label>
                            <p className="text-gray-500">Visible to users for application.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? <LoadingSpinner size="sm" color="white" /> : 'Create Scheme'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
