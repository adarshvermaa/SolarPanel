'use client';

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useApi } from '@/hooks/useApi';

interface CalculatorConfig {
    id: number;
    stateName: string;
    avgSunlightHours: string;
    costPerKw: string;
    electricityRate: string;
    efficiencyPanel: string;
    co2SavingsPerUnit: string;
}

export default function CalculatorPage() {
    const [monthlyBill, setMonthlyBill] = useState('');
    const [roofArea, setRoofArea] = useState('');
    const [selectedStateId, setSelectedStateId] = useState<string>('');
    const [result, setResult] = useState<any>(null);
    const [calculating, setCalculating] = useState(false);

    // Fetch calculator configurations
    const { data: configs, loading: configLoading } = useApi<CalculatorConfig[]>('/calculator');

    // Set default state when configs load
    useEffect(() => {
        if (configs && configs.length > 0 && !selectedStateId) {
            // Prefer "Default" state if exists, else first one
            const defaultConfig = configs.find(c => c.stateName === 'Default') || configs[0];
            setSelectedStateId(defaultConfig.id.toString());
        }
    }, [configs, selectedStateId]);

    const calculateSolar = (e: React.FormEvent) => {
        e.preventDefault();
        setCalculating(true);

        // Simulate calculation delay for better UX
        setTimeout(() => {
            const bill = parseFloat(monthlyBill);
            const area = parseFloat(roofArea);
            const config = configs?.find(c => c.id.toString() === selectedStateId);

            if (isNaN(bill) || isNaN(area) || !config) {
                setCalculating(false);
                return;
            }

            // Parse config values (received as strings from decimal columns)
            const unitRate = parseFloat(config.electricityRate);
            const avgSunHours = parseFloat(config.avgSunlightHours);
            const costPerKw = parseFloat(config.costPerKw);
            const efficiency = parseFloat(config.efficiencyPanel);

            // Derive generation factor
            // Assuming 80% Performance Ratio (PR)
            // Units per day per kW = 1 kW * Avg Sun Hours * 0.8
            const dailyGenerationPerKw = avgSunHours * 0.8;

            // Area per kW
            // 1 kW = 1000 W. Panel Area = 1000 / (1000 W/m2 * Efficiency) / 10.764 sqft/m2
            // Roughly 100 sq ft is a safe standard including gaps
            const areaPerKw = 100;

            // Calculations
            const monthlyUnits = bill / unitRate;
            const dailyUnits = monthlyUnits / 30;

            // Recommended capacity based on consumption
            let recommendedCapacity = dailyUnits / dailyGenerationPerKw;

            // Check if roof area is sufficient
            const maxCapacityByArea = area / areaPerKw;

            // Final recommended capacity (limited by area)
            const finalCapacity = Math.min(recommendedCapacity, maxCapacityByArea);

            // Financials
            const estimatedCost = finalCapacity * costPerKw;

            // Subsidy Calculation (PM Surya Ghar)
            // This logic remains static as it's a central scheme feature, 
            // unless we move subsidy rules to backend too.
            let subsidy = 0;
            if (finalCapacity <= 2) {
                subsidy = finalCapacity * 30000;
            } else if (finalCapacity <= 3) {
                subsidy = (2 * 30000) + ((finalCapacity - 2) * 18000);
            } else {
                subsidy = 78000; // Max subsidy for > 3kW
            }

            const netCost = estimatedCost - subsidy;
            const monthlySavings = monthlyUnits * unitRate;
            const annualSavings = monthlySavings * 12;
            const roiYears = annualSavings > 0 ? netCost / annualSavings : 0;

            setResult({
                capacity: finalCapacity.toFixed(2),
                areaRequired: (finalCapacity * areaPerKw).toFixed(0),
                estimatedCost: estimatedCost.toFixed(0),
                subsidy: subsidy.toFixed(0),
                netCost: netCost.toFixed(0),
                monthlySavings: monthlySavings.toFixed(0),
                annualSavings: annualSavings.toFixed(0),
                roi: roiYears.toFixed(1),
                state: config.stateName
            });

            setCalculating(false);
        }, 800);
    };

    useEffect(() => {
        if (result) {
            gsap.fromTo("#result-section",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [result]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Solar Savings Calculator
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                        Estimate your solar potential, costs, and savings with PM Surya Ghar subsidy benefits.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Calculator Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Enter Your Details
                        </h2>
                        <form onSubmit={calculateSolar} className="space-y-6">

                            {/* State Selection */}
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    State / Region
                                </label>
                                {configLoading ? (
                                    <div className="w-full h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
                                ) : (
                                    <select
                                        id="state"
                                        value={selectedStateId}
                                        onChange={(e) => setSelectedStateId(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-2 px-3"
                                        required
                                    >
                                        <option value="" disabled>Select your state</option>
                                        {configs?.map((config) => (
                                            <option key={config.id} value={config.id}>
                                                {config.stateName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <Input
                                id="monthly-bill"
                                name="monthlyBill"
                                type="number"
                                required
                                value={monthlyBill}
                                onChange={(e) => setMonthlyBill(e.target.value)}
                                placeholder="e.g. 2500"
                                label="Average Monthly Electricity Bill (₹)"
                                icon={
                                    <span className="text-gray-500 dark:text-gray-400 font-bold">₹</span>
                                }
                            />
                            <Input
                                id="roof-area"
                                name="roofArea"
                                type="number"
                                required
                                value={roofArea}
                                onChange={(e) => setRoofArea(e.target.value)}
                                placeholder="e.g. 500"
                                label="Available Roof Area (sq. ft.)"
                                icon={
                                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                }
                            />

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                disabled={calculating || configLoading || !selectedStateId}
                            >
                                {calculating ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Calculating...
                                    </span>
                                ) : (
                                    'Calculate Savings'
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                        {!result ? (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p>Enter your details to see your solar potential and savings.</p>
                            </div>
                        ) : (
                            <div id="result-section" className="space-y-6">
                                <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                                        Recommended System Size ({result.state})
                                    </h3>
                                    <p className="text-4xl font-extrabold text-green-600 dark:text-green-400 mt-2">
                                        {result.capacity} kW
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Requires approx. {result.areaRequired} sq. ft.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Cost</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">₹{parseInt(result.estimatedCost).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Subsidy</p>
                                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">-₹{parseInt(result.subsidy).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600 dark:text-gray-300">Net Cost to You</span>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{parseInt(result.netCost).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-600 dark:text-green-400">Annual Savings</span>
                                        <span className="font-semibold text-green-600 dark:text-green-400">₹{parseInt(result.annualSavings).toLocaleString()}/yr</span>
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                                        Payback Period: <span className="font-semibold text-gray-900 dark:text-white">{result.roi} Years</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button className="w-full" onClick={() => window.location.href = '/apply'}>
                                        Apply for This System
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
