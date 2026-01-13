'use client';

import { useState, useEffect } from 'react';

export default function UserModerationPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        try {
            const res = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const verifyUser = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}/verify`, {
                method: 'PATCH'
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card">
            <style jsx>{`
                .mobile-users {
                    display: none;
                }
                @media (max-width: 768px) {
                    .desktop-table {
                        display: none;
                    }
                    .mobile-users {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .user-card {
                        background: #f8fafc;
                        padding: 1rem;
                        border-radius: 12px;
                        border: 1px solid #e2e8f0;
                    }
                    .user-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 0.75rem;
                    }
                }
            `}</style>

            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 800 }}>User Moderation</h2>

            {loading ? <p>Loading users...</p> : (
                <>
                    <div className="desktop-table">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>User / Role</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Verification</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Account Status</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Trust Score</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{user.email}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{user.role}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {user.verified ? (
                                                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem' }}>✅ Verified</span>
                                            ) : (
                                                <button onClick={() => verifyUser(user.id)} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>Verify Now</button>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                background: user.accountStatus === 'ACTIVE' ? '#f0fdf4' : '#fef2f2',
                                                color: user.accountStatus === 'ACTIVE' ? '#16a34a' : '#ef4444',
                                                fontSize: '0.75rem',
                                                fontWeight: 800
                                            }}>
                                                {user.accountStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 700 }}>{user.trustScore}%</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => toggleStatus(user.id, user.accountStatus)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: user.accountStatus === 'ACTIVE' ? '#ef4444' : '#16a34a',
                                                    cursor: 'pointer',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {user.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mobile-users">
                        {users.map(user => (
                            <div key={user.id} className="user-card">
                                <div className="user-header">
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.email}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>{user.role}</div>
                                    </div>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        background: user.accountStatus === 'ACTIVE' ? '#f0fdf4' : '#fef2f2',
                                        color: user.accountStatus === 'ACTIVE' ? '#16a34a' : '#ef4444',
                                        fontSize: '0.65rem',
                                        fontWeight: 800
                                    }}>
                                        {user.accountStatus}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        {user.verified ? <span style={{ color: '#16a34a', fontWeight: 700 }}>✅ Verified</span> : <span style={{ color: '#64748b' }}>Unverified</span>}
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Score: <b>{user.trustScore}%</b></div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {!user.verified && <button onClick={() => verifyUser(user.id)} style={{ padding: '4px 8px', fontSize: '0.7rem', background: '#15803d', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 700 }}>Verify</button>}
                                        <button
                                            onClick={() => toggleStatus(user.id, user.accountStatus)}
                                            style={{
                                                padding: '4px 8px',
                                                fontSize: '0.7rem',
                                                background: user.accountStatus === 'ACTIVE' ? '#fef2f2' : '#f0fdf4',
                                                color: user.accountStatus === 'ACTIVE' ? '#ef4444' : '#16a34a',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontWeight: 800
                                            }}
                                        >
                                            {user.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
