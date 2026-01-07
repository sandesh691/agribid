'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Package, ChevronRight, Calendar, Tag, CreditCard, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrderHistoryPage() {
    const { language, t } = useLanguage();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders/history');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <Link href="/retailer" style={{ color: 'inherit', textDecoration: 'none' }}>{t('sidebar_dashboard')}</Link>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>{t('sidebar_order_history') || 'Order History'}</span>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>
                    {t('sidebar_order_history') || 'Order History'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    {t('view_past_orders_desc') || 'View and track all your successfully completed crop purchases.'}
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary-green)', borderRadius: '50%', margin: '0 auto 1.5rem auto' }}></div>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{t('loading_history') || 'Loading your orders...'}</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="card animate-fade" style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📦</div>
                    <h2 style={{ marginBottom: '1rem' }}>{t('no_orders_yet') || 'No orders yet'}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('completed_bids_hint') || 'Your successfully completed bids will appear here.'}</p>
                    <Link href="/retailer/marketplace" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '12px' }}>
                        {t('go_to_marketplace') || 'Go to Marketplace'} <ChevronRight size={18} />
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="card stat-card-hover animate-fade" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1.5rem',
                            borderRadius: '20px',
                            background: 'white',
                            border: '1px solid #f1f5f9'
                        }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '16px',
                                    background: '#f0fdf4',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary-green)'
                                }}>
                                    <ShoppingBag size={28} />
                                </div>
                                <div>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        fontWeight: '800',
                                        background: '#f0fdf4',
                                        color: '#166534',
                                        textTransform: 'uppercase',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {order.orderStatus}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#1e293b' }}>{order.crop.name}</h3>
                                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Tag size={14} /> <strong>{order.quantityPurchased} kg</strong>
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <CreditCard size={14} /> <strong>₹{order.pricePerKg}/kg</strong>
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-green)' }}>
                                            <strong>{t('amount_column') || 'Total'}: ₹{order.totalAmount.toLocaleString()}</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.25rem' }}>{t('transaction_id') || 'Transaction ID'}</div>
                                <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#1e293b', fontFamily: 'monospace' }}>#{order.id.split('-')[0].toUpperCase()}</div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    fontSize: '0.75rem',
                                    marginTop: '0.75rem',
                                    color: '#64748b',
                                    justifyContent: 'flex-end',
                                    fontWeight: '500'
                                }}>
                                    <Calendar size={13} /> {new Date(order.timestamp).toLocaleDateString(language === 'hi' ? 'hi-IN' : (language === 'kn' ? 'kn-IN' : 'en-IN'), { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
