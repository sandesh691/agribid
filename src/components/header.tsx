'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { LanguageToggle } from './language-toggle';
import { User, LayoutDashboard, LogOut } from 'lucide-react';

export function Header() {
    const { t } = useLanguage();
    const [user, setUser] = useState<{ email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.authenticated) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Failed to fetch user', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'FARMER': return '/farmer';
            case 'RETAILER': return '/retailer';
            case 'ADMIN': return '/admin';
            default: return '/';
        }
    };

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0.75rem 0' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                {/* Left Side: Logo & Name */}
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="AgriBid Logo" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
                    <span style={{ letterSpacing: '-0.03em' }} className="desktop-only">AgriBid</span>
                </Link>

                {/* Center-Left: Navigation Links - Hidden on Mobile */}
                <nav className="desktop-only" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link href="/about" className="nav-link">{t('about_us')}</Link>
                    <Link href="/terms" className="nav-link">{t('terms_conditions')}</Link>
                    <Link href="/privacy" className="nav-link">{t('privacy_policy')}</Link>
                </nav>

                {/* Right Side: Auth & Language */}
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexShrink: 0 }}>
                    {mounted && !loading && (
                        user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    fontSize: '0.7rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <span style={{ fontWeight: '800', color: 'var(--primary-green)', textTransform: 'uppercase' }}>{t(user.role.toLowerCase()) || user.role}</span>
                                    <span className="desktop-only" style={{ opacity: 0.8 }}>{user.email}</span>
                                </div>
                                <Link href={getDashboardLink()} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', width: 'auto', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <LayoutDashboard size={14} /> <span className="desktop-only">{t('sidebar_dashboard')}</span>
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                                <Link href="/login" className="btn-outline" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', width: 'auto', minWidth: 'fit-content' }}>{t('login')}</Link>
                                <Link href="/register" className="btn-primary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', width: 'auto', minWidth: 'fit-content' }}>{t('register')}</Link>
                            </div>
                        )
                    )}

                    <div className="desktop-only" style={{ height: '24px', width: '1px', background: '#e2e8f0', margin: '0 0.1rem' }} />
                    <LanguageToggle />
                </div>
            </div>
        </nav>
    );
}
