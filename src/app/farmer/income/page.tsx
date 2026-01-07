'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

export default function IncomeTrackingPage() {
    const { language, t } = useLanguage();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIncome();
    }, []);

    const fetchIncome = async () => {
        try {
            const res = await fetch('/api/farmer/income');
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--primary-green)' }}>
            {language === 'hi' ? 'कमाई का डेटा लोड हो रहा है...' : (language === 'kn' ? 'ಗಳಿಕೆಯ ಡೇಟಾವನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading earnings data...')}
        </div>
    );

    const maxMonthly = Math.max(...(data?.monthlyEarnings.map((m: any) => m.amount) || [1]), 1);

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{t('income_tracking_title')}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ borderLeft: '6px solid var(--primary-green)', borderRadius: '16px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('total_earnings')}</span>
                    <h2 style={{ fontSize: '2.25rem', color: 'var(--primary-green)', margin: '0.5rem 0', fontWeight: '900' }}>₹{data?.totalEarnings.toLocaleString()}</h2>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('lifetime_sales')}</p>
                </div>
                <div className="card" style={{ borderLeft: '6px solid #f59e0b', borderRadius: '16px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('pending_clearance')}</span>
                    <h2 style={{ fontSize: '2.25rem', color: '#f59e0b', margin: '0.5rem 0', fontWeight: '900' }}>₹{data?.pendingPayments.toLocaleString()}</h2>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('awaiting_payment')}</p>
                </div>
                <div className="card" style={{ borderLeft: '6px solid #3b82f6', borderRadius: '16px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('stability_score')}</span>
                    <h2 style={{ fontSize: '2.25rem', color: '#3b82f6', margin: '0.5rem 0', fontWeight: '900' }}>82%</h2>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('income_reliability')}</p>
                </div>
            </div>

            {/* Simple CSS Chart */}
            <div className="card" style={{ marginBottom: '2.5rem', borderRadius: '20px' }}>
                <h3 style={{ marginBottom: '2rem', fontWeight: '800' }}>{t('earning_trends')}</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '220px', padding: '0 1rem' }}>
                    {data?.monthlyEarnings.map((m: any, i: number) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                                style={{
                                    width: '100%',
                                    maxWidth: '45px',
                                    background: 'linear-gradient(to top, var(--primary-green), #4ade80)',
                                    height: `${(m.amount / maxMonthly) * 160}px`,
                                    borderRadius: '8px 8px 0 0',
                                    transition: 'height 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(21, 128, 61, 0.1)'
                                }}
                                title={`₹${m.amount}`}
                            ></div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>{m.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ borderRadius: '20px', padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>{t('transaction_history')}</h3>
                {data?.transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        <p style={{ fontSize: '1.1rem' }}>{t('no_completed_sales')}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: '700' }}>{t('crop_label')}</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: '700' }}>{t('qty_column')}</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: '700' }}>{t('amount_column')}</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: '700' }}>{t('payment_status_column')}</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: '700' }}>{t('date_column')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.transactions.map((t: any) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem', fontWeight: '700', color: '#1e293b' }}>{t.crop.name}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>{t.quantityPurchased}</td>
                                        <td style={{ padding: '1rem', fontWeight: '800', color: 'var(--primary-green)' }}>₹{t.totalAmount.toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                background: t.paymentStatus === 'RECEIVED' ? '#f0fdf4' : '#fff7ed',
                                                color: t.paymentStatus === 'RECEIVED' ? '#15803d' : '#9a3412',
                                                fontSize: '0.75rem',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.025em'
                                            }}>
                                                {t.paymentStatus === 'RECEIVED' ? (language === 'hi' ? 'प्राप्त' : (language === 'kn' ? 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ' : 'RECEIVED')) : (language === 'hi' ? 'लंबित' : (language === 'kn' ? 'ಬಾಕಿ ಇದೆ' : 'PENDING'))}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#64748b' }}>{new Date(t.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
