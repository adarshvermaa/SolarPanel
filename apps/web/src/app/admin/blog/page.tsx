'use client';

import React, { useEffect, useRef } from 'react';
import { useApi } from '../../../hooks/useApi';
import { useMutation } from '../../../hooks/useMutation';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import gsap from 'gsap';
import Link from 'next/link';

export default function AdminBlogPage() {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(12);
    const [search, setSearch] = React.useState('');
    const [status, setStatus] = React.useState(''); // 'true', 'false', ''

    const queryString = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}${status ? `&isPublished=${status}` : ''}`;
    const { data: responseData, loading, refetch } = useApi(`/blog${queryString}`);

    const posts = Array.isArray(responseData) ? responseData : responseData?.data || [];
    const meta = responseData?.meta || { total: 0, totalPages: 0 };

    const { mutate: deletePost } = useMutation('delete', {
        successMessage: 'Post deleted successfully',
        onSuccess: () => refetch(),
    });

    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && listRef.current && posts?.length > 0) {
            gsap.fromTo(
                listRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [loading, posts]);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this post?')) {
            await deletePost(`/blog/${id}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Blog Posts</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Manage blog content. Create, edit, and publish articles.
                    </p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
                >
                    Add Post
                </Link>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                    >
                        <option value="">All Status</option>
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <>
                    {posts.length === 0 ? (
                        <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
                            No posts found matching your criteria.
                        </div>
                    ) : (
                        <div ref={listRef} className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((item: any) => (
                                <div key={item.post.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg flex flex-col hover:shadow-lg transition-shadow duration-200">
                                    <div className="px-4 py-5 sm:p-6 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white truncate pr-2" title={item.post.title}>
                                                {item.post.title}
                                            </h3>
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${item.post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {item.post.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                                            {item.post.excerpt || 'No excerpt available.'}
                                        </p>
                                        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <span>Views: {item.post.viewCount || 0}</span>
                                            <span className="mx-2">•</span>
                                            <span>{new Date(item.post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400">
                                            By {item.author?.fullName || 'Unknown'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6 flex justify-end space-x-3 border-t border-gray-100 dark:border-gray-600">
                                        <Link
                                            href={`/admin/blog/${item.post.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.post.id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {meta.total > 0 && (
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                                    disabled={page === meta.totalPages}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => setPage(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {/* Simple numeric display - can be improved for many pages */}
                                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-white">
                                            {page} / {meta.totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                                            disabled={page === meta.totalPages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
