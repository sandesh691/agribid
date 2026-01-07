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
            <h2 style={{ marginBottom: '1.5rem' }}>User Moderation</h2>
            {loading ? <p>Loading users...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '1rem' }}>User / Role</th>
                            <th style={{ padding: '1rem' }}>Verification</th>
                            <th style={{ padding: '1rem' }}>Account Status</th>
                            <th style={{ padding: '1rem' }}>Trust Score</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{user.email}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.role}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {user.verified ? (
                                        <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>✅ Verified</span>
                                    ) : (
                                        <button onClick={() => verifyUser(user.id)} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Verify Now</button>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: user.accountStatus === 'ACTIVE' ? '#e8f5e9' : '#ffebee',
                                        color: user.accountStatus === 'ACTIVE' ? '#2e7d32' : '#c62828',
                                        fontSize: '0.8rem'
                                    }}>
                                        {user.accountStatus}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{user.trustScore}%</td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => toggleStatus(user.id, user.accountStatus)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: user.accountStatus === 'ACTIVE' ? '#c62828' : '#2e7d32',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        {user.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
