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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card" style={{ borderTop: '4px solid #3498db' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Users</span>
                    <h2>{stats.users}</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--primary-green)' }}>12 New this week</p>
                </div>
                <div className="card" style={{ borderTop: '4px solid #2ecc71' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Market Volume</span>
                    <h2>₹4.2L</h2>
                    <p style={{ fontSize: '0.8rem' }}>Last 30 days</p>
                </div>
                <div className="card" style={{ borderTop: '4px solid #f1c40f' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pending Disputes</span>
                    <h2>3</h2>
                    <p style={{ fontSize: '0.8rem', color: '#e67e22' }}>Awaiting Admin action</p>
                </div>
                <div className="card" style={{ borderTop: '4px solid #e74c3c' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>AI Alerts</span>
                    <h2 style={{ color: '#e74c3c' }}>{stats.violations}</h2>
                    <p style={{ fontSize: '0.8rem' }}>2 Critical violations</p>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#e74c3c' }}>⚠️</span> Recent AI Integrity Violations
                </h3>
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
                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{v.user}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#ffdada', color: '#c0392b', fontSize: '0.8rem', fontWeight: 'bold' }}>{v.type}</span>
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '0.9rem', color: '#666' }}>{v.description}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                    <button
                                        onClick={() => handleReview(v.id)}
                                        style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}
                                    >
                                        Review
                                    </button>
                                    <button
                                        onClick={() => handleSuspend(v.id, v.user)}
                                        style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Suspend
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {violations.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No recent violations.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
