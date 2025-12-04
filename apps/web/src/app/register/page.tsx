'use client';

// Redirect to the auth register page
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/auth/register');
    }, [router]);

    return null;
}
