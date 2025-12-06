import { useState } from 'react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';
import { AxiosRequestConfig } from 'axios';

interface UseMutationOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
}

export function useMutation<TData = any, TVariables = any>(
    method: 'post' | 'put' | 'patch' | 'delete',
    options: UseMutationOptions = {}
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const { showSuccess, showError } = useToast();

    const mutate = async (endpoint: string, data?: TVariables, config?: AxiosRequestConfig) => {
        setLoading(true);
        setError(null);
        try {
            const requestConfig = {
                ...config,
                skipToast: options.showErrorToast === false
            };
            const response = await api[method]<TData>(endpoint, data, requestConfig as AxiosRequestConfig);

            if (options.showSuccessToast !== false && options.successMessage) {
                showSuccess(options.successMessage);
            }

            if (options.onSuccess) {
                options.onSuccess(response.data);
            }

            return response.data;
        } catch (err: any) {
            setError(err);

            // Error toast handled by api interceptor unless skipToast is true

            if (options.onError) {
                options.onError(err);
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error };
}
