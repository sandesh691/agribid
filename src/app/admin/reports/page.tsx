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

                {selectedReport && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
                        padding: '1rem'
                    }}>
                        <div className="card animate-up" style={{ width: '100%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Report Details</h3>
                                <button onClick={() => setSelectedReport(null)} style={{ border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: '1.2rem', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.9rem' }}><strong>From:</strong> <span style={{ color: '#64748b' }}>{selectedReport.user.email} ({selectedReport.user.role})</span></div>
                                <div style={{ fontSize: '0.9rem' }}><strong>Type:</strong> <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>{selectedReport.type.split('_').join(' ')}</span></div>
                                <div style={{ fontSize: '0.9rem' }}><strong>Subject:</strong> {selectedReport.subject}</div>
                                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginTop: '0.5rem', border: '1px solid #e2e8f0' }}>
                                    <strong style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Description:</strong>
                                    <p style={{ whiteSpace: 'pre-wrap', marginBottom: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{selectedReport.description}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '800', fontSize: '0.9rem' }}>Admin Note / Response</label>
                                <textarea
                                    className="full-width-mobile"
                                    rows={4}
                                    value={adminNote}
                                    onChange={e => setAdminNote(e.target.value)}
                                    placeholder="Add a response or internal note..."
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => updateReportStatus(selectedReport.id, 'IN_PROGRESS')}
                                    disabled={updating}
                                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: 'none', background: '#eab308', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', transition: 'filter 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                                >
                                    {updating ? 'Updating...' : 'In Progress'}
                                </button>
                                <button
                                    onClick={() => updateReportStatus(selectedReport.id, 'RESOLVED')}
                                    disabled={updating}
                                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: 'none', background: 'var(--primary-green)', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', transition: 'filter 0.2s' }}
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
        </div>
    );
}
