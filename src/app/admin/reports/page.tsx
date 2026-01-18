'use client';

import { useState, useEffect } from 'react';

export default function AdminReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [adminNote, setAdminNote] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/admin/reports');
            const data = await res.json();
            setReports(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateReportStatus = async (id: string, status: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, adminNote })
            });
            if (res.ok) {
                setSelectedReport(null);
                setAdminNote('');
                fetchReports();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div>
            <style jsx>{`
                .mobile-reports {
                    display: none;
                }
                @media (max-width: 768px) {
                    .desktop-table {
                        display: none;
                    }
                    .mobile-reports {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .report-card {
                        background: white;
                        padding: 1.25rem;
                        border-radius: 16px;
                        border: 1px solid #e2e8f0;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    }
                }
            `}</style>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 800 }}>User Reports & Complaints</h2>

                {loading ? <p>Loading reports...</p> : (
                    <>
                        <div className="desktop-table" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '1rem', fontSize: '0.85rem' }}>User / Role</th>
                                        <th style={{ padding: '1rem', fontSize: '0.85rem' }}>Type</th>
                                        <th style={{ padding: '1rem', fontSize: '0.85rem' }}>Subject</th>
                                        <th style={{ padding: '1rem', fontSize: '0.85rem' }}>Status</th>
                                        <th style={{ padding: '1rem', fontSize: '0.85rem' }}>Date</th>
                                        <th style={{ padding: '1rem', fontSize: '0.85rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report: any) => (
                                        <tr key={report.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{report.user.email}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{report.user.role}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', background: '#f1f5f9', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                    {report.type.split('_').join(' ')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{report.subject}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: '800',
                                                    background: report.status === 'RESOLVED' ? '#dcfce7' : report.status === 'IN_PROGRESS' ? '#fef9c3' : '#fee2e2',
                                                    color: report.status === 'RESOLVED' ? '#166534' : report.status === 'IN_PROGRESS' ? '#854d0e' : '#991b1b'
                                                }}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedReport(report);
                                                        setAdminNote(report.adminNote || '');
                                                    }}
                                                    style={{ color: 'var(--primary-green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mobile-reports">
                            {reports.map((report: any) => (
                                <div key={report.id} className="report-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{report.user.email}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{report.user.role}</div>
                                        </div>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontWeight: '800',
                                            background: report.status === 'RESOLVED' ? '#dcfce7' : report.status === 'IN_PROGRESS' ? '#fef9c3' : '#fee2e2',
                                            color: report.status === 'RESOLVED' ? '#166534' : report.status === 'IN_PROGRESS' ? '#854d0e' : '#991b1b'
                                        }}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: '#f1f5f9', fontWeight: 700 }}>
                                            {report.type.split('_').join(' ')}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{report.subject}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>{new Date(report.createdAt).toLocaleDateString()}</div>
                                    <button
                                        onClick={() => {
                                            setSelectedReport(report);
                                            setAdminNote(report.adminNote || '');
                                        }}
                                        style={{ width: '100%', padding: '0.6rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: 'var(--primary-green)', fontWeight: 800, fontSize: '0.85rem' }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {selectedReport && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    padding: '20px',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="card animate-up" style={{
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        padding: '2rem',
                        position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: '#1e293b' }}>Report Details</h3>
                            <button
                                onClick={() => setSelectedReport(null)}
                                style={{
                                    border: 'none',
                                    background: '#f1f5f9',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                            >
                                &times;
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '0.95rem' }}>
                                <strong style={{ color: '#64748b' }}>From:</strong>
                                <span style={{ marginLeft: '8px', fontWeight: 600 }}>{selectedReport.user.email}</span>
                                <span style={{ marginLeft: '8px', fontSize: '0.8rem', padding: '2px 6px', background: '#e2e8f0', borderRadius: '4px', color: '#475569' }}>{selectedReport.user.role}</span>
                            </div>
                            <div style={{ fontSize: '0.95rem' }}>
                                <strong style={{ color: '#64748b' }}>Type:</strong>
                                <span style={{ marginLeft: '8px', color: 'var(--primary-green)', fontWeight: 800 }}>{selectedReport.type.split('_').join(' ')}</span>
                            </div>
                            <div style={{ fontSize: '0.95rem' }}>
                                <strong style={{ color: '#64748b' }}>Subject:</strong>
                                <span style={{ marginLeft: '8px', fontWeight: 600 }}>{selectedReport.subject}</span>
                            </div>

                            <div style={{
                                background: '#f8fafc',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                marginTop: '0.5rem',
                                border: '1px solid #e2e8f0',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                <strong style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</strong>
                                <p style={{ whiteSpace: 'pre-wrap', marginBottom: 0, fontSize: '1rem', lineHeight: '1.6', color: '#334155' }}>{selectedReport.description}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '800', fontSize: '0.9rem', color: '#475569' }}>Admin Note / Response</label>
                            <textarea
                                className="full-width-mobile"
                                rows={4}
                                value={adminNote}
                                onChange={e => setAdminNote(e.target.value)}
                                placeholder="Add a response or internal note for this report..."
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    background: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = 'var(--primary-green)'}
                                onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => updateReportStatus(selectedReport.id, 'IN_PROGRESS')}
                                disabled={updating}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: '#f59e0b',
                                    color: 'white',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                            >
                                {updating ? 'Updating...' : 'In Progress'}
                            </button>
                            <button
                                onClick={() => updateReportStatus(selectedReport.id, 'RESOLVED')}
                                disabled={updating}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'var(--primary-green)',
                                    color: 'white',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(21, 128, 61, 0.2)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                            >
                                {updating ? 'Updating...' : 'Mark Resolved'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
