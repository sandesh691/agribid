'use client';

import { useState } from 'react';

export default function DisputeResolutionPage() {
    const [disputes] = useState([
        { id: 'd1', transactionId: 'TX-1002', reporter: 'retailer@example.com', target: 'farmer@example.com', reason: 'Quality Mismatch', status: 'PENDING', date: '2025-12-25' },
        { id: 'd2', transactionId: 'TX-1045', reporter: 'farmer@example.com', target: 'retailer@example.com', reason: 'Payment Delay', status: 'RESOLVED', date: '2025-12-24' }
    ]);

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>Dispute Resolution</h2>
            <div style={{ padding: '2rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '12px', border: '2px dashed #ddd' }}>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>The Direct Dispute Settlement API is currently being integrated with the Government e-Kisan portal.</p>
                <div style={{ display: 'grid', gap: '1rem', textAlign: 'left' }}>
                    {disputes.map(d => (
                        <div key={d.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#c0392b', fontWeight: 'bold' }}>{d.reason}</div>
                                <div style={{ fontWeight: 'bold' }}>Trans: {d.transactionId}</div>
                                <div style={{ fontSize: '0.85rem' }}>Reporter: {d.reporter}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>{d.date}</div>
                                <span style={{ padding: '4px 8px', borderRadius: '4px', background: d.status === 'PENDING' ? '#fff4e5' : '#e8f5e9', color: d.status === 'PENDING' ? '#b45309' : '#166534', fontSize: '0.75rem', fontWeight: 'bold' }}>{d.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
