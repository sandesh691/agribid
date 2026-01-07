'use client';

import { useState } from 'react';
import { useToast } from '@/lib/toast-context';
import { useModal } from '@/lib/modal-context';

interface Violation {
    id: string;
    user: string;
    type: string;
    risk: 'HIGH' | 'MEDIUM' | 'LOW';
    details: string;
    date: string;
}

export default function AiViolationsPage() {
    const { showToast } = useToast();
    const { showModal } = useModal();
    const [violations, setViolations] = useState<Violation[]>([
        { id: 'v1', user: 'retailer_alpha@example.com', type: 'Cartel Bidding', risk: 'HIGH', details: 'Automated bidding detected from same IP as multiple retailers.', date: '2025-12-27' },
        { id: 'v2', user: 'farmer_beta@example.com', type: 'Price Inflation', risk: 'MEDIUM', details: 'Listing price 300% above current regional market average.', date: '2025-12-26' },
        { id: 'v3', user: 'retailer_gamma@example.com', type: 'Bid Retraction', risk: 'LOW', details: 'Frequent bid retractions causing market instability.', date: '2025-12-25' }
    ]);

    const handleAudit = (id: string) => {
        showToast(`Initiating comprehensive audit for violation ${id}. Our AI Guardian is deep-scanning all associated transactions...`, 'info');
    };

    const handleSanction = (id: string) => {
        showModal({
            title: 'Apply Sanctions?',
            message: 'Are you sure you want to apply sanctions? This will temporarily suspend the user account and freeze pending payouts. This action is recorded in the platform audit logs.',
            type: 'confirm',
            confirmText: 'Yes, Apply Sanctions',
            cancelText: 'Cancel',
            onConfirm: () => {
                setViolations(violations.filter(v => v.id !== id));
                showToast('Sanction applied successfully. User has been notified and account suspended.', 'success');
            }
        });
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem', color: '#e53e3e' }}>⚠️ AI Integrity Violations</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>The AgriBid AI Guardian monitors real-time market behavior to detect fraud, cartels, and price manipulation.</p>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {violations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                        <p>No active violations detected. The marketplace is secure.</p>
                    </div>
                ) : (
                    violations.map(v => (
                        <div key={v.id} className="card" style={{ borderLeft: `5px solid ${v.risk === 'HIGH' ? '#e53e3e' : v.risk === 'MEDIUM' ? '#ed8936' : '#ecc94b'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div>
                                    <span style={{ padding: '2px 6px', borderRadius: '4px', background: v.risk === 'HIGH' ? '#fee2e2' : v.risk === 'MEDIUM' ? '#ffedd5' : '#fef3c7', color: v.risk === 'HIGH' ? '#c53030' : v.risk === 'MEDIUM' ? '#9a3412' : '#92400e', fontSize: '0.75rem', fontWeight: 'bold', marginRight: '0.5rem' }}>{v.risk} RISK</span>
                                    <span style={{ fontWeight: 'bold', color: '#2d3748' }}>{v.type}</span>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: '#718096' }}>{v.date}</span>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.9rem', color: '#2d3748', marginBottom: '0.25rem' }}>User: <strong>{v.user}</strong></div>
                                <p style={{ fontSize: '0.85rem', color: '#4a5568' }}>{v.details}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleAudit(v.id)}
                                    className="btn-primary"
                                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: '#3182ce', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                                >
                                    Audit User
                                </button>
                                <button
                                    onClick={() => handleSanction(v.id)}
                                    className="btn-outline"
                                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', color: '#e53e3e', border: '1px solid #e53e3e', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}
                                >
                                    Apply Sanction
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
