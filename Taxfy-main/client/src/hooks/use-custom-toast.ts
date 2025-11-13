import { useState, useCallback } from 'react';

interface CustomToast {
  id: string;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

interface ToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

let toastCounter = 0;

export const useCustomToast = () => {
  const [toasts, setToasts] = useState<CustomToast[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    console.log("🔔 Adding custom toast:", id, options.title);
    
    const newToast: CustomToast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || 'default'
    };

    setToasts(prev => {
      // Only keep the latest toast (replace any existing ones)
      return [newToast];
    });

    return {
      id,
      dismiss: () => removeToast(id)
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    console.log("🔔 Removing custom toast:", id);
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options);
  }, [addToast]);

  return {
    toasts,
    toast,
    removeToast
  };
}; 