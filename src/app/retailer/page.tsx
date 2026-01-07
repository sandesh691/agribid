'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { TrendingUp, Award, DollarSign, ArrowUpRight, ShoppingCart, Activity, Bell, Clock } from 'lucide-react';

interface MonthlyData {
    month: string;
    amount: number;
}

export default function RetailerDashboard() {
    const { language, t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/retailer/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) {
            console.error('Fetch dashboard data error:', err);
        } finally {
            setTimeout(() => setLoading(false), 800);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>{language === 'hi' ? 'रिटेलर डैशबोर्ड लोड हो रहा है...' : (language === 'kn' ? 'ಚಿಲ್ಲರೆ ಮಾರಾಟಗಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading Retailer Dashboard...')}</div>;

    const totalSpent = stats?.totalSpent || 0;
    const successfulBidsCount = stats?.successfulBidsCount || 0;
    const activeBidsCount = stats?.activeBidsCount || 0;
    const monthlyData = stats?.monthlySpending || [];
    const recentTransactions = stats?.transactions || [];
    const recentBids = stats?.bids || [];

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontWeight: '800', color: 'var(--primary-green)', marginBottom: '0.25rem' }}>
                        {t('welcome_retailer')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                        {t('retailer_desc_perf')}
                    </p>
                </div>
                <Link href="/retailer/marketplace" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', width: 'auto' }}>
                    <ShoppingCart size={20} /> <span>{t('browse_marketplace')}</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card stat-card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--primary-green)' }}>
                        <DollarSign size={80} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('total_spent')}</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: 'var(--primary-green)' }}>₹{totalSpent.toLocaleString()}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <ArrowUpRight size={16} /> +5.2%
                    </div>
                </div>

                <div className="card stat-card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#f59e0b' }}>
                        <Award size={80} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('successful_bids')}</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{successfulBidsCount}</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{language === 'hi' ? 'पुष्टि किए गए ऑर्डर' : (language === 'kn' ? 'ಖಚಿತಪಡಿಸಿದ ಆರ್ಡರ್‌ಗಳು' : 'Confirmed orders')}</p>
                </div>

                <div className="card stat-card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#d97706' }}>
                        <Clock size={80} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('active_bids_count')}</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#b45309' }}>{activeBidsCount}</h2>
                    <p style={{ fontSize: '0.8rem', color: '#92400e' }}>{language === 'hi' ? 'लाइव नीलामियों में' : (language === 'kn' ? 'ಲೈವ್ ಹರಾಜಿನಲ್ಲಿ' : 'In live auctions')}</p>
                </div>

                <div className="card stat-card-hover" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, white 0%, #f0fdf4 100%)' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#10b981' }}>
                        <Activity size={80} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('wallet_balance')}</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#059669' }}>₹{(stats?.walletBalance || 0).toLocaleString()}</h2>
                    <Link href="/retailer/wallet" style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 'bold', textDecoration: 'none' }}>{t('recharge')} →</Link>
                </div>
            </div>

            <style jsx>{`
                .responsive-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                }
                @media (max-width: 992px) {
                    .responsive-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* Charts and Insights */}
            <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={20} color="var(--primary-green)" /> {t('spending_trend')}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{language === 'hi' ? 'पिछले 6 महीने' : (language === 'kn' ? 'ಕಳೆದ 6 ತಿಂಗಳು' : 'Last 6 Months Data')}</div>
                    </div>

                    <div style={{ height: '300px', width: '100%', position: 'relative', padding: '20px 0' }}>
                        {monthlyData.length > 0 ? (
                            <FrequencyPolygonChart data={monthlyData} />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                {language === 'hi' ? 'चार्ट के लिए कोई खर्च डेटा उपलब्ध नहीं है।' : (language === 'kn' ? 'ವೆಚ್ಚದ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ.' : 'No spending data available for chart.')}
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ background: '#1e293b', color: 'white' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>{t('market_trends')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📈</div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{language === 'hi' ? 'आलू की कीमतें बढ़ रही हैं' : (language === 'kn' ? 'ಆಲೂಗಡ್ಡೆ ಬೆಲೆ ಏರಿಕೆ' : 'Potato Prices Rising')}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{language === 'hi' ? 'अगले हफ्ते +10% की उम्मीद' : (language === 'kn' ? 'ಮುಂದಿನ ವಾರ +10% ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ' : 'Expected +10% next week')}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🚛</div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{language === 'hi' ? 'नया रशद क्षेत्र' : (language === 'kn' ? 'ಹೊಸ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಪ್ರದೇಶ' : 'New Logistics Region')}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{language === 'hi' ? 'महाराष्ट्र की इकाइयां लाइव हैं' : (language === 'kn' ? 'ಮಹಾರಾಷ್ಟ್ರ ಘಟಕಗಳು ಲೈವ್ ಆಗಿವೆ' : 'Maharashtra units live')}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏆</div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{language === 'hi' ? 'शीर्ष फसल: प्याज' : (language === 'kn' ? 'ಟಾಪ್ ಬೆಳೆ: ಈರುಳ್ಳಿ' : 'Top Crop: Onion')}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{language === 'hi' ? 'आज सबसे अधिक व्यापार हुआ' : (language === 'kn' ? 'ಇಂದು ಹೆಚ್ಚು ವ್ಯಾಪಾರವಾಗಿದೆ' : 'Most traded today')}</div>
                            </div>
                        </div>
                    </div>
                    <Link href="/retailer/marketplace" style={{ display: 'block', marginTop: '2rem', textAlign: 'center', background: 'var(--primary-green)', color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'none' }}>
                        {t('shop_harvest')}
                    </Link>
                </div>
            </div>

            {/* Recent Bid Sections */}
            <div className="responsive-grid">
                <div>
                    <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>{t('successful_bids')}</h2>
                        <Link href="/retailer/history" style={{ fontSize: '0.85rem', color: 'var(--primary-green)', fontWeight: 'bold' }}>{language === 'hi' ? 'सभी देखें' : (language === 'kn' ? 'ಎಲ್ಲಾ ನೋಡಿ' : 'View All')} →</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((tx: any) => (
                                <div key={tx.id} className="card hover-shadow" style={{ padding: '1rem', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{tx.crop.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {tx.quantityPurchased}kg @ ₹{tx.pricePerKg}/kg
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--primary-green)' }}>₹{tx.totalAmount.toLocaleString()}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(tx.timestamp).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                {language === 'hi' ? 'अभी तक कोई सफल बोली नहीं।' : (language === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಯಶಸ್ವಿ ಬಿಡ್‌ಗಳಿಲ್ಲ.' : 'No successful bids yet.')}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>{t('bidding_details')}</h2>
                        <Link href="/retailer/active-bids" style={{ fontSize: '0.85rem', color: 'var(--primary-green)', fontWeight: 'bold' }}>{language === 'hi' ? 'सभी देखें' : (language === 'kn' ? 'ಎಲ್ಲಾ ನೋಡಿ' : 'View All')} →</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentBids.length > 0 ? (
                            recentBids.map((bid: any) => (
                                <div key={bid.id} className="card hover-shadow" style={{ padding: '1rem', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{bid.crop.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                Bid: ₹{bid.pricePerKg}/kg | Status: <span style={{ color: bid.status === 'ACCEPTED' ? 'var(--primary-green)' : (bid.status === 'REJECTED' ? '#ef4444' : '#f59e0b') }}>{bid.status}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span className="badge" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>{bid.crop.biddingType}</span>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{new Date(bid.timestamp).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                {language === 'hi' ? 'कोई सक्रिय बोली नहीं मिली।' : (language === 'kn' ? 'ಯಾವುದೇ ಸಕ್ರಿಯ ಬಿಡ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' : 'No active bids found.')}
                            </div>
                        )}
                    </div>
                </div>
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

    // Calculate points
    const points = data.map((d, i) => {
        const x = paddingX + (i * ((width - paddingX * 2) / (data.length - 1 || 1)));
        const y = height - paddingY - (d.amount / maxAmount * (height - paddingY * 2));
        return { x, y, ...d };
    });

    // Generate smooth curve using cubic bezier
    // Simple smoothing: use midpoints
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
        <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: '100%' }}
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="gradient-retailer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-green)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--primary-green)" stopOpacity="0.01" />
                </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <line
                    key={i}
                    x1={paddingX}
                    y1={height - paddingY - (p * (height - paddingY * 2))}
                    x2={width - paddingX}
                    y2={height - paddingY - (p * (height - paddingY * 2))}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                />
            ))}

            {/* X-Axis labels */}
            {points.map((p, i) => (
                <text
                    key={i}
                    x={p.x}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#64748b"
                    fontWeight="500"
                >
                    {p.month}
                </text>
            ))}

            {/* The Area */}
            <path
                d={areaPath}
                fill="url(#gradient-retailer)"
            />

            {/* The Line */}
            <path
                d={pathData}
                fill="none"
                stroke="var(--primary-green)"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* Data Points */}
            {points.map((p, i) => (
                <g key={i}>
                    <circle
                        cx={p.x}
                        cy={p.y}
                        r="6"
                        fill="white"
                        stroke="var(--primary-green)"
                        strokeWidth="3"
                        style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}
                    />
                    <text
                        x={p.x}
                        y={p.y - 15}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="var(--primary-green)"
                    >
                        ₹{p.amount >= 1000 ? (p.amount / 1000).toFixed(1) + 'k' : p.amount}
                    </text>
                </g>
            ))}
        </svg>
    );
}
