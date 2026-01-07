import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/admin-sidebar';

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

            {/* Admin Content */}
            <main style={{ flex: 1, padding: '2rem', maxWidth: 'calc(100vw - 280px)', overflowX: 'hidden' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2.5rem',
                    background: 'white',
                    padding: '1.25rem 2rem',
                    borderRadius: '20px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>System Administration</h1>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Welcome back, Super Admin</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Admin Portal</div>
                            <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>● System Online</div>
                        </div>
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
                </header>

                <div className="animate-fade">
                    {children}
                </div>
            </main>
        </div>
    );
}
