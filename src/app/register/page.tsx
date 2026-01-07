'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/lib/toast-context';

function RegisterForm() {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role')?.toUpperCase() || 'FARMER';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: initialRole,
        businessName: '',
        gstId: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                if (res.ok) {
                    showToast('Registration successful! Please login.', 'success');
                    router.push('/login?registered=success');
                } else {
                    const msg = data.error || 'Registration failed';
                    setError(msg);
                    showToast(msg, 'error');
                }
            } else {
                const text = await res.text();
                console.error('Non-JSON response:', text.substring(0, 100));
                const msg = 'Server returned an invalid response. Please check logs.';
                setError(msg);
                showToast(msg, 'error');
            }
        } catch (err) {
            console.error('Registration fetch error:', err);
            const msg = 'An error occurred. Please try again.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <img src="/logo.png" alt="AgriBid Logo" style={{ width: '60px', height: '60px', margin: '0 auto', display: 'block', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} />
            </div>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-green)' }}>{t('join_agribid')}</h2>
            {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('i_am_a')}</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #cbd5e1', outline: 'none', background: 'white', color: 'black' }}
                        suppressHydrationWarning
                    >
                        <option value="FARMER">{t('farmer')}</option>
                        <option value="RETAILER">{t('retailers')}</option>
                    </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('email_address')}</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #cbd5e1', outline: 'none', background: 'white', color: 'black' }}
                        suppressHydrationWarning
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('password_label')}</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #cbd5e1', outline: 'none', background: 'white', color: 'black' }}
                        suppressHydrationWarning
                    />
                </div>

                {formData.role === 'RETAILER' && (
                    <>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('business_name')}</label>
                            <input
                                type="text"
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #cbd5e1', outline: 'none', background: 'white', color: 'black' }}
                                suppressHydrationWarning
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('gst_id')}</label>
                            <input
                                type="text"
                                value={formData.gstId}
                                onChange={(e) => setFormData({ ...formData, gstId: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #cbd5e1', outline: 'none', background: 'white', color: 'black' }}
                                suppressHydrationWarning
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem' }} disabled={loading} suppressHydrationWarning>
                    {loading ? t('registering') : t('complete_registration')}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {t('already_have_account')} <Link href="/login" style={{ color: 'var(--primary-green)', fontWeight: '600' }}>{t('login_here')}</Link>
            </p>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
            <Header />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <RegisterForm />
                </Suspense>
            </div>
        </div>
    );
}
