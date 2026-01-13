import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/admin-sidebar';
import Link from 'next/link';
import { Home, LogOut, LayoutDashboard, Users, ShoppingBag, Flag } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('agribid-session')?.value;

    if (!sessionToken) {
        redirect('/login');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <AdminSidebar />

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-flex glass" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70px',
                background: 'white',
                borderTop: '1px solid #e2e8f0',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 1000,
                padding: '0 0.5rem'
            }}>
                <Link href="/admin" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#64748b', textDecoration: 'none', fontSize: '0.65rem', fontWeight: '800' }}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link href="/admin/users" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#64748b', textDecoration: 'none', fontSize: '0.65rem', fontWeight: '800' }}>
                    <Users size={20} />
                    <span>Users</span>
                </Link>
                <Link href="/admin/crops" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#64748b', textDecoration: 'none', fontSize: '0.65rem', fontWeight: '800' }}>
                    <ShoppingBag size={20} />
                    <span>Audit</span>
                </Link>
                <Link href="/admin/reports" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#64748b', textDecoration: 'none', fontSize: '0.65rem', fontWeight: '800' }}>
                    <Flag size={20} />
                    <span>Reports</span>
                </Link>
            </nav>

            {/* Admin Content */}
            <main className="admin-main" style={{ flex: 1, padding: '1rem', overflowX: 'hidden', paddingBottom: '90px' }}>
                <style jsx>{`
                    .admin-main {
                        margin-left: 0;
                    }
                    @media (min-width: 769px) {
                        .admin-main {
                            padding: 2rem !important;
                            max-width: calc(100vw - 280px);
                        }
                    }
                `}</style>
                <header style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '2rem',
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: '20px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Link href="/" className="mobile-only" style={{
                                color: '#15803d',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                background: '#f0fdf4',
                                borderRadius: '12px'
                            }}>
                                <Home size={20} />
                            </Link>
                            <div>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Admin Portal</h1>
                                <p className="desktop-only" style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>System Administration Control</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ textAlign: 'right' }} className="desktop-only">
                                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Super Admin</div>
                                <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>● System Online</div>
                            </div>
                            <form action="/api/auth/logout" method="POST" className="mobile-only" style={{ margin: 0 }}>
                                <button type="submit" style={{
                                    background: '#fef2f2',
                                    border: 'none',
                                    color: '#ef4444',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>
                                    <LogOut size={20} />
                                </button>
                            </form>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700
                            }}>A</div>
                        </div>
                    </div>
                </header>

                <div className="animate-fade">
                    {children}
                </div>
            </main>
        </div>
    );
}

