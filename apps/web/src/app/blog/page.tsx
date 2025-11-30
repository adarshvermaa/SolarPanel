'use client';

import React, { useEffect, useRef } from 'react';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import gsap from 'gsap';
import Link from 'next/link';

export default function BlogPage() {
    const { data: posts, loading } = useApi('/blog?isPublished=true');
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

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Blog</h2>
                    <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Latest News & Updates
                    </p>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                        Stay informed about solar energy trends, government schemes, and success stories.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div ref={listRef} className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                        {!posts || posts.length === 0 ? (
                            <div className="col-span-3 text-center py-12">
                                <p className="text-gray-500 text-lg">No blog posts found.</p>
                            </div>
                        ) : (
                            posts.map((item: any) => (
                                <div key={item.post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
                                    <div className="flex-shrink-0">
                                        {item.post.coverImage ? (
                                            <img className="h-48 w-full object-cover" src={item.post.coverImage} alt={item.post.title} />
                                        ) : (
                                            <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-4xl">📷</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-green-600">
                                                Article
                                            </p>
                                            <Link href={`/blog/${item.post.slug}`} className="block mt-2">
                                                <p className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors">
                                                    {item.post.title}
                                                </p>
                                                <p className="mt-3 text-base text-gray-500 line-clamp-3">
                                                    {item.post.excerpt}
                                                </p>
                                            </Link>
                                        </div>
                                        <div className="mt-6 flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="sr-only">{item.author?.fullName}</span>
                                                {item.author?.avatar ? (
                                                    <img className="h-10 w-10 rounded-full" src={item.author.avatar} alt="" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                                                        {item.author?.fullName?.charAt(0) || 'A'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.author?.fullName || 'Admin'}
                                                </p>
                                                <div className="flex space-x-1 text-sm text-gray-500">
                                                    <time dateTime={item.post.createdAt}>
                                                        {new Date(item.post.createdAt).toLocaleDateString()}
                                                    </time>
                                                    <span aria-hidden="true">&middot;</span>
                                                    <span>{Math.ceil(item.post.content?.length / 1000) || 5} min read</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
