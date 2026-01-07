'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { TrendingUp, Award, DollarSign, ArrowUpRight, Plus, Activity, Bell } from 'lucide-react';

interface MonthlyData {
    month: string;
    amount: number;
}

export default function FarmerDashboard() {
    const { language, t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [incomeRes, notifRes] = await Promise.all([
                fetch('/api/farmer/income'),
                fetch('/api/notifications')
            ]);

            if (incomeRes.ok) setStats(await incomeRes.json());
            if (notifRes.ok) setNotifications(await notifRes.json());

        } catch (err) {
            console.error('Fetch dashboard data error:', err);
        } finally {
            setTimeout(() => setLoading(false), 800);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                body: JSON.stringify({ id })
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Mark as read error:', err);
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary-green)', fontWeight: 'bold' }}>
            {language === 'hi' ? 'डैशबोर्ड लोड हो रहा है...' : (language === 'kn' ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading Dashboard...')}
        </div>
    );

    const totalEarnings = stats?.totalEarnings || 0;
    const successfulBids = stats?.transactions?.length || 0;
    const extraEarnings = Math.round(totalEarnings * 0.18);
    const monthlyData = stats?.monthlyEarnings || [];

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontWeight: '800', color: 'var(--primary-green)', marginBottom: '0.25rem' }}>
                        {t('namaste_farmer')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                        {t('farm_performance')}
                    </p>
                </div>
                <Link href="/farmer/crops/add" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', width: 'auto' }}>
                    <Plus size={20} /> <span className="desktop-only">{t('list_new_crop')}</span><span className="mobile-only">{t('list_crop_btn')}</span>
                </Link>
            </div>

            {/* Notifications Section */}
            {notifications.length > 0 && notifications.some(n => !n.read) && (
                <div style={{ marginBottom: '2.5rem' }}>
                    <div className="card stat-card-hover" style={{ borderLeft: '6px solid #fbbf24', background: '#fffbeb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#92400e' }}>
                                <Bell size={24} /> {t('important_updates')}
                            </h3>
                            <Link href="/farmer/crops" style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 'bold' }}>{t('view_all_listings')} →</Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            {notifications.filter(n => !n.read).slice(0, 3).map(notif => (
                                <Link
                                    href={notif.link || "/farmer/crops"}
                                    key={notif.id}
                                    onClick={() => markAsRead(notif.id)}
                                    className="hover-shadow"
                                    style={{
                                        padding: '1.25rem',
                                        borderRadius: '12px',
                                        background: 'white',
                                        border: '1px solid #fef3c7',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        display: 'block',
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '0.25rem' }}>{notif.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{notif.message}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary-green)' }}>{t('view_details')} →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card stat-card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--primary-green)' }}>
                        <DollarSign size={80} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('total_earnings')}</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: 'var(--primary-green)' }}>₹{totalEarnings.toLocaleString()}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <ArrowUpRight size={16} /> +12.5%
                    </div>
                </div>

                <div className="card stat-card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#f59e0b' }}>
                        <Award size={80} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('successful_bids')}</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{successfulBids}</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('from_listings')}</p>
                </div>

                <div className="card stat-card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#10b981' }}>
                        <TrendingUp size={80} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('extra_earning')}</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#059669' }}>₹{extraEarnings.toLocaleString()}</h2>
                    <p style={{ fontSize: '0.8rem', color: '#059669' }}>{t('above_market_avg')}</p>
                </div>

                <div className="card stat-card-hover" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, white 0%, #f0fdf4 100%)' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#10b981' }}>
                        <Activity size={80} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('current_balance')}</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: 'var(--primary-green)' }}>₹{(stats?.walletBalance || 0).toLocaleString()}</h2>
                    <Link href="/farmer/wallet" style={{ fontSize: '0.8rem', color: 'var(--primary-green)', fontWeight: 'bold', textDecoration: 'none' }}>{t('withdraw')} →</Link>
                </div>
            </div>

            {/* Charts and Market Demands */}
            <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={20} color="var(--primary-green)" /> {t('monthly_revenue')}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('last_6_months')}</div>
                    </div>
                    <div style={{ height: '250px', width: '100%', position: 'relative' }}>
                        {monthlyData.length > 0 ? (
                            <FrequencyPolygonChart data={monthlyData} />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                {t('no_earnings_data')}
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ background: 'var(--primary-green)', color: 'white' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>{t('market_demands')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🧅</div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{language === 'hi' ? 'प्याज (A-ग्रेड)' : (language === 'kn' ? 'ಈರುಳ್ಳಿ (A-ಗ್ರೇಡ್)' : 'Onion (A-Grade)')}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{language === 'hi' ? 'बेंगलुरु में भारी मांग' : (language === 'kn' ? 'ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ' : 'High Demand in Bangalore')}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌾</div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{language === 'hi' ? 'सोना मसूरी चावल' : (language === 'kn' ? 'ಸೋನಾ ಮಸೂರಿ ಅಕ್ಕಿ' : 'Sona Masuri Rice')}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{language === 'hi' ? 'थोक खरीदार जल्द आ रहे हैं' : (language === 'kn' ? 'ಬೃಹತ್ ಖರೀದಿದಾರರು ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದ್ದಾರೆ' : 'Bulk buyers entering soon')}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌶️</div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{language === 'hi' ? 'लाल मिर्च' : (language === 'kn' ? 'ಒಣ ಮೆಣಸಿನಕಾಯಿ' : 'Red Chilli')}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{language === 'hi' ? 'मूल्य वृद्धि +15%' : (language === 'kn' ? 'ಬೆಲೆ ಹೆಚ್ಚಳ +15%' : 'Price trend up +15%')}</div>
                            </div>
                        </div>
                    </div>
                    <Link href="/farmer/market" style={{ display: 'block', marginTop: '2rem', textAlign: 'center', background: 'white', color: 'var(--primary-green)', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'none' }}>
                        {t('explore_full_market')}
                    </Link>
                </div>
            </div>

            {/* Recommended Crops Section */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('recommended_crops')}</h2>
                <Link href="/farmer/crops/add" style={{ fontSize: '0.9rem', color: 'var(--primary-green)', fontWeight: 'bold' }}>{t('list_new_crop')} →</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {[
                    { emoji: '🍅', type: 'Tomato', hi: 'टमाटर', kn: 'ಟೊಮೆಟೊ', price: '₹45/kg' },
                    { emoji: '🥔', type: 'Potato', hi: 'आलू', kn: 'ಆಲೂಗಡ್ಡೆ', price: '₹22/kg' },
                    { emoji: '🥬', type: 'Cabbage', hi: 'पत्ता गोभी', kn: 'ಕೋಸುಗಡ್ಡೆ', price: '₹30/kg' }
                ].map((crop, idx) => (
                    <div key={idx} className="card hover-shadow" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{crop.emoji}</div>
                        <h3 style={{ marginBottom: '0.5rem', fontWeight: '800' }}>{language === 'hi' ? crop.hi : (language === 'kn' ? crop.kn : crop.type)}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            {t('market_avg_label')}: {crop.price}
                        </p>
                        <Link href={`/farmer/crops/add?type=${crop.type}`} className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem' }}>
                            {t('start_list_btn')}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FrequencyPolygonChart({ data }: { data: MonthlyData[] }) {
    const width = 800;
    const height = 250;
    const paddingX = 60;
    const paddingY = 40;

    const maxAmount = Math.max(...data.map(d => d.amount), 1000) * 1.2;

    const points = data.map((d, i) => {
        const x = paddingX + (i * ((width - paddingX * 2) / (data.length - 1 || 1)));
        const y = height - paddingY - (d.amount / maxAmount * (height - paddingY * 2));
        return { x, y, ...d };
    });

    const generatePath = (pts: any[]) => {
        if (pts.length === 0) return '';
        if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
        return pts.reduce((acc, point, i, a) => {
            if (i === 0) return `M ${point.x} ${point.y}`;
            const prev = a[i - 1];
            const cx = (prev.x + point.x) / 2;
            return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
        }, '');
    };

    const pathData = generatePath(points);
    const areaPath = `${pathData} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
            <defs>
                <linearGradient id="gradient-farmer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-green)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--primary-green)" stopOpacity="0.01" />
                </linearGradient>
            </defs>
            {points.map((p, i) => (
                <text key={i} x={p.x} y={height - 10} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="500">{p.month}</text>
            ))}
            <path d={areaPath} fill="url(#gradient-farmer)" />
            <path d={pathData} fill="none" stroke="var(--primary-green)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="5" fill="white" stroke="var(--primary-green)" strokeWidth="3" />
            ))}
        </svg>
    );
}
