import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
}

export function useApi<T = any>(
    endpoint: string | null,
    options: UseApiOptions = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!!endpoint);
    const [error, setError] = useState<any>(null);
    const { showError } = useToast();

    const optionsRef = useRef(options);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const fetchData = useCallback(async () => {
        if (!endpoint) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get(endpoint, {
                skipToast: optionsRef.current.showErrorToast === false
            } as any);
            setData(response.data);
            if (optionsRef.current.onSuccess) {
                optionsRef.current.onSuccess(response.data);
            }
        } catch (err: any) {
            setError(err);
            // Error toast handled by api interceptor unless skipToast is true
            if (optionsRef.current.onError) {
                optionsRef.current.onError(err);
            }
        } finally {
            setLoading(false);
        }
    }, [endpoint, showError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
