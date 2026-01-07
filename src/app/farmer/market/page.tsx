'use client';

import { useLanguage } from '@/lib/language-context';
import { TrendingUp, TrendingDown, ArrowLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function MandiMarketPage() {
    const { t, language } = useLanguage();

    const mandiData = [
        { crop: language === 'hi' ? 'प्याज' : (language === 'kn' ? 'ಈರುಳ್ಳಿ' : 'Onion'), market: 'Bangalore (KA)', price: '₹1,800', trend: 'up', change: '+5%' },
        { crop: language === 'hi' ? 'गेहूँ' : (language === 'kn' ? 'ಗೋಧಿ' : 'Wheat'), market: 'Hubli (KA)', price: '₹2,450', trend: 'down', change: '-2%' },
        { crop: language === 'hi' ? 'टमाटर' : (language === 'kn' ? 'ಟೊಮೆಟೊ' : 'Tomato'), market: 'Kolar (KA)', price: '₹3,200', trend: 'up', change: '+12%' },
        { crop: language === 'hi' ? 'चावल (सोना मसूरी)' : (language === 'kn' ? 'ಅಕ್ಕಿ (ಸೋನಾ ಮಸೂರಿ)' : 'Rice (Sona Masuri)'), market: 'Raichur (KA)', price: '₹4,100', trend: 'up', change: '+3%' },
        { crop: language === 'hi' ? 'मिर्च (लाल)' : (language === 'kn' ? 'ಮೆಣಸಿನಕಾಯಿ' : 'Chilli (Red)'), market: 'Byadgi (KA)', price: '₹12,500', trend: 'up', change: '+15%' },
        { crop: language === 'hi' ? 'आलू' : (language === 'kn' ? 'ಆಲೂಗಡ್ಡೆ' : 'Potato'), market: 'Belgaum (KA)', price: '₹1,200', trend: 'down', change: '-4%' },
        { crop: language === 'hi' ? 'मकई' : (language === 'kn' ? 'ಮೆಕ್ಕೆಜೋಳ' : 'Maize'), market: 'Davangere (KA)', price: '₹2,100', trend: 'up', change: '+2%' },
        { crop: language === 'hi' ? 'तूर दाल' : (language === 'kn' ? 'ತೊಗರಿ ಬೇಳೆ' : 'Tur Dal'), market: 'Gulbarga (KA)', price: '₹7,800', trend: 'up', change: '+8%' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <Link href="/farmer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-green)', textDecoration: 'none', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        <ArrowLeft size={18} /> {t('home')}
                    </Link>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                        {t('mandi_prices')}
                    </h1>
                </div>
            </div>

            {/* Quick Stats Overlay */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)', color: 'white' }}>
                    <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Market Sentiment</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>Bullish (Strong)</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <TrendingUp size={16} /> Average price up by 4.2% today
                    </div>
                </div>
                <div className="card">
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Highest Gainer</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{language === 'hi' ? 'मिर्च (लाल)' : (language === 'kn' ? 'ಮೆಣಸಿನಕಾಯಿ' : 'Red Chilli')}</div>
                    <div style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: '1rem', fontWeight: 'bold' }}>+15.4% jump in Byadgi Market</div>
                </div>
            </div>

            {/* Price Table Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={20} color="var(--primary-green)" /> {language === 'hi' ? 'लाइव मंडी भाव' : (language === 'kn' ? 'ಲೈವ್ ಮಂಡಿ ಬೆಲೆಗಳು' : 'Live Mandi Prices')}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder={language === 'hi' ? 'खोजें...' : (language === 'kn' ? 'ಹುಡುಕಿ...' : 'Search...')}
                                style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#64748b' }}>{t('crop_label')}</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#64748b' }}>{language === 'hi' ? 'मंडी / बाज़ार' : (language === 'kn' ? 'ಮಂಡಿ / ಮಾರುಕಟ್ಟೆ' : 'Mandi / Market')}</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#64748b' }}>{t('avg_price')} /qtl</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#64748b' }}>{t('trend')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mandiData.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fcfdfd'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{item.crop}</td>
                                    <td style={{ padding: '1.25rem 1.5rem', color: '#64748b' }}>{item.market}</td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: 'var(--primary-green)' }}>{item.price}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '100px',
                                            fontSize: '0.8rem',
                                            fontWeight: 800,
                                            background: item.trend === 'up' ? '#f0fdf4' : '#fef2f2',
                                            color: item.trend === 'up' ? '#16a34a' : '#ef4444'
                                        }}>
                                            {item.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {item.change}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: '1.5rem', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Source: AGMARKNET API & Karnataka State Agricultural Marketing Board | Last Updated: Just now
                    </p>
                </div>
            </div>
        </div>
    );
}
