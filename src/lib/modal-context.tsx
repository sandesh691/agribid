'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle, Info, X, HelpCircle } from 'lucide-react';

interface ModalOptions {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface ModalContextType {
    showModal: (options: ModalOptions) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [modal, setModal] = useState<ModalOptions | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const showModal = useCallback((options: ModalOptions) => {
        setModal(options);
        setIsOpen(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => setModal(null), 300);
    }, []);

    const handleConfirm = () => {
        if (modal?.onConfirm) modal.onConfirm();
        hideModal();
    };

    const handleCancel = () => {
        if (modal?.onCancel) modal.onCancel();
        hideModal();
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'all 0.3s ease'
                }}>
                    <div
                        onClick={hideModal}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.4)',
                            backdropFilter: 'blur(8px)',
                            opacity: isOpen ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }}
                    />
                    <div style={{
                        position: 'relative',
                        background: 'white',
                        width: '100%',
                        maxWidth: '450px',
                        borderRadius: '28px',
                        padding: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
                        opacity: isOpen ? 1 : 0,
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                background: modal.type === 'error' ? '#fef2f2' : (modal.type === 'warning' ? '#fffbeb' : (modal.type === 'success' ? '#f0fdf4' : '#eff6ff')),
                                color: modal.type === 'error' ? '#ef4444' : (modal.type === 'warning' ? '#f59e0b' : (modal.type === 'success' ? '#22c55e' : '#3b82f6'))
                            }}>
                                {modal.type === 'error' && <X size={32} />}
                                {modal.type === 'warning' && <AlertTriangle size={32} />}
                                {modal.type === 'success' && <CheckCircle size={32} />}
                                {modal.type === 'info' && <Info size={32} />}
                                {modal.type === 'confirm' && <HelpCircle size={32} />}
                            </div>

                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem' }}>
                                {modal.title}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                {modal.message}
                            </p>

                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                width: '100%',
                                marginTop: '0.5rem'
                            }}>
                                {(modal.type === 'confirm' || modal.cancelText) && (
                                    <button
                                        onClick={handleCancel}
                                        style={{
                                            flex: 1,
                                            padding: '0.85rem',
                                            borderRadius: '14px',
                                            border: '2px solid #f1f5f9',
                                            background: 'white',
                                            color: '#64748b',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        {modal.cancelText || 'Cancel'}
                                    </button>
                                )}
                                <button
                                    onClick={handleConfirm}
                                    style={{
                                        flex: 1,
                                        padding: '0.85rem',
                                        borderRadius: '14px',
                                        border: 'none',
                                        background: modal.type === 'error' ? '#ef4444' : (modal.type === 'warning' ? '#f59e0b' : 'var(--primary-green)'),
                                        color: 'white',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {modal.confirmText || (modal.type === 'confirm' ? 'Confirm' : 'OK')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within ModalProvider');
    return context;
};
