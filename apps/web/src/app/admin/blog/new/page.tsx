'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '../../../../hooks/useMutation';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import gsap from 'gsap';

export default function NewBlogPostPage() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const { mutate: createPost, loading } = useMutation('post', {
        successMessage: 'Blog post created successfully',
        onSuccess: () => router.push('/admin/blog'),
    });

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        coverImage: '',
        tags: '',
        isPublished: false,
    });

    const [charCount, setCharCount] = useState({ excerpt: 0, content: 0 });

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
        }
    }, []);

    useEffect(() => {
        setCharCount({
            excerpt: formData.excerpt.length,
            content: formData.content.length
        });
    }, [formData.excerpt, formData.content]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        };
        await createPost('/blog', payload);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                            📝 Create New Blog Post
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Share insights about solar energy and sustainability
                        </p>
                    </div>
                </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 transition-colors border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">1</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Post title and summary</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Top 10 Benefits of Solar Energy in 2024"
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Make it catchy and informative</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Excerpt *
                                </label>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {charCount.excerpt} characters
                                </span>
                            </div>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                rows={3}
                                required
                                value={formData.excerpt}
                                onChange={handleChange}
                                placeholder="Write a compelling summary that will appear in the blog list..."
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all resize-none"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Brief summary shown in blog listings (recommended 150-200 characters)</p>
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 transition-colors border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">2</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Main Content</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Write your blog post content</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Content (HTML supported) *
                            </label>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {charCount.content} characters
                            </span>
                        </div>
                        <textarea
                            id="content"
                            name="content"
                            rows={15}
                            required
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="<h2>Introduction</h2><p>Start writing your blog post here...</p>"
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all resize-y font-mono text-sm"
                        />
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-xs text-blue-800 dark:text-blue-300">
                                💡 <strong>Tip:</strong> You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;blockquote&gt; for formatting
                            </p>
                        </div>
                    </div>
                </div>

                {/* Media & Metadata Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 transition-colors border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <span className="text-purple-600 dark:text-purple-400 text-xl font-bold">3</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Media & Metadata</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cover image and tags</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cover Image URL
                            </label>
                            <input
                                type="url"
                                name="coverImage"
                                id="coverImage"
                                value={formData.coverImage}
                                onChange={handleChange}
                                placeholder="https://example.com/images/solar-panels.jpg"
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Featured image for the blog post (optional)</p>
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                id="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="solar energy, renewable, sustainability, green energy"
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate tags with commas for better discoverability</p>
                        </div>
                    </div>
                </div>

                {/* Publishing Options Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 transition-colors border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 text-xl font-bold">4</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Publishing Options</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Control post visibility</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="isPublished"
                                name="isPublished"
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                            />
                        </div>
                        <div className="ml-3">
                            <label htmlFor="isPublished" className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                Publish Immediately
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                If unchecked, the post will be saved as a draft and won't be visible to users
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4">
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
                        className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center"
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {formData.isPublished ? 'Publish Post' : 'Save as Draft'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
