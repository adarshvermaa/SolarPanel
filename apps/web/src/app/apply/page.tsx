'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function ApplyPage() {
    const router = useRouter();
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        schemeId: '',
        applicantName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        propertyType: 'residential',
        roofArea: '',
        avgMonthlyBill: '',
        connectedLoad: '',
    });

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const response = await api.get('/schemes');
                setSchemes(response.data);
            } catch (error) {
                console.error('Failed to fetch schemes', error);
            }
        };
        fetchSchemes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/applications', {
                schemeId: parseInt(formData.schemeId),
                applicantName: formData.applicantName,
                applicantPhone: formData.phone,
                applicantEmail: formData.email,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                propertyType: formData.propertyType,
                roofArea: parseFloat(formData.roofArea),
                roofType: 'flat', // Default or add field
                requestedCapacity: parseFloat(formData.connectedLoad) * 0.8,
                estimatedCost: 0, // Calculate if needed
                estimatedSubsidy: 0, // Calculate if needed
                documents: [],
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Application submission failed', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        New Solar Application
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 bg-white p-8 shadow rounded-lg">
                <div className="space-y-8 divide-y divide-gray-200">

                    {/* Scheme Selection */}
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Scheme Selection</h3>
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="schemeId" className="block text-sm font-medium text-gray-700">
                                    Select Scheme
                                </label>
                                <select
                                    id="schemeId"
                                    name="schemeId"
                                    required
                                    value={formData.schemeId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select a scheme</option>
                                    {schemes.map((scheme: any) => (
                                        <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Applicant Details */}
                    <div className="pt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Applicant Details</h3>
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="applicantName" id="applicantName" required value={formData.applicantName} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="pt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Property Details</h3>
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
                                <input type="text" name="address" id="address" required value={formData.address} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" name="city" id="city" required value={formData.city} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                <input type="text" name="state" id="state" required value={formData.state} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                                <input type="text" name="pincode" id="pincode" required value={formData.pincode} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                                <select name="propertyType" id="propertyType" value={formData.propertyType} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="industrial">Industrial</option>
                                    <option value="institutional">Institutional</option>
                                </select>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="roofArea" className="block text-sm font-medium text-gray-700">Roof Area (sq ft)</label>
                                <input type="number" name="roofArea" id="roofArea" required value={formData.roofArea} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="avgMonthlyBill" className="block text-sm font-medium text-gray-700">Avg Monthly Bill (₹)</label>
                                <input type="number" name="avgMonthlyBill" id="avgMonthlyBill" required value={formData.avgMonthlyBill} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="connectedLoad" className="block text-sm font-medium text-gray-700">Connected Load (kW)</label>
                                <input type="number" name="connectedLoad" id="connectedLoad" required value={formData.connectedLoad} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
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
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
