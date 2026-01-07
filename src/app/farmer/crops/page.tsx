'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { formatTimeRemaining } from '@/lib/utils';
import { Search, Filter, Plus, Package, Clock, CheckCircle, ChevronRight } from 'lucide-react';

export default function MyCropsPage() {
    const { language, t } = useLanguage();
    const [crops, setCrops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'CLOSED'>('ALL');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'BULK' | 'MINI'>('ALL');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchMyCrops();
    }, []);

    const fetchMyCrops = async () => {
        try {
            const res = await fetch('/api/crops?mine=true');
            if (res.ok) {
                const data = await res.json();
                setCrops(data);
            }
        } catch (err) {
            console.error('Fetch crops error:', err);
        } finally {
            setLoading(false);
        }
    };

    const processedCrops = crops
        .filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || c.biddingStatus === statusFilter;
            const matchesType = typeFilter === 'ALL' || c.biddingType === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        })
        .sort((a, b) => {
            const now = new Date();
            const aActive = a.biddingStatus === 'ACTIVE' && new Date(a.biddingEndTime) > now;
            const bActive = b.biddingStatus === 'ACTIVE' && new Date(b.biddingEndTime) > now;

            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;

            const aTime = a.bids?.[0]?.createdAt || a.createdAt;
            const bTime = b.bids?.[0]?.createdAt || b.createdAt;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
        });

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>{t('sidebar_my_listings')}</h1>
                    <p style={{ color: '#64748b' }}>{language === 'hi' ? 'अपनी सक्रिय और पिछली फसल नीलामियों को प्रबंधित करें।' : (language === 'kn' ? 'ನಿಮ್ಮ ಸಕ್ರಿಯ ಮತ್ತು ಹಳೆಯ ಹರಾಜುಗಳನ್ನು ನಿರ್ವಹಿಸಿ.' : 'Manage and track your active and past crop auctions.')}</p>
                </div>
                <Link href="/farmer/crops/add" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '12px' }}>
                    <Plus size={20} /> {t('sidebar_add_crop')}
                </Link>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '1rem', background: 'white' }}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <button
                        className={`btn-outline ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 1.5rem', borderRadius: '14px', background: 'white', fontWeight: 'bold' }}
                    >
                        <Filter size={20} /> {statusFilter !== 'ALL' || typeFilter !== 'ALL' ? t('filter_active') : t('filters')}
                    </button>

                    {showFilters && (
                        <div className="card shadow" style={{ position: 'absolute', top: '110%', right: 0, zIndex: 100, width: '280px', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.75rem', color: '#1e293b' }}>{t('bidding_status_label')}</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as any)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                >
                                    <option value="ALL">{t('all_status')}</option>
                                    <option value="ACTIVE">{t('active_bidding')}</option>
                                    <option value="CLOSED">{t('closed_finished')}</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.75rem', color: '#1e293b' }}>{t('bidding_type_label')}</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value as any)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                >
                                    <option value="ALL">{t('all_types')}</option>
                                    <option value="BULK">{t('bulk_bidding')}</option>
                                    <option value="MINI">{t('mini_bidding')}</option>
                                </select>
                            </div>
                            <button className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px' }} onClick={() => setShowFilters(false)}>{t('apply_btn')}</button>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner" style={{ marginBottom: '1rem' }}></div>
                    <p style={{ color: '#64748b' }}>{t('loading_listings')}</p>
                </div>
            ) : processedCrops.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', borderRadius: '24px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📦</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('no_crops_found')}</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>{t('no_match_filters')}</p>
                    <Link href="/farmer/crops/add" className="btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '12px' }}>{t('create_listing_btn')}</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    {processedCrops.map(crop => {
                        const hasActiveBidding = crop.biddingStatus === 'ACTIVE' && new Date(crop.biddingEndTime) > new Date();
                        return (
                            <div
                                key={crop.id}
                                className="card hover-shadow"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.5rem 2rem',
                                    borderRadius: '20px',
                                    border: hasActiveBidding ? '2px solid var(--primary-green)' : '1px solid #e2e8f0',
                                    boxShadow: hasActiveBidding ? '0 8px 16px -4px rgba(21, 128, 61, 0.15)' : 'none',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {hasActiveBidding && (
                                    <div style={{ position: 'absolute', top: 0, left: '30px', background: 'var(--primary-green)', color: 'white', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '0 0 8px 8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        {t('live_activity')}
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
                                    <div style={{ width: '70px', height: '70px', borderRadius: '18px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid #dcfce7', boxShadow: 'inset 0 2px 4px rgba(21, 128, 61, 0.05)' }}>
                                        {crop.name.toLowerCase().includes('onion') ? '🧅' : crop.name.toLowerCase().includes('tomato') ? '🍅' : '🌾'}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{crop.name}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                                            <span style={{
                                                background: crop.biddingType === 'BULK' ? '#e0f2fe' : '#f1f5f9',
                                                color: crop.biddingType === 'BULK' ? '#0369a1' : '#475569',
                                                padding: '3px 10px',
                                                borderRadius: '6px',
                                                fontWeight: '800',
                                                fontSize: '0.75rem'
                                            }}>
                                                {crop.biddingType}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <strong>{crop.availableQuantity}</strong>/{crop.totalQuantity} {t('kg_available')}
                                            </span>
                                            {crop.biddingStatus === 'ACTIVE' && hasActiveBidding ? (
                                                <span style={{ color: '#ef4444', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <Clock size={14} /> {t('ends_in')} {formatTimeRemaining(crop.biddingEndTime)}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <CheckCircle size={14} /> {t('closed_finished').toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                            {crop.bids?.length > 0 ? t('current_high_bid') : t('starting_price')}
                                        </div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: hasActiveBidding ? 'var(--primary-green)' : '#1e293b', lineHeight: 1 }}>
                                            ₹{crop.bids?.[0]?.pricePerKg || crop.minPrice}<span style={{ fontSize: '0.9rem', fontWeight: '700', marginLeft: '2px' }}>/kg</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', marginTop: '0.5rem' }}>{crop.bids?.length || 0} {t('total_bids_label')}</div>
                                    </div>
                                    <Link
                                        href={`/farmer/crops/${crop.id}`}
                                        className={hasActiveBidding ? "btn-primary" : "btn-outline"}
                                        style={{
                                            fontSize: '0.9rem',
                                            padding: '0.8rem 1.75rem',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: hasActiveBidding ? '0 4px 12px rgba(21, 128, 61, 0.2)' : 'none'
                                        }}
                                    >
                                        {hasActiveBidding ? t('live_bids_btn') : t('manage_listing_btn')} <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
