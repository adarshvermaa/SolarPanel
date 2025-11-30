'use client';

import React, { useEffect, useRef } from 'react';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import gsap from 'gsap';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BlogPostPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const { data: postData, loading } = useApi(`/blog/slug/${slug}`);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && contentRef.current && postData) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
        }
    }, [loading, postData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!postData) {
        return (
            <div className="max-w-7xl mx-auto py-16 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
                <p className="mt-2 text-gray-500">The blog post you are looking for does not exist.</p>
                <Link href="/blog" className="mt-4 inline-block text-green-600 hover:text-green-500">
                    &larr; Back to Blog
                </Link>
            </div>
        );
    }

    const { post, author } = postData;

    return (
        <article className="bg-white min-h-screen pb-16">
            {/* Header / Cover Image */}
            <div className="relative w-full h-96 bg-gray-900">
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-green-800 to-blue-900 opacity-90" />
                )}
                <div className="absolute inset-0 flex flex-col justify-end max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="flex items-center space-x-2 text-green-300 font-medium mb-4">
                        <Link href="/blog" className="hover:text-white transition-colors">
                            Blog
                        </Link>
                        <span>/</span>
                        <span>Article</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                        {post.title}
                    </h1>
                    <div className="flex items-center text-gray-300">
                        <div className="flex items-center">
                            {author?.avatar ? (
                                <img className="h-10 w-10 rounded-full border-2 border-white" src={author.avatar} alt="" />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-white font-bold">
                                    {author?.fullName?.charAt(0) || 'A'}
                                </div>
                            )}
                            <span className="ml-3 font-medium text-white">{author?.fullName || 'Admin'}</span>
                        </div>
                        <span className="mx-4">&middot;</span>
                        <time dateTime={post.createdAt}>
                            {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="prose prose-lg prose-green mx-auto text-gray-500">
                    <p className="lead text-xl text-gray-700 mb-8 font-medium">
                        {post.excerpt}
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-12 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
