'use client';

import React, { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useMutation } from '@/hooks/useMutation';
import { DataTable } from '@/components/ui/DataTable';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CalculatorConfig {
    id: number;
    stateName: string;
    avgSunlightHours: string;
    costPerKw: string;
    electricityRate: string;
    efficiencyPanel: string;
    co2SavingsPerUnit: string;
    isActive: boolean;
}

export default function CalculatorConfigPage() {
    const { data: configs, loading, refetch } = useApi<CalculatorConfig[]>('/calculator');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConfig, setEditingConfig] = useState<CalculatorConfig | null>(null);

    const { mutate: createConfig, loading: creating } = useMutation('post', {
        onSuccess: () => {
            toast.success('Configuration created successfully');
            setIsModalOpen(false);
            setEditingConfig(null);
            refetch();
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create configuration')
    });

    const { mutate: updateConfig, loading: updating } = useMutation('patch', {
        onSuccess: () => {
            toast.success('Configuration updated successfully');
            setIsModalOpen(false);
            setEditingConfig(null);
            refetch();
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update configuration')
    });

    const { mutate: deleteConfig } = useMutation('delete', {
        onSuccess: () => {
            toast.success('Configuration deleted successfully');
            refetch();
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete configuration')
    });

    // Form State
    const [formData, setFormData] = useState({
        stateName: '',
        avgSunlightHours: '',
        costPerKw: '',
        electricityRate: '',
        efficiencyPanel: '0.18',
        co2SavingsPerUnit: '0.710'
    });

    const handleOpenModal = (config?: CalculatorConfig) => {
        if (config) {
            setEditingConfig(config);
            setFormData({
                stateName: config.stateName,
                avgSunlightHours: config.avgSunlightHours,
                costPerKw: config.costPerKw,
                electricityRate: config.electricityRate,
                efficiencyPanel: config.efficiencyPanel,
                co2SavingsPerUnit: config.co2SavingsPerUnit
            });
        } else {
            setEditingConfig(null);
            setFormData({
                stateName: '',
                avgSunlightHours: '',
                costPerKw: '',
                electricityRate: '',
                efficiencyPanel: '0.18',
                co2SavingsPerUnit: '0.710'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            avgSunlightHours: parseFloat(formData.avgSunlightHours),
            costPerKw: parseFloat(formData.costPerKw),
            electricityRate: parseFloat(formData.electricityRate),
            efficiencyPanel: parseFloat(formData.efficiencyPanel),
            co2SavingsPerUnit: parseFloat(formData.co2SavingsPerUnit),
        };

        if (editingConfig) {
            await updateConfig(`/calculator/${editingConfig.id}`, payload);
        } else {
            await createConfig('/calculator', payload);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this configuration?')) {
            await deleteConfig(`/calculator/${id}`);
        }
    };

    const columns = [
        {
            key: 'stateName',
            header: 'State',
            sortable: true,
        },
        {
            key: 'avgSunlightHours',
            header: 'Sun Hours',
            sortable: true,
            render: (item: CalculatorConfig) => `${item.avgSunlightHours} hrs`
        },
        {
            key: 'costPerKw',
            header: 'Cost / kW',
            sortable: true,
            render: (item: CalculatorConfig) => `₹${parseFloat(item.costPerKw).toLocaleString()}`
        },
        {
            key: 'electricityRate',
            header: 'Rate / Unit',
            sortable: true,
            render: (item: CalculatorConfig) => `₹${item.electricityRate}`
        },
        {
            key: 'efficiencyPanel',
            header: 'Efficiency',
            render: (item: CalculatorConfig) => `${(parseFloat(item.efficiencyPanel) * 100).toFixed(0)}%`
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (item: CalculatorConfig) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => handleOpenModal(item)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calculator Configuration</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Manage solar parameters for different states to ensure accurate calculator estimates.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Button onClick={() => handleOpenModal()}>
                        Add Configuration
                    </Button>
                </div>
            </div>

            <DataTable
                data={configs || []}
                columns={columns}
                loading={loading}
                searchKeys={['stateName']}
                itemsPerPageOptions={[10, 25, 50]}
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {editingConfig ? 'Edit Configuration' : 'Add New State'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                id="stateName"
                                name="stateName"
                                label="State Name"
                                value={formData.stateName}
                                onChange={(e) => setFormData({ ...formData, stateName: e.target.value })}
                                required
                                placeholder="e.g. Kerala"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    id="avgSunlightHours"
                                    name="avgSunlightHours"
                                    label="Avg Sun Hours"
                                    type="number"
                                    step="0.1"
                                    value={formData.avgSunlightHours}
                                    onChange={(e) => setFormData({ ...formData, avgSunlightHours: e.target.value })}
                                    required
                                    placeholder="e.g. 5.5"
                                />
                                <Input
                                    id="electricityRate"
                                    name="electricityRate"
                                    label="Rate / Unit (₹)"
                                    type="number"
                                    step="0.1"
                                    value={formData.electricityRate}
                                    onChange={(e) => setFormData({ ...formData, electricityRate: e.target.value })}
                                    required
                                    placeholder="e.g. 8.5"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    id="costPerKw"
                                    name="costPerKw"
                                    label="Cost per kW (₹)"
                                    type="number"
                                    value={formData.costPerKw}
                                    onChange={(e) => setFormData({ ...formData, costPerKw: e.target.value })}
                                    required
                                    placeholder="e.g. 50000"
                                />
                                <Input
                                    id="efficiencyPanel"
                                    name="efficiencyPanel"
                                    label="Panel Efficiency"
                                    type="number"
                                    step="0.01"
                                    value={formData.efficiencyPanel}
                                    onChange={(e) => setFormData({ ...formData, efficiencyPanel: e.target.value })}
                                    required
                                    placeholder="e.g. 0.18"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={creating || updating}
                                >
                                    {creating || updating ? 'Saving...' : 'Save Configuration'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
