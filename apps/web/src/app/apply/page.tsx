'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import gsap from 'gsap';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ApplyPage() {
    const router = useRouter();
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedScheme, setSelectedScheme] = useState<any>(null);
    const formRef = useRef<HTMLFormElement>(null);
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

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
        }
    }, []);

    useEffect(() => {
        if (formData.schemeId) {
            const scheme = schemes.find((s: any) => s.id === parseInt(formData.schemeId));
            setSelectedScheme(scheme);
        } else {
            setSelectedScheme(null);
        }
    }, [formData.schemeId, schemes]);

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
                roofType: 'flat',
                requestedCapacity: parseFloat(formData.connectedLoad) * 0.8,
                estimatedCost: 0,
                estimatedSubsidy: 0,
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                        ☀️ New Solar Application
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Fill out the form below to apply for a government solar scheme
                    </p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {/* Scheme Selection Card */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 transition-colors">
                        <div className="flex items-center mb-6">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <span className="text-green-600 dark:text-green-400 text-xl">1</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Scheme Selection</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Choose the government scheme you wish to apply for</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="schemeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Scheme *
                            </label>
                            <select
                                id="schemeId"
                                name="schemeId"
                                required
                                value={formData.schemeId}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-lg transition-colors"
                            >
                                <option value="">Select a scheme</option>
                                {schemes.map((scheme: any) => (
                                    <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
                                ))}
                            </select>
                            {selectedScheme && (
                                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-sm text-green-800 dark:text-green-300">
                                        <strong>Subsidy:</strong> {selectedScheme.subsidyPercentage}% (Max: ₹{selectedScheme.maxSubsidyAmount})
                                    </p>
                                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">{selectedScheme.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Applicant Details Card */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 transition-colors">
                        <div className="flex items-center mb-6">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 text-xl">2</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Applicant Details</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Your personal information</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="applicantName"
                                    id="applicantName"
                                    required
                                    value={formData.applicantName}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Details Card */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 transition-colors">
                        <div className="flex items-center mb-6">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                <span className="text-purple-600 dark:text-purple-400 text-xl">3</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Property Details</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Information about your property</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="House no., Street, Locality"
                                />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    id="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="State"
                                />
                            </div>
                            <div>
                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    PIN Code *
                                </label>
                                <input
                                    type="text"
                                    name="pincode"
                                    id="pincode"
                                    required
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="XXXXXX"
                                />
                            </div>
                            <div>
                                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Property Type *
                                </label>
                                <select
                                    name="propertyType"
                                    id="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                >
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="industrial">Industrial</option>
                                    <option value="institutional">Institutional</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="roofArea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Roof Area (sq ft) *
                                </label>
                                <input
                                    type="number"
                                    name="roofArea"
                                    id="roofArea"
                                    required
                                    value={formData.roofArea}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="500"
                                />
                            </div>
                            <div>
                                <label htmlFor="avgMonthlyBill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Avg Monthly Bill (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="avgMonthlyBill"
                                    id="avgMonthlyBill"
                                    required
                                    value={formData.avgMonthlyBill}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="5000"
                                />
                            </div>
                            <div>
                                <label htmlFor="connectedLoad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Connected Load (kW) *
                                </label>
                                <input
                                    type="number"
                                    name="connectedLoad"
                                    id="connectedLoad"
                                    required
                                    value={formData.connectedLoad}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="3.5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
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
                            className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    ✨ Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
