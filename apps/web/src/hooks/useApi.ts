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
    endpoint: string,
    options: UseApiOptions = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const { showError } = useToast();

    const optionsRef = useRef(options);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(endpoint);
            setData(response.data);
            if (optionsRef.current.onSuccess) {
                optionsRef.current.onSuccess(response.data);
            }
        } catch (err: any) {
            setError(err);
            if (optionsRef.current.showErrorToast !== false) {
                showError(err.response?.data?.message || 'Failed to fetch data');
            }
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
