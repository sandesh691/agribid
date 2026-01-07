'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/lib/toast-context';
import { Search, Filter, Clock, Award, Building, ChevronRight, LayoutGrid, Info } from 'lucide-react';
import Link from 'next/link';

export default function RetailerMarketplace() {
    const { language, t } = useLanguage();
    const { showToast } = useToast();
    const [crops, setCrops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        grade: '',
        type: '',
        minTrust: 0
    });

    const [now, setNow] = useState(0);

    useEffect(() => {
        setNow(Date.now());
        const interval = setInterval(() => setNow(Date.now()), 10000); // Check every 10s for more responsive timers
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchCrops();
    }, [search, filters]);

    const fetchCrops = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                name: search,
                grade: filters.grade,
                type: filters.type
            });
            const res = await fetch(`/api/crops?${params}`);
            const data = await res.json();
            setCrops(data);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Breadcrumbs & Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <Link href="/retailer" style={{ color: 'inherit', textDecoration: 'none' }}>{t('sidebar_dashboard')}</Link>
                    <ChevronRight size={14} />
                    <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>{t('marketplace_title')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>
                            {t('marketplace_title')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                            {t('retailer_desc')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder={t('search_crop_hint')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '12px',
                                border: '2px solid #f1f5f9',
                                background: '#f8fafc',
                                transition: 'all 0.3s'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={filters.grade}
                                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                                style={{ padding: '0.85rem 2.5rem 0.85rem 1rem', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', appearance: 'none', fontWeight: '500' }}
                            >
                                <option value="">{t('all_grades')}</option>
                                <option value="A">{t('grade_a')}</option>
                                <option value="B">{t('grade_b')}</option>
                                <option value="C">{t('grade_c')}</option>
                            </select>
                            <ChevronRight size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', color: '#64748b' }} />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                style={{ padding: '0.85rem 2.5rem 0.85rem 1rem', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', appearance: 'none', fontWeight: '500' }}
                            >
                                <option value="">{t('all_bid_types')}</option>
                                <option value="BULK">{t('bulk_bids')}</option>
                                <option value="MINI">{t('mini_bids')}</option>
                            </select>
                            <ChevronRight size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', color: '#64748b' }} />
                        </div>

                        <button
                            onClick={fetchCrops}
                            className="btn-primary"
                            style={{ padding: '0 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Filter size={18} /> {t('apply_btn')}
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary-green)', borderRadius: '50%', margin: '0 auto 1.5rem auto' }}></div>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{t('loading_marketplace')}</p>
                </div>
            ) : crops.filter(c => new Date(c.biddingEndTime).getTime() > now).length === 0 ? (
                <div className="card animate-fade" style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌾</div>
                    <h2 style={{ marginBottom: '1rem' }}>{t('no_matching_crops')}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{t('adjust_filters')}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                    {crops.filter(crop => new Date(crop.biddingEndTime).getTime() > now).map(crop => {
                        const hasStarted = new Date(crop.biddingStartTime).getTime() <= now;
                        const isUpcoming = !hasStarted;
                        return (
                            <div key={crop.id} className="card stat-card-hover animate-fade" style={{ display: 'flex', flexDirection: 'column', opacity: isUpcoming ? 0.9 : 1, padding: '1.5rem', borderRadius: '24px', border: 'none', background: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '100px',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        background: crop.biddingType === 'BULK' ? '#eff6ff' : '#f0fdf4',
                                        color: crop.biddingType === 'BULK' ? '#1e40af' : '#166534',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}>
                                        <LayoutGrid size={14} /> {crop.biddingType}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isUpcoming ? '#f59e0b' : '#ef4444', fontSize: '0.85rem', fontWeight: '700' }}>
                                        <Clock size={16} />
                                        <span>
                                            {isUpcoming ? t('starts_in') : t('ends_in_label')}: {formatSimpleTimeRemaining(isUpcoming ? crop.biddingStartTime : crop.biddingEndTime, language)}
                                        </span>
                                    </div>
                                </div>

                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>{crop.name}</h2>

                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('quality_grade_label')}</span>
                                        <span style={{ fontWeight: '800', color: 'var(--primary-green)', fontSize: '1.1rem' }}>{crop.qualityGrade}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('total_quantity_label')}</span>
                                        <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.1rem' }}>{crop.availableQuantity} kg</span>
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{t('min_price_label_short')}:</span>
                                        <span style={{ fontWeight: 'bold' }}>₹{crop.minPrice}/kg</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-green)' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{t('current_highest')}:</span>
                                        <span style={{ fontWeight: '900', fontSize: '1.25rem' }}>₹{crop.bids?.[0]?.pricePerKg || crop.minPrice}/kg</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>👨‍🌾</div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#166534' }}>{t('farmer_trust_score')}</div>
                                        <div style={{ color: 'var(--primary-green)', fontSize: '0.9rem', fontWeight: '800' }}>{crop.farmer.user.trustScore}% {t('verified_label')}</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    {isUpcoming ? (
                                        <div style={{ textAlign: 'center', padding: '1.25rem', background: '#f1f5f9', borderRadius: '14px', color: '#475569', fontSize: '1rem', fontWeight: '700', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                            <Clock size={20} /> {t('bidding_starts_at')} {new Date(crop.biddingStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    ) : (
                                        <BidForm crop={crop} onBidSuccess={fetchCrops} t={t} showToast={showToast} />
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

function BidForm({ crop, onBidSuccess, t, showToast }: { crop: any, onBidSuccess: () => void, t: any, showToast: any }) {
    const [quantity, setQuantity] = useState(crop.biddingType === 'BULK' ? crop.availableQuantity : 1);
    const [price, setPrice] = useState(crop.minPrice + 1);
    const [loading, setLoading] = useState(false);

    const placeBid = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cropId: crop.id,
                    quantity: Number(quantity),
                    pricePerKg: Number(price)
                })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(t('bid_success'), 'success');
                onBidSuccess();
            } else {
                showToast(data.error || 'Failed', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', paddingLeft: '0.25rem' }}>{t('qty_kg')}</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        disabled={crop.biddingType === 'BULK'}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '2px solid #f1f5f9', background: crop.biddingType === 'BULK' ? '#f1f5f9' : 'white', fontWeight: '800' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', paddingLeft: '0.25rem' }}>{t('price_per_kg')}</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '2px solid #f1f5f9', fontWeight: '800' }}
                    />
                </div>
            </div>
            <button
                onClick={placeBid}
                className="btn-primary"
                style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: '800', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' }}
                disabled={loading}
            >
                {loading ? t('placing_bid') : t('place_bid_btn')}
            </button>
        </div>
    );
}

// Helper to format remaining time nicely
function formatSimpleTimeRemaining(date: string | Date, lang: string) {
    const target = new Date(date).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) return '0h 0m';

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);

    if (lang === 'hi') return `${h}घं ${m}मि`;
    if (lang === 'kn') return `${h}ಗಂ ${m}ನಿ`;
    return `${h}h ${m}m`;
}
