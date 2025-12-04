'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    const toastRef = useRef<HTMLDivElement>(null);

    const typeStyles = {
        success: 'bg-green-500 dark:bg-green-600 text-white',
        error: 'bg-red-500 dark:bg-red-600 text-white',
        info: 'bg-blue-500 dark:bg-blue-600 text-white',
        warning: 'bg-yellow-500 dark:bg-yellow-600 text-white',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
    };

    useEffect(() => {
        if (toastRef.current) {
            // Entrance animation
            gsap.fromTo(
                toastRef.current,
                { x: 400, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
            );

            // Auto-dismiss
            const timer = setTimeout(() => {
                if (toastRef.current) {
                    gsap.to(toastRef.current, {
                        x: 400,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: onClose,
                    });
                }
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const handleClose = () => {
        if (toastRef.current) {
            gsap.to(toastRef.current, {
                x: 400,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: onClose,
            });
        }
    };

    return (
        <div
            ref={toastRef}
            className={`${typeStyles[type]} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}
        >
            <span className="text-xl font-bold">{icons[type]}</span>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={handleClose}
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Close"
            >
                ✕
            </button>
        </div>
    );
}
