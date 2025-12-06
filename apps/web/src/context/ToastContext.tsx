'use client';

import React, { createContext, useContext } from 'react';
import { Toaster, toast, ToastOptions } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
    showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const showToast = (message: string, type: ToastType) => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
            case 'warning': // react-hot-toast doesn't have warning by default, use custom or icon
                toast(message, {
                    icon: type === 'warning' ? '⚠️' : 'ℹ️',
                });
                break;
            default:
                toast(message);
        }
    };

    const showSuccess = (message: string) => toast.success(message);
    const showError = (message: string) => toast.error(message);
    const showInfo = (message: string) => toast(message, { icon: 'ℹ️' });
    const showWarning = (message: string) => toast(message, { icon: '⚠️' });

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
            {children}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#10B981', // Green-500
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444', // Red-500
                        },
                    },
                }}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
