import { useCallback, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ToastMessage } from '../types';

export function useToast(toast: ToastMessage | null, setToast: Dispatch<SetStateAction<ToastMessage | null>>) {
  const notify = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, [setToast]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timer);
  }, [toast, setToast]);
  return { notify };
}
