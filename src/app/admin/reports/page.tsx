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
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>User Reports & Complaints</h2>

            {loading ? <p>Loading reports...</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '1rem' }}>User / Role</th>
                                <th style={{ padding: '1rem' }}>Type</th>
                                <th style={{ padding: '1rem' }}>Subject</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report: any) => (
                                <tr key={report.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{report.user.email}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{report.user.role}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: '#f1f5f9' }}>
                                            {report.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{report.subject}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                            background: report.status === 'RESOLVED' ? '#dcfce7' : report.status === 'IN_PROGRESS' ? '#fef9c3' : '#fee2e2',
                                            color: report.status === 'RESOLVED' ? '#166534' : report.status === 'IN_PROGRESS' ? '#854d0e' : '#991b1b'
                                        }}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => {
                                                setSelectedReport(report);
                                                setAdminNote(report.adminNote || '');
                                            }}
                                            style={{ color: 'var(--primary-green)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedReport && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3>Report Details</h3>
                            <button onClick={() => setSelectedReport(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p><strong>From:</strong> {selectedReport.user.email} ({selectedReport.user.role})</p>
                            <p><strong>Type:</strong> {selectedReport.type}</p>
                            <p><strong>Subject:</strong> {selectedReport.subject}</p>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                                <strong>Description:</strong>
                                <p style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>{selectedReport.description}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Admin Note / Response</label>
                            <textarea
                                rows={4}
                                value={adminNote}
                                onChange={e => setAdminNote(e.target.value)}
                                placeholder="Add a response or internal note..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => updateReportStatus(selectedReport.id, 'IN_PROGRESS')}
                                disabled={updating}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: 'none', background: '#eab308', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Mark In Progress
                            </button>
                            <button
                                onClick={() => updateReportStatus(selectedReport.id, 'RESOLVED')}
                                disabled={updating}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: 'none', background: 'var(--primary-green)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Mark Resolved
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
