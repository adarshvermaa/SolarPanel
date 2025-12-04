'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const spinnerRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    useEffect(() => {
        if (spinnerRef.current) {
            gsap.to(spinnerRef.current, {
                rotation: 360,
                duration: 1,
                ease: 'linear',
                repeat: -1,
            });
        }
    }, []);

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                ref={spinnerRef}
                className={`${sizeClasses[size]} border-4 border-green-200 dark:border-green-800 border-t-green-600 dark:border-t-green-400 rounded-full`}
            />
        </div>
    );
}
