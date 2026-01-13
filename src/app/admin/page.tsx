'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/lib/toast-context';
import { useModal } from '@/lib/modal-context';

export default function AdminDashboard() {
    const { showToast } = useToast();
    const { showModal } = useModal();
    const [stats, setStats] = useState({
        users: 0,
        crops: 0,
        bids: 0,
        violations: 0
    });
    const [violations, setViolations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be a single admin stats endpoint
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Mocking stats for now as it requires complex joins/counts
            setStats({
                users: 154,
                crops: 42,
                bids: 312,
                violations: 5
            });
            // Mock violations
            setViolations([
                { id: 'v1', user: 'retailer_x@example.com', type: 'Cartel Bidding', description: 'Suspected price inflation with user retailer_y', timestamp: new Date() },
                { id: 'v2', user: 'farmer_z@example.com', type: 'Quality Mismatch', description: 'Repeated disputes on Grade A listings', timestamp: new Date() }
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = (id: string) => {
        showToast(`Opening detailed AI analysis for violation ${id}...`, 'info');
    };

    const handleSuspend = (id: string, user: string) => {
        showModal({
            title: 'Suspend User?',
            message: `Are you sure you want to suspend user ${user}? They will lose access to all AgriBid platform features immediately.`,
            type: 'confirm',
            confirmText: 'Yes, Suspend User',
            cancelText: 'Cancel',
            onConfirm: () => {
                setViolations(violations.filter(v => v.id !== id));
                showToast(`User ${user} has been suspended.`, 'success');
            }
        });
    };

    return (
        <div>
            <style jsx>{`
                .admin-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }
                .mobile-table-card {
                    display: none;
                }
                @media (max-width: 768px) {
                    .admin-stats-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                    }
                    .desktop-table {
                        display: none;
                    }
                    .mobile-table-card {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .v-card {
                        background: #f8fafc;
                        padding: 1rem;
                        border-radius: 12px;
                        border: 1px solid #e2e8f0;
                    }
                }
            `}</style>

            <div className="admin-stats-grid">
                <div className="card" style={{ borderTop: '4px solid #3498db' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Users</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.users}</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-green)' }}>12 New this week</p>
                </div>
                <div className="card" style={{ borderTop: '4px solid #2ecc71' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Market Volume</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>₹4.2L</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>Last 30 days</p>
                </div>
                <div className="card" style={{ borderTop: '4px solid #f1c40f' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Disputes</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>3</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e67e22' }}>Action required</p>
                </div>
                <div className="card" style={{ borderTop: '4px solid #e74c3c' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>AI Alerts</span>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#e74c3c' }}>{stats.violations}</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>2 Critical</p>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 800 }}>
                    <span style={{ color: '#e74c3c' }}>⚠️</span> System Integrity Violations
                </h3>

                <div className="desktop-table">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>User</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Violation Type</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Details</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {violations.map(v => (
                                <tr key={v.id}>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{v.user}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#ffdada', color: '#c0392b', fontSize: '0.75rem', fontWeight: '800' }}>{v.type}</span>
                                    </td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '0.85rem', color: '#64748b' }}>{v.description}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button
                                                onClick={() => handleReview(v.id)}
                                                style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                                            >
                                                Review
                                            </button>
                                            <button
                                                onClick={() => handleSuspend(v.id, v.user)}
                                                style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                                            >
                                                Suspend
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mobile-table-card">
                    {violations.map(v => (
                        <div key={v.id} className="v-card">
                            <div style={{ fontWeight: 800, marginBottom: '0.3rem' }}>{v.user}</div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ background: '#ffdada', color: '#c0392b', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>{v.type}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem 0' }}>{v.description}</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => handleReview(v.id)} style={{ color: '#3498db', background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: 800 }}>Review</button>
                                <button onClick={() => handleSuspend(v.id, v.user)} style={{ color: '#e74c3c', background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: 800 }}>Suspend</button>
                            </div>
                        </div>
                    ))}
                    {violations.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No recent violations.</div>
                    )}
                </div>
            </div>
        </div>

    );
}
