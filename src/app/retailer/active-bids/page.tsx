'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/lib/toast-context';
import { Clock, Tag, ShoppingBag, ChevronRight, Gavel, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function MyActiveBids() {
    const { language, t } = useLanguage();
    const { showToast } = useToast();
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [now, setNow] = useState(0);

    useEffect(() => {
        setNow(Date.now());
        fetchBids();
        const interval = setInterval(() => setNow(Date.now()), 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchBids = async () => {
        try {
            const res = await fetch('/api/bids/my-bids');
            const data = await res.json();
            setBids(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [paying, setPaying] = useState<string | null>(null);

    const handleCompletePayment = async (bidId: string) => {
        if (paying) return;
        setPaying(bidId);
        try {
            const res = await fetch(`/api/orders/pay/${bidId}`, { method: 'POST' });
            if (res.ok) {
                showToast(t('order_success_msg') || 'Order successfully done!', 'success');
                fetchBids();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to complete order', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('An error occurred', 'error');
        } finally {
            setPaying(null);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <Link href="/retailer" style={{ color: 'inherit', textDecoration: 'none' }}>{t('sidebar_dashboard')}</Link>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>{t('my_active_bids_title') || 'My Active Bids'}</span>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>
                    {t('my_active_bids_title') || 'My Active Bids'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    {t('manage_bidding_desc') || 'Manage and track your active bids in the marketplace.'}
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary-green)', borderRadius: '50%', margin: '0 auto 1.5rem auto' }}></div>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{t('loading_bids') || 'Loading your bids...'}</p>
                </div>
            ) : bids.length === 0 ? (
                <div className="card animate-fade" style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎯</div>
                    <h2 style={{ marginBottom: '1rem' }}>{t('no_active_bids') || 'No active bids found'}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('browse_market_hint') || 'Start bidding on fresh crops to see your activity here.'}</p>
                    <Link href="/retailer/marketplace" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '12px' }}>
                        {t('go_to_marketplace') || 'Go to Marketplace'} <ChevronRight size={18} />
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                    {bids.map(bid => {
                        const isEnded = new Date(bid.crop.biddingEndTime).getTime() <= now;
                        const canPay = bid.status === 'ACCEPTED';

                        return (
                            <div key={bid.id} className="card stat-card-hover animate-fade" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '1.5rem',
                                borderRadius: '24px',
                                border: bid.status === 'ACCEPTED' ? '2px solid var(--primary-green)' : 'none',
                                background: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '100px',
                                        fontSize: '0.7rem',
                                        fontWeight: '800',
                                        background: bid.status === 'ACCEPTED' ? '#f0fdf4' : bid.status === 'REJECTED' ? '#fef2f2' : '#eff6ff',
                                        color: bid.status === 'ACCEPTED' ? '#166534' : bid.status === 'REJECTED' ? '#991b1b' : '#1e40af',
                                        textTransform: 'uppercase'
                                    }}>
                                        {bid.status}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isEnded ? '#64748b' : '#ef4444', fontSize: '0.8rem', fontWeight: '700' }}>
                                        <Clock size={14} />
                                        <span>{isEnded ? (t('auction_closed') || 'Closed') : (t('auction_live') || 'Auction Live')}</span>
                                    </div>
                                </div>

                                <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#1e293b' }}>{bid.crop.name}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                                    <Calendar size={14} /> {new Date(bid.createdAt).toLocaleDateString()}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{t('qty_kg') || 'Qty'}</div>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1e293b' }}>{bid.quantity} kg</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{t('your_price') || 'Your Price'}</div>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary-green)' }}>₹{bid.pricePerKg}/kg</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '700', color: '#1e293b' }}>{t('amount_column') || 'Total Amount'}</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1e293b' }}>₹{(bid.quantity * bid.pricePerKg).toLocaleString()}</span>
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    {canPay ? (
                                        <button
                                            onClick={() => handleCompletePayment(bid.id)}
                                            className="btn-primary"
                                            disabled={paying === bid.id}
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                borderRadius: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                fontWeight: '800',
                                                opacity: paying === bid.id ? 0.7 : 1,
                                                cursor: paying === bid.id ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {paying === bid.id ? (
                                                <>
                                                    <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                                                    {t('processing') || 'Processing...'}
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag size={20} /> {t('complete_payment_btn') || 'Complete Payment'}
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontSize: '0.9rem', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                                            {bid.status === 'PENDING' ? (t('awaiting_payment') || 'Awaiting Action') : bid.status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
