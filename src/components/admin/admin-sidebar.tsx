'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Scale,
    Flag,
    AlertTriangle,
    Home,
    LogOut,
    Shield
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'User Moderation', href: '/admin/users', icon: Users },
    { name: 'Marketplace Audit', href: '/admin/crops', icon: ShoppingBag },
    { name: 'Dispute Resolution', href: '/admin/disputes', icon: Scale },
    { name: 'User Reports', href: '/admin/reports', icon: Flag },
    { name: 'AI Violations', href: '/admin/ai-violations', icon: AlertTriangle, color: '#ef4444' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside style={{
            width: '280px',
            background: 'white',
            borderRight: '1px solid #f1f5f9',
            padding: '2rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0,
            boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
        }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                        color: 'white',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(21, 128, 61, 0.2)'
                    }}>
                        <Shield size={22} fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <div>
                        <h2 style={{
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            color: '#1e293b',
                            lineHeight: 1.2
                        }}>
                            AgriBid
                        </h2>
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#15803d',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Admin Portal
                        </span>
                    </div>
                </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                            style={{
                                color: isActive ? '#15803d' : '#64748b',
                                border: isActive ? '1px solid rgba(21, 128, 61, 0.1)' : '1px solid transparent'
                            }}
                        >
                            <Icon size={18} style={{ color: item.color || (isActive ? '#15803d' : '#94a3b8') }} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div style={{
                marginTop: 'auto',
                paddingTop: '1.5rem',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                <Link
                    href="/"
                    className="sidebar-link"
                    style={{ fontSize: '0.9rem' }}
                >
                    <Home size={18} />
                    <span>Back to Home</span>
                </Link>

                <form action="/api/auth/logout" method="POST">
                    <button
                        type="submit"
                        className="sidebar-link"
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: '#ef4444'
                        }}
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
