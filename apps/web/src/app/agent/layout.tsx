'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AgentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'agent')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-neutral-900">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!user || user.role !== 'agent') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
            <div className="py-10">
                {children}
            </div>
        </div>
    );
}
