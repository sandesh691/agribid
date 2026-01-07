'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { LanguageToggle } from '@/components/language-toggle';
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    TrendingUp,
    Wallet,
    HelpCircle,
    Home,
    LogOut
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function FarmerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = useLanguage();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: '/farmer', label: t('sidebar_dashboard'), icon: <LayoutDashboard size={20} /> },
        { href: '/farmer/crops', label: t('sidebar_my_listings'), icon: <Package size={20} /> },
        { href: '/farmer/crops/add', label: t('sidebar_add_crop'), icon: <PlusCircle size={20} /> },
        { href: '/farmer/income', label: t('sidebar_income'), icon: <TrendingUp size={20} /> },
        { href: '/farmer/wallet', label: t('sidebar_wallet'), icon: <Wallet size={20} /> },
        { href: '/farmer/reports', label: t('sidebar_reports'), icon: <HelpCircle size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar - Desktop Only */}
            <aside className="desktop-only" style={{
                width: '280px',
                background: 'white',
                borderRight: '1px solid #e2e8f0',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <Link href="/" style={{
                    color: 'var(--primary-green)',
                    marginBottom: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textDecoration: 'none',
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    letterSpacing: '-0.5px'
                }}>
                    <img src="/logo.png" alt="AgriBid Logo" style={{ width: '36px', height: '36px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(21,128,61,0.2)' }} />
                    AgriBid
                </Link>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                        >
                            <span style={{ color: isActive(item.href) ? 'var(--primary-green)' : '#94a3b8' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <Link href="/" className="sidebar-link">
                        <Home size={20} /> {t('sidebar_back_home')}
                    </Link>
                    <form action="/api/auth/logout" method="POST">
                        <button type="submit" className="sidebar-link" style={{
                            width: '100%',
                            color: '#ef4444',
                            background: 'transparent',
                            border: 'none',
                            fontWeight: '700',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}>
                            <LogOut size={20} /> {t('sidebar_logout')}
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-flex glass" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70px',
                background: 'white',
                borderTop: '1px solid #e2e8f0',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 1000,
                padding: '0 0.5rem'
            }}>
                {/* Dashboard, Listings, Add, Income, Wallet */}
                {[navItems[0], navItems[1], navItems[2], navItems[4]].map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: isActive(item.href) ? 'var(--primary-green)' : '#94a3b8',
                            textDecoration: 'none',
                            fontSize: '0.65rem',
                            fontWeight: isActive(item.href) ? '800' : '600',
                            flex: 1
                        }}
                    >
                        {item.icon}
                        <span>{item.label.split(' ')[0]}</span>
                    </Link>
                ))}
            </nav>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '1rem', paddingBottom: '80px', minWidth: 0 }}>
                <header style={{
                    marginBottom: '1.5rem',
                    background: 'white',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    position: 'sticky',
                    top: '1rem',
                    zIndex: 900
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        {/* Left: Home Icon (Mobile Only) */}
                        <Link href="/" className="mobile-only" style={{
                            color: 'var(--primary-green)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            background: '#f0fdf4',
                            borderRadius: '12px'
                        }}>
                            <Home size={20} />
                        </Link>

                        {/* Center: Title (Auto-scaling on mobile) */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{
                                fontSize: '1.1rem',
                                fontWeight: '800',
                                color: '#1e293b',
                                margin: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }} className="desktop-only-text">
                                {t('farmer_dashboard_header')}
                            </h1>
                            <h1 style={{
                                fontSize: '0.85rem',
                                fontWeight: '900',
                                color: '#1e293b',
                                margin: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'center'
                            }} className="mobile-only-text">
                                {t('farmer_dashboard_header')}
                            </h1>
                        </div>

                        {/* Right: Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LanguageToggle />
                            <form action="/api/auth/logout" method="POST" className="mobile-only" style={{ margin: 0 }}>
                                <button type="submit" style={{
                                    background: '#fef2f2',
                                    border: 'none',
                                    color: '#ef4444',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>
                                    <LogOut size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </header>

                <style jsx>{`
                    @media (min-width: 769px) {
                        .mobile-only-text { display: none; }
                    }
                    @media (max-width: 768px) {
                        .desktop-only-text { display: none; }
                    }
                `}</style>

                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
