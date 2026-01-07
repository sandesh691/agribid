'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminRegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'ADMIN',
        adminSecret: ''
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
                    router.push('/login?registered=success&type=admin');
                } else {
                    setError(data.error || 'Admin Registration failed');
                }
            } else {
                setError('Invalid server response.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a202c', padding: '2rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderTop: '4px solid #e53e3e' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#e53e3e' }}>🛡️ Admin Gateway</h2>
                <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem', fontSize: '0.9rem' }}>Restricted Developer Access Only</p>

                {error && <div style={{ background: '#fff5f5', color: '#c53030', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', border: '1px solid #feb2b2' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>Developer Authorization Key</label>
                        <input
                            type="password"
                            value={formData.adminSecret}
                            onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', outline: 'none' }}
                            placeholder="Required for admin role"
                            suppressHydrationWarning
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>Admin Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', outline: 'none' }}
                            suppressHydrationWarning
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>Secure Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', outline: 'none' }}
                            suppressHydrationWarning
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', background: '#e53e3e', borderColor: '#c53030' }} disabled={loading}>
                        {loading ? 'Authorizing...' : 'Initialize Admin Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
                    <Link href="/login" style={{ color: '#718096', textDecoration: 'underline' }}>Back to standard login</Link>
                </p>
            </div>
        </div>
    );
}
