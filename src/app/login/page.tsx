'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/lib/toast-context';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();
    const { showToast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast(t('welcome_back'), 'success');
                if (data.user.role === 'FARMER') router.push('/farmer');
                else if (data.user.role === 'RETAILER') router.push('/retailer');
                else if (data.user.role === 'ADMIN') router.push('/admin');
            } else {
                const msg = data.error || 'Login failed';
                setError(msg);
                showToast(msg, 'error');
            }
        } catch (err) {
            const msg = 'An error occurred. Please try again.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
            <Header />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <img src="/logo.png" alt="AgriBid Logo" style={{ width: '60px', height: '60px', margin: '0 auto', display: 'block', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} />
                    </div>
                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-green)' }}>{t('welcome_back')}</h2>
                    {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('email_address')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                                placeholder="e.g. kisan@example.com"
                                suppressHydrationWarning
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('password_label')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                                placeholder="••••••••"
                                suppressHydrationWarning
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem' }} disabled={loading} suppressHydrationWarning>
                            {loading ? t('logging_in') : t('login')}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {t('dont_have_account')} <Link href="/register" style={{ color: 'var(--primary-green)', fontWeight: '600' }}>{t('register_here')}</Link>
                    </p>
                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', textAlign: 'center' }}>
                        <Link href="/admin-setup" style={{ fontSize: '0.8rem', color: '#999', textDecoration: 'none' }}>🛡️ Admin Portal</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
