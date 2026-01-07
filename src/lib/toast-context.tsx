'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none'
            }}>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast, onClose: () => void }) {
    const getStyles = () => {
        switch (toast.type) {
            case 'success': return { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: <CheckCircle size={20} /> };
            case 'error': return { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', icon: <AlertCircle size={20} /> };
            case 'warning': return { bg: '#fffbeb', border: '#fef3c7', color: '#b45309', icon: <AlertCircle size={20} /> };
            default: return { bg: '#eff6ff', border: '#dbeafe', color: '#1d4ed8', icon: <Info size={20} /> };
        }
    };

    const styles = getStyles();

    return (
        <div style={{
            background: styles.bg,
            border: `1px solid ${styles.border}`,
            color: styles.color,
            padding: '12px 20px',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '450px',
            pointerEvents: 'auto',
            animation: 'slideIn 0.3s ease-out forwards',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {styles.icon}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '600', flex: 1 }}>
                {toast.message}
            </div>
            <button onClick={onClose} style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                opacity: 0.6,
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <X size={16} />
            </button>
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: styles.color,
                opacity: 0.2,
                animation: 'progress 5s linear forwards'
            }} />
            <style jsx>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
