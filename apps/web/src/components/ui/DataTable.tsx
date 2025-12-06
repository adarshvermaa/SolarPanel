'use client';

import React, { useState, useMemo } from 'react';

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchKeys?: string[];
    itemsPerPageOptions?: number[];
    loading?: boolean;
    // Server-side props
    totalItems?: number;
    onPageChange?: (page: number) => void;
    onSearchChange?: (search: string) => void;
    onLimitChange?: (limit: number) => void;
    isServerSide?: boolean;
    onRenderMobileItem?: (item: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
    data = [],
    columns,
    searchKeys = [],
    itemsPerPageOptions = [10, 25, 50, 100],
    loading = false,
    totalItems,
    onPageChange,
    onSearchChange,
    onLimitChange,
    isServerSide = false,
    onRenderMobileItem,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Debounce search
    React.useEffect(() => {
        if (!isServerSide) return;

        const timeoutId = setTimeout(() => {
            if (onSearchChange) onSearchChange(searchTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, isServerSide, onSearchChange]);

    // Client-side Filter logic
    const filteredData = useMemo(() => {
        if (isServerSide) return data; // Server handles filtering

        if (!searchTerm) return data;
        return data.filter((item) => {
            return searchKeys.some((key) => {
                const value = key.split('.').reduce((obj, k) => obj?.[k], item);
                return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }, [data, searchTerm, searchKeys, isServerSide]);

    // Client-side Sort logic
    const sortedData = useMemo(() => {
        if (isServerSide) return data; // Server typically handles sorting, or we sort the current page only

        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = sortConfig.key.split('.').reduce((obj, k) => obj?.[k], a);
            const bValue = sortConfig.key.split('.').reduce((obj, k) => obj?.[k], b);

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig, isServerSide, data]);

    // Pagination logic
    const totalCount = isServerSide ? (totalItems || 0) : sortedData.length;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // For server side, data is already the page. For client side, slice it.
    const paginatedData = isServerSide ? data : sortedData.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (!current || current.key !== key) {
                return { key, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return null;
        });
    };

    const handlePageChange = (page: number) => {
        const newPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(newPage);
        if (isServerSide && onPageChange) {
            onPageChange(newPage);
        }
    };

    const handleLimitChange = (limit: number) => {
        setItemsPerPage(limit);
        setCurrentPage(1);
        if (isServerSide) {
            if (onLimitChange) onLimitChange(limit);
            if (onPageChange) onPageChange(1);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (!isServerSide) setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                        {itemsPerPageOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-700 dark:text-gray-300">entries</span>
                </div>
            </div>

            {/* Mobile View */}
            {onRenderMobileItem && (
                <div className="md:hidden space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        </div>
                    ) : paginatedData.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No data found
                        </div>
                    ) : (
                        paginatedData.map((item, idx) => (
                            <div key={idx}>
                                {onRenderMobileItem(item)}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Desktop Table View */}
            <div className={`${onRenderMobileItem ? 'hidden md:block' : ''} overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                    >
                                        {column.sortable ? (
                                            <button
                                                onClick={() => handleSort(column.key)}
                                                className="group inline-flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400"
                                            >
                                                {column.header}
                                                <span className="flex flex-col">
                                                    <svg className={`h-3 w-3 ${sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M5 10l5-5 5 5H5z" />
                                                    </svg>
                                                    <svg className={`h-3 w-3 -mt-1 ${sortConfig?.key === column.key && sortConfig.direction === 'desc' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M15 10l-5 5-5-5h10z" />
                                                    </svg>
                                                </span>
                                            </button>
                                        ) : (
                                            column.header
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                {column.render
                                                    ? column.render(item)
                                                    : (column.key.split('.').reduce((obj, k) => obj?.[k], item) as any)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {totalCount > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, totalCount)} of {totalCount} entries
                    {!isServerSide && searchTerm && ` (filtered from ${data.length} total)`}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        ««
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        «
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-lg border ${currentPage === page
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 text-gray-500">...</span>;
                        }
                        return null;
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        »
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        »»
                    </button>
                </div>
            </div>
        </div>
    );
}
