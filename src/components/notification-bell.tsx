'use client';

import { useState, useEffect } from 'react';

export function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.read).length);
            }
        } catch (err) {
            console.error('Fetch notifications error:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '0.5rem'
                }}
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        background: '#c62828',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '2px 5px',
                        borderRadius: '10px',
                        fontWeight: 'bold'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '300px',
                    maxHeight: '400px',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    overflowY: 'auto',
                    padding: '1rem'
                }}>
                    <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}>Notifications</h4>
                    {notifications.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>No new alerts</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        background: n.read ? 'transparent' : 'rgba(45, 90, 39, 0.05)',
                                        border: '1px solid #eee',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{n.title}</div>
                                    <p style={{ fontSize: '0.8rem', color: '#444', margin: 0 }}>{n.message}</p>
                                    <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.5rem' }}>
                                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    }
                </div>
            )}
        </div>
    );
}
