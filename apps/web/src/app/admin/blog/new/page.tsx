'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '../../../../hooks/useMutation';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';

export default function NewBlogPostPage() {
    const router = useRouter();
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Create New Blog Post
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 bg-white p-8 shadow rounded-lg">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                            Excerpt
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                rows={2}
                                required
                                value={formData.excerpt}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Brief summary of the post.</p>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content (HTML supported)
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="content"
                                name="content"
                                rows={10}
                                required
                                value={formData.content}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                            Cover Image URL
                        </label>
                        <div className="mt-1">
                            <input
                                type="url"
                                name="coverImage"
                                id="coverImage"
                                value={formData.coverImage}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                            Tags (comma separated)
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="tags"
                                id="tags"
                                placeholder="solar, energy, green"
                                value={formData.tags}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="isPublished"
                                name="isPublished"
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={handleChange}
                                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isPublished" className="font-medium text-gray-700">
                                Publish Immediately
                            </label>
                            <p className="text-gray-500">If unchecked, the post will be saved as a draft.</p>
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
                            {loading ? <LoadingSpinner size="sm" /> : 'Create Post'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
