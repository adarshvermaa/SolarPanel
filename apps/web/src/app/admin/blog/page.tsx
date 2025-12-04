'use client';

import React, { useEffect, useRef } from 'react';
import { useApi } from '../../../hooks/useApi';
import { useMutation } from '../../../hooks/useMutation';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import gsap from 'gsap';
import Link from 'next/link';

export default function AdminBlogPage() {
    const { data: posts, loading, refetch } = useApi('/blog');
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Blog Posts</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Manage blog content. Create, edit, and publish articles.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        href="/admin/blog/new"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Post
                    </Link>
                </div>
            </div>
            <div ref={listRef} className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts?.map((item: any) => (
                    <div key={item.post.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg flex flex-col">
                        <div className="px-4 py-5 sm:p-6 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white truncate">
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
                                <span>Views: {item.post.viewCount}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(item.post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6 flex justify-end space-x-3">
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
        </div>
    );
}
